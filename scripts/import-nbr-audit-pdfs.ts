/**
 * Import NBR audit selection PDFs into Supabase.
 *
 *   npm run import:nbr -- [options] <file.pdf> [more.pdf ...]
 *
 * Reads each PDF locally, rebuilds its table from text positions, normalises
 * and validates every row, then upserts into the existing audit tables:
 *
 *   TIN lists → public.audit_tin  (unique on tin + assessment_year)
 *   BIN lists → public.audit_bin  (unique on bin)
 *
 * Without --commit nothing is written to the database (dry run): the parsed
 * rows and the rejected rows are written as CSV to --out for review.
 *
 * Options
 *   --commit                 Write to Supabase. Needs SUPABASE_SERVICE_ROLE_KEY.
 *   --kind tin|bin           Force list type (default: detected from the header).
 *   --assessment-year Y      e.g. 2023-2024. Used when the PDF has no year column.
 *   --submission-type T      Used when the PDF has no submission-type column.
 *   --label TEXT             Stored in `source` (TIN) / `list_label` (BIN).
 *   --columns a,b,c          Column order when the header cannot be read, using
 *                            sl,tin,bin,name,zone,circle,submission_type,
 *                            assessment_year,address or skip.
 *   --out DIR                Report folder (default: nbr-import-output).
 *   --batch-size N           Rows per upsert request (default 500).
 *   --gap N                  Min. horizontal gap in pt between cells (default 8).
 *   --wrap auto|top|center   Where wrapped cell text sits relative to the TIN/BIN
 *                            line when the PDF has no row borders (default auto).
 *   --max-pages N            Only read the first N pages of each file (testing).
 *   --debug-page N           Print the reconstructed lines of page N and exit.
 *
 * Environment (read from .env.local / .env when present)
 *   SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY   server-only key; never commit or expose it.
 */

import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { parseArgs } from 'node:util';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { getDocument, OPS, Util } from 'pdfjs-dist/legacy/build/pdf.mjs';

type PdfPage = Awaited<ReturnType<Awaited<ReturnType<typeof getDocument>['promise']>['getPage']>>;

/* ------------------------------------------------------------------ types */

type Kind = 'tin' | 'bin';

type ColumnKey =
  | 'sl'
  | 'tin'
  | 'bin'
  | 'name'
  | 'zone'
  | 'circle'
  | 'submission_type'
  | 'assessment_year'
  | 'address'
  | 'skip';

interface Item {
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Line {
  y: number;
  height: number;
  items: Item[];
}

/** Table borders on a page, in viewport coordinates (origin top-left). */
interface Rulings {
  /** x positions of vertical borders. */
  xs: number[];
  /** y positions of horizontal borders. */
  ys: number[];
}

interface Column {
  key: ColumnKey | 'extra';
  /** Header text as printed, used as the key for unmapped columns. */
  label: string;
  left: number;
  right: number;
}

interface Layout {
  columns: Column[];
  kind: Kind;
  /** Where each column starts/ends when assigning items (x boundaries). */
  bounds: number[];
}

interface RawRow {
  page: number;
  indexOnPage: number;
  cells: Map<Column, string[]>;
}

interface TinRow {
  tin: string;
  assessment_year: string;
  name: string;
  zone: string;
  circle: string;
  submission_type: string;
  bin: string | null;
  details: Record<string, string>;
  source: string;
  source_pdf: string;
  source_page: number;
  source_row: string;
  updated_at: string;
}

interface BinRow {
  bin: string;
  name: string;
  address: string;
  list_label: string;
  source: string;
  source_page: number;
  source_row: string;
}

interface Reject {
  file: string;
  page: number;
  row: string;
  reason: string;
  raw: string;
}

interface FileResult {
  file: string;
  sha256: string;
  kind: Kind;
  pages: number;
  rows: (TinRow | BinRow)[];
  rejects: Reject[];
  skippedLines: number;
}

/* ---------------------------------------------------------------- options */

const { values: opts, positionals: files } = parseArgs({
  allowPositionals: true,
  options: {
    commit: { type: 'boolean', default: false },
    kind: { type: 'string' },
    'assessment-year': { type: 'string' },
    'submission-type': { type: 'string' },
    label: { type: 'string' },
    columns: { type: 'string' },
    out: { type: 'string', default: 'nbr-import-output' },
    'batch-size': { type: 'string', default: '500' },
    gap: { type: 'string', default: '8' },
    wrap: { type: 'string', default: 'auto' },
    'max-pages': { type: 'string' },
    'debug-page': { type: 'string' },
    help: { type: 'boolean', short: 'h', default: false },
  },
});

const COLUMN_KEYS: ColumnKey[] = [
  'sl',
  'tin',
  'bin',
  'name',
  'zone',
  'circle',
  'submission_type',
  'assessment_year',
  'address',
  'skip',
];

const GAP = Number(opts.gap);
const BATCH_SIZE = Math.max(1, Number(opts['batch-size']));
const MAX_PAGES = opts['max-pages'] ? Number(opts['max-pages']) : Infinity;
const DEBUG_PAGE = opts['debug-page'] ? Number(opts['debug-page']) : null;
const FORCED_KIND = opts.kind as Kind | undefined;
const WRAP = opts.wrap as 'auto' | 'top' | 'center';
const FORCED_COLUMNS = opts.columns?.split(',').map((c) => c.trim()) as ColumnKey[] | undefined;

/* ---------------------------------------------------------- normalisation */

const BANGLA_DIGITS = '০১২৩৪৫৬৭৮৯';

function asciiDigits(value: string) {
  return value.replace(/[০-৯]/g, (d) => String(BANGLA_DIGITS.indexOf(d)));
}

function clean(value: string) {
  return asciiDigits(value).replace(/\s+/g, ' ').trim();
}

function digitsOf(value: string) {
  return asciiDigits(value).replace(/\D/g, '');
}

function normaliseTin(value: string): string | null {
  const digits = digitsOf(value);
  return /^\d{12}$/.test(digits) ? digits : null;
}

function normaliseBin(value: string): string | null {
  const digits = digitsOf(value);
  return /^\d{13}$/.test(digits) ? `${digits.slice(0, 9)}-${digits.slice(9)}` : null;
}

/** "2023-24", "2023 - 2024", "২০২৩-২০২৪" → "2023-2024". */
function normaliseAssessmentYear(value: string): string | null {
  const match = asciiDigits(value).match(/(\d{4})\s*[-–—/]\s*(\d{2}|\d{4})\b/);
  if (!match) return null;
  const start = Number(match[1]);
  const end = match[2].length === 2 ? Math.floor(start / 100) * 100 + Number(match[2]) : Number(match[2]);
  if (end !== start + 1 || start < 1990 || start > 2100) return null;
  return `${start}-${end}`;
}

/* ------------------------------------------------------------ header aliases */

/**
 * Order matters: the first match wins ("Zone Name" is a zone, not a name).
 * Bangla titles are matched on their consonant skeleton (vowel signs,
 * hasanta and spaces removed) because PDF text extraction often returns
 * Bangla glyphs in visual order, e.g. "সার্কেল" comes out as "সােক  ল".
 */
const HEADER_ALIASES: [ColumnKey, RegExp, RegExp | null][] = [
  ['sl', /^(s\.?\s*l\.?|sl\.?\s*no\.?|serial|ser\.?\s*no|no\.)$|^sl\b|^serial/i, /করমক|করম/],
  ['bin', /\bbin\b/i, /বআইএন/],
  ['tin', /\b(e-?)?tin\b/i, /আইএন/],
  ['zone', /zone/i, /অঞচল/],
  ['circle', /circle/i, /স.?কল/],
  ['submission_type', /submission|return\s*type|type\s*of\s*return|filing/i, /দখল/],
  ['assessment_year', /assessment|\ba\.?\s*y\.?\b|tax\s*year|income\s*year/i, /করব.?ষ/],
  ['address', /address/i, /ঠকন/],
  ['name', /name|taxpayer|assessee/i, /করদত|নম(?!ব)/],
];

function banglaSkeleton(text: string) {
  return text.replace(/[ঁ-ঃ়-্ৗৢৣ‌‍\s|,.:()-]/g, '');
}

function headerKey(text: string): ColumnKey | null {
  const value = text.trim();
  if (!value) return null;
  const skeleton = banglaSkeleton(value);
  for (const [key, english, bangla] of HEADER_ALIASES) {
    if (english.test(value) || (bangla && bangla.test(skeleton))) return key;
  }
  return null;
}

/* ------------------------------------------------------------ PDF geometry */

async function readPage(page: PdfPage): Promise<{ lines: Line[]; rulings: Rulings }> {
  const viewport = page.getViewport({ scale: 1 });
  const [content, operators] = await Promise.all([page.getTextContent(), page.getOperatorList()]);
  const items: Item[] = [];

  for (const raw of content.items) {
    if (!('str' in raw)) continue;
    // Glyphs without a Unicode mapping come out as control characters.
    const text = raw.str.replace(/[\u0000-\u001F\uFFFD]/g, '');
    if (!text.trim()) continue;
    // Viewport coordinates: origin top-left, page rotation applied.
    const [, , , , x, y] = Util.transform(viewport.transform, raw.transform);
    const height = Math.hypot(raw.transform[2], raw.transform[3]) || 8;
    items.push({ text, x, y, width: raw.width, height });
  }

  items.sort((a, b) => a.y - b.y || a.x - b.x);
  const lines: Line[] = [];
  for (const item of items) {
    const line = lines.at(-1);
    if (line && Math.abs(item.y - line.y) <= Math.max(2, Math.min(line.height, item.height) * 0.45)) {
      line.items.push(item);
      line.height = Math.max(line.height, item.height);
    } else {
      lines.push({ y: item.y, height: item.height, items: [item] });
    }
  }
  for (const line of lines) line.items.sort((a, b) => a.x - b.x);
  return { lines, rulings: rulingsOf(operators, viewport.transform) };
}

/**
 * Cell borders from the drawing operators: stroked lines and rectangles
 * (including the thin filled rectangles Word/Excel exports use as borders).
 */
function rulingsOf(operators: { fnArray: number[]; argsArray: unknown[] }, viewportTransform: number[]): Rulings {
  const horizontal: { y: number; x1: number; x2: number }[] = [];
  const vertical: { x: number; y1: number; y2: number }[] = [];
  const stack: number[][] = [];
  let ctm = [1, 0, 0, 1, 0, 0];

  const add = (ax: number, ay: number, bx: number, by: number) => {
    const m = Util.transform(viewportTransform, ctm);
    const [x1, y1] = Util.applyTransform([ax, ay], m);
    const [x2, y2] = Util.applyTransform([bx, by], m);
    if (Math.abs(y1 - y2) < 1 && Math.abs(x1 - x2) >= 10) {
      horizontal.push({ y: (y1 + y2) / 2, x1: Math.min(x1, x2), x2: Math.max(x1, x2) });
    } else if (Math.abs(x1 - x2) < 1 && Math.abs(y1 - y2) >= 5) {
      vertical.push({ x: (x1 + x2) / 2, y1: Math.min(y1, y2), y2: Math.max(y1, y2) });
    }
  };

  operators.fnArray.forEach((fn, index) => {
    const args = operators.argsArray[index] as unknown[];
    if (fn === OPS.save) stack.push(ctm);
    else if (fn === OPS.restore) ctm = stack.pop() ?? [1, 0, 0, 1, 0, 0];
    else if (fn === OPS.transform) ctm = Util.transform(ctm, args as number[]);
    else if (fn === OPS.paintFormXObjectBegin) {
      stack.push(ctm);
      const matrix = args[0] as number[] | null;
      if (matrix) ctm = Util.transform(ctm, matrix);
    } else if (fn === OPS.paintFormXObjectEnd) ctm = stack.pop() ?? [1, 0, 0, 1, 0, 0];
    else if (fn === OPS.constructPath) {
      const [ops, coords] = args as [number[], number[]];
      let j = 0;
      let cx = 0, cy = 0, sx = 0, sy = 0;
      for (const op of ops) {
        if (op === OPS.rectangle) {
          const [x, y, w, h] = coords.slice(j, j + 4);
          j += 4;
          if (Math.abs(h) < 2) add(x, y + h / 2, x + w, y + h / 2);
          else if (Math.abs(w) < 2) add(x + w / 2, y, x + w / 2, y + h);
          else {
            add(x, y, x + w, y);
            add(x, y + h, x + w, y + h);
            add(x, y, x, y + h);
            add(x + w, y, x + w, y + h);
          }
        } else if (op === OPS.moveTo) {
          [cx, cy] = coords.slice(j, j + 2);
          [sx, sy] = [cx, cy];
          j += 2;
        } else if (op === OPS.lineTo) {
          const [nx, ny] = coords.slice(j, j + 2);
          add(cx, cy, nx, ny);
          [cx, cy] = [nx, ny];
          j += 2;
        } else if (op === OPS.curveTo) {
          [cx, cy] = coords.slice(j + 4, j + 6);
          j += 6;
        } else if (op === OPS.curveTo2 || op === OPS.curveTo3) {
          [cx, cy] = coords.slice(j + 2, j + 4);
          j += 4;
        } else if (op === OPS.closePath) {
          add(cx, cy, sx, sy);
          [cx, cy] = [sx, sy];
        }
      }
    }
  });

  // Merge borders drawn cell by cell into one position per table line.
  const cluster = (values: { at: number; length: number }[]) => {
    values.sort((a, b) => a.at - b.at);
    const groups: { at: number; length: number; n: number }[] = [];
    for (const v of values) {
      const last = groups.at(-1);
      if (last && v.at - last.at / last.n <= 2) {
        last.at += v.at;
        last.n += 1;
        last.length += v.length;
      } else groups.push({ at: v.at, length: v.length, n: 1 });
    }
    return groups.map((g) => ({ at: g.at / g.n, length: g.length }));
  };
  const xs = cluster(vertical.map((v) => ({ at: v.x, length: v.y2 - v.y1 })));
  const ys = cluster(horizontal.map((h) => ({ at: h.y, length: h.x2 - h.x1 })));
  const tableWidth = xs.length >= 2 ? xs.at(-1)!.at - xs[0].at : 0;
  return {
    // Ignore stray short strokes (underlines, icons).
    xs: xs.filter((x) => x.length >= 20).map((x) => x.at),
    ys: ys.filter((y) => y.length >= Math.max(60, tableWidth * 0.3)).map((y) => y.at),
  };
}

/** Joins items that touch into cells, splitting where the gap is wide. */
function chunks(line: Line): Item[] {
  const out: Item[] = [];
  for (const item of line.items) {
    const last = out.at(-1);
    if (last && item.x - (last.x + last.width) < GAP) {
      const spacer = item.x - (last.x + last.width) > 1 && !last.text.endsWith(' ') ? ' ' : '';
      last.text += spacer + item.text;
      last.width = item.x + item.width - last.x;
    } else {
      out.push({ ...item });
    }
  }
  return out;
}

function lineText(line: Line) {
  return chunks(line)
    .map((c) => c.text.trim())
    .join(' | ');
}

/* ------------------------------------------------------------------ layout */

function boundsFor(columns: Column[]): number[] {
  // Boundary between two columns: halfway between one's right edge and the
  // next one's left edge. Items are assigned by their horizontal centre.
  const bounds: number[] = [];
  for (let i = 0; i < columns.length - 1; i += 1) {
    bounds.push((columns[i].right + columns[i + 1].left) / 2);
  }
  return bounds;
}

function kindOf(columns: Column[]): Kind | null {
  if (FORCED_KIND) return FORCED_KIND;
  if (columns.some((c) => c.key === 'tin')) return 'tin';
  if (columns.some((c) => c.key === 'bin')) return 'bin';
  return null;
}

/** Any 5+ digit run: a TIN/BIN-like value, so the line is data, not header. */
function looksLikeData(line: Line) {
  return line.items.some((item) => /\d{5,}/.test(asciiDigits(item.text).replace(/[\s-]/g, '')));
}

/**
 * A header has at least two recognised column titles, one of them TIN/BIN.
 * Titles may wrap or be vertically centred over several lines, so the lines
 * around the keyword line are merged and their text grouped by x-overlap.
 * Returns the layout and the index of the last header line.
 */
function detectHeader(lines: Line[], index: number, ys: number[]): { layout: Layout; end: number } | null {
  const base = chunks(lines[index]);
  const hits = base.map((cell) => headerKey(cell.text)).filter(Boolean);
  if (hits.length < 2 || !hits.some((k) => k === 'tin' || k === 'bin')) return null;

  // With row borders the header is exactly the band around the keyword line.
  const centre = (line: Line) => line.y - line.height * 0.35;
  const top = [...ys].reverse().find((y) => y < centre(lines[index]));
  const bottom = ys.find((y) => y > centre(lines[index]));
  const bordered = top !== undefined && bottom !== undefined;

  // Without them: neighbouring lines at a consistent spacing that are not
  // data and do not straddle several header titles (e.g. a title paragraph).
  const straddles = (line: Line) =>
    chunks(line).some((c) => base.filter((b) => c.x < b.x + b.width && c.x + c.width > b.x).length > 1);
  let step = 0;
  const accept = (candidate: Line, neighbour: Line) => {
    if (looksLikeData(candidate)) return false;
    if (bordered) return centre(candidate) > top! && centre(candidate) < bottom!;
    const gap = Math.abs(candidate.y - neighbour.y);
    if (gap > Math.max(candidate.height, neighbour.height) * 1.9 || straddles(candidate)) return false;
    if (step && gap > step * 1.5) return false;
    step = Math.max(step, gap);
    return true;
  };
  let first = index;
  let last = index;
  while (first > 0 && accept(lines[first - 1], lines[first])) first -= 1;
  while (last < lines.length - 1 && accept(lines[last + 1], lines[last])) last += 1;

  // Group the block's text into columns by horizontal overlap.
  const groups: { left: number; right: number; parts: Item[] }[] = [];
  const cells = lines.slice(first, last + 1).flatMap((line) => chunks(line));
  cells.sort((a, b) => a.x - b.x);
  for (const cell of cells) {
    const group = groups.find((g) => cell.x < g.right + 2 && cell.x + cell.width > g.left - 2);
    if (group) {
      group.parts.push(cell);
      group.left = Math.min(group.left, cell.x);
      group.right = Math.max(group.right, cell.x + cell.width);
    } else groups.push({ left: cell.x, right: cell.x + cell.width, parts: [cell] });
  }
  groups.sort((a, b) => a.left - b.left);

  const seen = new Set<ColumnKey>();
  const columns: Column[] = groups.map((g) => {
    const label = clean(g.parts.sort((a, b) => a.y - b.y || a.x - b.x).map((p) => p.text).join(' '));
    const key = headerKey(label);
    const unique = key && !seen.has(key) ? key : null;
    if (unique) seen.add(unique);
    return { key: unique ?? 'extra', label, left: g.left, right: g.right };
  });
  const kind = kindOf(columns);
  if (!kind || !columns.some((c) => c.key === kind)) return null;
  return { layout: { columns, kind, bounds: boundsFor(columns) }, end: last };
}

/**
 * --columns fallback: learn the x positions from data lines that split into
 * exactly as many cells as there are columns.
 */
function layoutFromColumns(lines: Line[], keys: ColumnKey[]): Layout | null {
  const lefts: number[][] = keys.map(() => []);
  const rights: number[][] = keys.map(() => []);
  for (const line of lines) {
    const cells = chunks(line);
    if (cells.length !== keys.length) continue;
    const idIndex = keys.findIndex((k) => k === 'tin' || k === 'bin');
    if (idIndex < 0 || !(normaliseTin(cells[idIndex].text) || normaliseBin(cells[idIndex].text))) continue;
    cells.forEach((cell, i) => {
      lefts[i].push(cell.x);
      rights[i].push(cell.x + cell.width);
    });
  }
  if (!lefts[0].length) return null;
  const median = (values: number[]) => values.sort((a, b) => a - b)[Math.floor(values.length / 2)];
  const columns: Column[] = keys.map((key, i) => ({
    key,
    label: key,
    left: median(lefts[i]),
    right: median(rights[i]),
  }));
  const kind = kindOf(columns);
  return kind ? { columns, kind, bounds: boundsFor(columns) } : null;
}

/**
 * Snaps a text-derived layout onto the page's vertical borders: each band
 * between two borders becomes one column, named by the header text in it.
 */
function snapToRulings(layout: Layout, xs: number[]): Layout {
  if (xs.length < 3) return layout;
  const columns: Column[] = [];
  for (let i = 0; i < xs.length - 1; i += 1) {
    const [left, right] = [xs[i], xs[i + 1]];
    if (right - left < 4) continue;
    const inside = layout.columns.filter((c) => {
      const centre = (c.left + c.right) / 2;
      return centre > left && centre < right;
    });
    const label = inside.map((c) => c.label).join(' ').trim();
    const keyed = inside.find((c) => c.key !== 'extra');
    columns.push({ key: keyed?.key ?? headerKey(label) ?? 'extra', label, left, right });
  }
  if (!columns.some((c) => c.key === layout.kind)) return layout;
  // Keep one column per key: a later duplicate becomes an extra column.
  const seen = new Set<string>();
  for (const column of columns) {
    if (column.key === 'extra') continue;
    if (seen.has(column.key)) column.key = 'extra';
    else seen.add(column.key);
  }
  return { columns, kind: layout.kind, bounds: columns.slice(1).map((c) => c.left) };
}

function columnIndex(layout: Layout, x: number) {
  let i = 0;
  while (i < layout.bounds.length && x > layout.bounds[i]) i += 1;
  return i;
}

function splitLine(layout: Layout, line: Line): string[] {
  const cells = layout.columns.map(() => [] as Item[]);
  // Assign raw text runs (not merged chunks) so neighbouring cells never
  // bleed into each other, then re-join runs inside each cell.
  for (const item of line.items) {
    cells[columnIndex(layout, item.x + Math.min(item.width, 12) / 2)].push(item);
  }
  return cells.map((items) => (items.length ? chunks({ y: line.y, height: line.height, items }).map((c) => c.text.trim()).join(' ') : ''));
}

/* ------------------------------------------------------------------- rows */

/**
 * A row starts on a line whose ID column holds a number — valid or not, so
 * malformed TINs/BINs become visible rejects instead of vanishing — or whose
 * SL column holds a serial number next to a non-empty ID cell.
 */
function isAnchor(layout: Layout, cells: string[]) {
  const id = layout.columns.findIndex((c) => c.key === layout.kind);
  if (id < 0 || !cells[id]) return false;
  if (digitsOf(cells[id]).length >= 5) return true;
  const sl = layout.columns.findIndex((c) => c.key === 'sl');
  return sl >= 0 && /^\d{1,7}\.?$/.test(clean(cells[sl]));
}

/**
 * Groups a page's data lines into rows, anchored on the line holding the
 * TIN/BIN. With horizontal borders every band between two borders is one
 * row. Without them, wrapped text is attached to the row above (top-aligned
 * cells) or to the nearest row (vertically centred cells).
 */
function rowsOnPage(
  layout: Layout,
  lines: Line[],
  page: number,
  ys: number[],
): { rows: RawRow[]; skipped: number; carried: string[][] } {
  const split = lines.map((line) => ({ line, cells: splitLine(layout, line), anchor: false }));
  for (const s of split) s.anchor = isAnchor(layout, s.cells);
  const anchors = split.filter((s) => s.anchor);
  if (!anchors.length) return { rows: [], skipped: lines.length, carried: [] };

  // Text that crosses a column boundary is a title/footer, never a cell.
  const straddles = (line: Line) =>
    line.items.some((item) => layout.bounds.some((b) => item.x < b - 1 && item.x + item.width > b + 1));
  // Cell text above the first row, continuing a row split by the page break.
  const carried: string[][] = [];

  const rows: RawRow[] = anchors.map((anchor, index) => ({
    page,
    indexOnPage: index + 1,
    cells: new Map(layout.columns.map((c, i) => [c, anchor.cells[i] ? [anchor.cells[i]] : []])),
  }));
  const rowOf = new Map(anchors.map((a, i) => [a, i]));
  const attach = (s: (typeof split)[number], row: number) => {
    const before = s.line.y < anchors[row].line.y;
    layout.columns.forEach((column, i) => {
      if (!s.cells[i]) return;
      const list = rows[row].cells.get(column)!;
      if (before) list.unshift(s.cells[i]);
      else list.push(s.cells[i]);
    });
  };

  const centre = (line: Line) => line.y - line.height * 0.35;
  const band = (line: Line) => {
    let i = 0;
    while (i < ys.length && centre(line) > ys[i]) i += 1;
    return i;
  };
  // Borders are usable when they separate every anchor into its own band.
  const anchorBands = anchors.map((a) => band(a.line));
  const bordered = ys.length >= 3 && new Set(anchorBands).size === anchors.length;

  let skipped = 0;
  const spacing = anchors.length > 1 ? (anchors.at(-1)!.line.y - anchors[0].line.y) / (anchors.length - 1) : 30;
  const firstIndex = split.indexOf(anchors[0]);
  const mode =
    WRAP !== 'auto'
      ? WRAP
      : split.slice(0, firstIndex).some((s) => anchors[0].line.y - s.line.y < spacing * 0.9)
        ? 'center'
        : 'top';

  let current = -1;
  for (const s of split) {
    if (s.anchor) {
      current = rowOf.get(s)!;
      continue;
    }
    if (bordered) {
      const b = band(s.line);
      const row = anchorBands.indexOf(b);
      if (row >= 0) attach(s, row);
      else if (b > 0 && b < anchorBands[0] && !straddles(s.line)) carried.push(s.cells);
      else skipped += 1;
      continue;
    }
    if (mode === 'top') {
      if (current < 0) {
        const close = anchors[0].line.y - s.line.y < Math.max(spacing * 3, s.line.height * 6);
        if (close && !straddles(s.line)) carried.push(s.cells);
        else skipped += 1;
        continue;
      }
      const far = s.line.y - anchors[current].line.y > Math.max(spacing * 1.5, s.line.height * 4);
      if (far) skipped += 1;
      else attach(s, current);
      continue;
    }
    let best = 0;
    for (let i = 1; i < anchors.length; i += 1) {
      if (Math.abs(anchors[i].line.y - s.line.y) < Math.abs(anchors[best].line.y - s.line.y)) best = i;
    }
    // Titles, footers and page numbers sit far from any row.
    if (Math.abs(anchors[best].line.y - s.line.y) > Math.max(spacing, s.line.height * 2.5)) skipped += 1;
    else attach(s, best);
  }
  return { rows, skipped, carried };
}

/**
 * Joins wrapped cell lines. A word broken after a hyphen or slash
 * ("Taxes Zone-" + "10") continues without a space; a spaced dash
 * ("Chittagong -" + "4204") keeps it.
 */
function joinParts(parts: string[]) {
  return parts.reduce((text, part) => {
    if (!text) return part;
    const glued = /[\p{L}\p{N}][-/]$/u.test(text) && /^[\p{L}\p{N}]/u.test(part);
    return glued ? text + part : `${text} ${part}`;
  }, '');
}

function cell(row: RawRow, key: ColumnKey) {
  for (const [column, parts] of row.cells) if (column.key === key) return clean(joinParts(parts));
  return '';
}

function rawText(row: RawRow) {
  return [...row.cells].map(([c, parts]) => `${c.label}=${clean(joinParts(parts))}`).join('; ');
}

/* -------------------------------------------------------------- validation */

function toTinRow(row: RawRow, file: string): TinRow | Reject {
  const reject = (reason: string): Reject => ({
    file,
    page: row.page,
    row: cell(row, 'sl') || `#${row.indexOnPage}`,
    reason,
    raw: rawText(row),
  });

  const tin = normaliseTin(cell(row, 'tin'));
  if (!tin) return reject('TIN is not 12 digits');

  const yearText = cell(row, 'assessment_year') || opts['assessment-year'] || '';
  const assessmentYear = normaliseAssessmentYear(yearText);
  if (!assessmentYear) return reject(yearText ? `Unrecognised assessment year "${yearText}"` : 'No assessment year');

  const binText = cell(row, 'bin');
  const bin = binText ? normaliseBin(binText) : null;
  const details: Record<string, string> = {};
  if (binText && !bin) details['BIN (as printed)'] = binText;
  for (const [column, parts] of row.cells) {
    if (column.key !== 'extra') continue;
    const value = clean(joinParts(parts));
    if (value) details[column.label || 'Other'] = value;
  }

  return {
    tin,
    assessment_year: assessmentYear,
    name: cell(row, 'name'),
    zone: cell(row, 'zone'),
    circle: cell(row, 'circle'),
    submission_type: cell(row, 'submission_type') || clean(opts['submission-type'] ?? ''),
    bin,
    details,
    source: opts.label ?? `NBR income tax audit selection, assessment year ${assessmentYear}`,
    source_pdf: file,
    source_page: row.page,
    source_row: cell(row, 'sl') || `#${row.indexOnPage}`,
    updated_at: new Date().toISOString(),
  };
}

function toBinRow(row: RawRow, file: string): BinRow | Reject {
  const sl = cell(row, 'sl') || `#${row.indexOnPage}`;
  const bin = normaliseBin(cell(row, 'bin'));
  if (!bin) return { file, page: row.page, row: sl, reason: 'BIN is not 13 digits', raw: rawText(row) };
  // Some published rows have an empty name cell; the BIN is the identity.
  return {
    bin,
    name: cell(row, 'name'),
    address: cell(row, 'address'),
    list_label: opts.label ?? 'NBR VAT audit selection',
    source: file,
    source_page: row.page,
    source_row: sl,
  };
}

/* ------------------------------------------------------------------- parse */

async function parseFile(filePath: string): Promise<FileResult> {
  const buffer = await readFile(filePath);
  const sha256 = createHash('sha256').update(buffer).digest('hex');
  const file = path.basename(filePath);
  const pdf = await getDocument({
    data: new Uint8Array(buffer),
    useSystemFonts: true,
    isEvalSupported: false,
    verbosity: 0,
  }).promise;

  const pages = Math.min(pdf.numPages, MAX_PAGES);
  let layout: Layout | null = null;
  const rows: (TinRow | BinRow)[] = [];
  const rejects: Reject[] = [];
  let skippedLines = 0;
  // The last row of a page is held back: it may continue on the next page.
  const held: { pending: { row: RawRow; layout: Layout } | null } = { pending: null };
  const emit = (r: RawRow, l: Layout) => {
    const result = l.kind === 'tin' ? toTinRow(r, file) : toBinRow(r, file);
    if ('reason' in result) rejects.push(result);
    else rows.push(result);
  };

  for (let p = 1; p <= pages; p += 1) {
    const page = await pdf.getPage(p);
    const { lines, rulings } = await readPage(page);
    page.cleanup();

    if (DEBUG_PAGE === p) {
      console.log(`\n--- ${file} page ${p}: ${lines.length} lines (cells split by gaps ≥ ${GAP}pt)`);
      for (const line of lines) console.log(`y=${line.y.toFixed(1).padStart(7)}  ${lineText(line)}`);
      if (layout) console.log('\nCurrent layout:', layout.columns.map((c) => `${c.key}(${c.label})`).join(', '));
    }

    // Headers usually repeat on every page; otherwise keep the last layout.
    let dataLines = lines;
    let header: ReturnType<typeof detectHeader> = null;
    let headerIndex = -1;
    for (let i = 0; i < lines.length && !header; i += 1) {
      header = detectHeader(lines, i, rulings.ys);
      if (header) headerIndex = i;
    }
    if (header) {
      layout = header.layout;
      dataLines = lines.slice(header.end + 1);
    } else if (!layout && FORCED_COLUMNS) {
      layout = layoutFromColumns(lines, FORCED_COLUMNS);
    }
    if (FORCED_COLUMNS && layout && headerIndex < 0 && p > 1) {
      // Re-learn per page in --columns mode; column positions can drift.
      layout = layoutFromColumns(lines, FORCED_COLUMNS) ?? layout;
    }
    if (layout) layout = snapToRulings(layout, rulings.xs);

    if (DEBUG_PAGE === p) {
      console.log('Detected layout:', layout ? layout.columns.map((c) => `${c.key}(${c.label}) @${c.left.toFixed(0)}-${c.right.toFixed(0)}`).join(', ') : 'none');
      if (layout) {
        console.log(`Borders: ${rulings.xs.length} vertical, ${rulings.ys.length} horizontal`);
        const { rows: raw, carried } = rowsOnPage(layout, dataLines, p, rulings.ys);
        if (carried.length) console.log(`Carried to previous page's last row: ${carried.map((c) => c.filter(Boolean).join(' | ')).join(' / ')}`);
        for (const r of raw.slice(0, 15)) console.log(' ', rawText(r));
      }
      process.exit(0);
    }

    if (!layout) {
      skippedLines += lines.length;
      continue;
    }

    const { rows: raw, skipped, carried } = rowsOnPage(layout, dataLines, p, rulings.ys);
    skippedLines += skipped;
    const pending = held.pending;
    if (pending) {
      if (pending.layout.columns.length === layout.columns.length) {
        for (const cells of carried) {
          pending.layout.columns.forEach((column, i) => {
            if (cells[i]) pending.row.cells.get(column)!.push(cells[i]);
          });
        }
      } else skippedLines += carried.length;
      emit(pending.row, pending.layout);
      held.pending = null;
    } else skippedLines += carried.length;
    const current = layout;
    raw.forEach((r, i) => {
      if (i === raw.length - 1) held.pending = { row: r, layout: current };
      else emit(r, current);
    });

    if (p % 50 === 0 || p === pages) {
      process.stdout.write(`\r  ${file}: page ${p}/${pages}, ${rows.length} rows, ${rejects.length} rejected`);
    }
  }
  if (held.pending) emit(held.pending.row, held.pending.layout);
  process.stdout.write('\n');
  await pdf.destroy();

  if (!layout) {
    throw new Error(
      `${file}: could not find a table header with a TIN or BIN column. ` +
        'Run with --debug-page 1 to see the text, then pass --columns (and --kind).',
    );
  }
  return { file, sha256, kind: layout.kind, pages, rows, rejects, skippedLines };
}

/* ------------------------------------------------------------ dedupe/report */

function keyOf(row: TinRow | BinRow) {
  return 'tin' in row ? `${row.tin}|${row.assessment_year}` : row.bin;
}

function comparable(row: TinRow | BinRow) {
  const { source_pdf, source_page, source_row, updated_at, source, ...rest } = row as TinRow;
  void source_pdf, source_page, source_row, updated_at, source;
  return JSON.stringify(rest);
}

/** First occurrence wins; exact repeats are dropped, conflicting ones reported. */
function dedupe(results: FileResult[]) {
  const seen = new Map<string, TinRow | BinRow>();
  let duplicates = 0;
  for (const result of results) {
    const kept: (TinRow | BinRow)[] = [];
    for (const row of result.rows) {
      const key = keyOf(row);
      const first = seen.get(key);
      if (!first) {
        seen.set(key, row);
        kept.push(row);
        continue;
      }
      duplicates += 1;
      if (comparable(first) !== comparable(row)) {
        const f = first as TinRow & BinRow;
        result.rejects.push({
          file: result.file,
          page: row.source_page,
          row: row.source_row,
          reason: `Duplicate of ${f.source_pdf ?? f.source} p.${f.source_page} row ${f.source_row} with different values (first kept)`,
          raw: JSON.stringify(row),
        });
      }
    }
    result.rows = kept;
  }
  return duplicates;
}

function csv(rows: Record<string, unknown>[]) {
  if (!rows.length) return '';
  const headers = Object.keys(rows[0]);
  const escape = (value: unknown) => {
    const text = value === null || value === undefined ? '' : typeof value === 'object' ? JSON.stringify(value) : String(value);
    return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
  };
  return [headers.join(','), ...rows.map((row) => headers.map((h) => escape(row[h])).join(','))].join('\n') + '\n';
}

/* ------------------------------------------------------------------ upsert */

/** Loads .env.local then .env; existing environment variables win. */
async function loadEnv() {
  for (const name of ['.env.local', '.env']) {
    if (!existsSync(name)) continue;
    for (const line of (await readFile(name, 'utf8')).split(/\r?\n/)) {
      const match = line.match(/^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/);
      if (!match || process.env[match[1]] !== undefined) continue;
      process.env[match[1]] = match[2].replace(/^(['"])(.*)\1$/, '$2');
    }
  }
}

function adminClient(): SupabaseClient {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      'Set SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL) and SUPABASE_SERVICE_ROLE_KEY in .env.local. ' +
        'The service-role key is required because the audit tables are not writable with the anon key.',
    );
  }
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

async function withRetry<T>(label: string, fn: () => Promise<T>, attempts = 4): Promise<T> {
  for (let attempt = 1; ; attempt += 1) {
    try {
      return await fn();
    } catch (error) {
      if (attempt >= attempts) throw error;
      const wait = 1000 * 2 ** (attempt - 1);
      console.warn(`\n  ${label} failed (${(error as Error).message}); retrying in ${wait / 1000}s`);
      await new Promise((resolve) => setTimeout(resolve, wait));
    }
  }
}

async function upsertFile(supabase: SupabaseClient, result: FileResult) {
  const run = await withRetry('audit_imports', async () => {
    const { data, error } = await supabase
      .from('audit_imports')
      .insert({ kind: result.kind, source_pdf: result.file, file_sha256: result.sha256, pages: result.pages })
      .select('id')
      .single();
    if (error) throw new Error(`audit_imports: ${error.message}`);
    return data;
  });

  const table = result.kind === 'tin' ? 'audit_tin' : 'audit_bin';
  const onConflict = result.kind === 'tin' ? 'tin,assessment_year' : 'bin';
  let upserted = 0;
  try {
    for (let i = 0; i < result.rows.length; i += BATCH_SIZE) {
      const batch = result.rows.slice(i, i + BATCH_SIZE);
      await withRetry(`${table} batch ${i / BATCH_SIZE + 1}`, async () => {
        const { error } = await supabase.from(table).upsert(batch, { onConflict });
        if (error) throw new Error(error.message);
      });
      upserted += batch.length;
      process.stdout.write(`\r  ${result.file}: upserted ${upserted}/${result.rows.length}`);
    }
    process.stdout.write('\n');
    await supabase
      .from('audit_imports')
      .update({
        status: 'completed',
        rows_parsed: result.rows.length + result.rejects.length,
        rows_upserted: upserted,
        rows_rejected: result.rejects.length,
        finished_at: new Date().toISOString(),
      })
      .eq('id', run.id);
  } catch (error) {
    await supabase
      .from('audit_imports')
      .update({ status: 'failed', rows_upserted: upserted, error: (error as Error).message, finished_at: new Date().toISOString() })
      .eq('id', run.id);
    throw error;
  }
  return upserted;
}

/* -------------------------------------------------------------------- main */

async function main() {
  if (opts.help || !files.length) {
    console.log('Usage: npx tsx scripts/import-nbr-audit-pdfs.ts [--commit] [options] <file.pdf> [...]');
    console.log('See the comment at the top of this file for all options.');
    process.exit(files.length ? 0 : 1);
  }
  if (FORCED_KIND && FORCED_KIND !== 'tin' && FORCED_KIND !== 'bin') throw new Error('--kind must be tin or bin');
  if (!['auto', 'top', 'center'].includes(WRAP)) throw new Error('--wrap must be auto, top or center');
  if (FORCED_COLUMNS?.some((c) => !COLUMN_KEYS.includes(c))) {
    throw new Error(`--columns accepts: ${COLUMN_KEYS.join(', ')}`);
  }
  if (opts['assessment-year'] && !normaliseAssessmentYear(opts['assessment-year'])) {
    throw new Error(`--assessment-year "${opts['assessment-year']}" is not like 2023-2024`);
  }
  for (const file of files) if (!existsSync(file)) throw new Error(`File not found: ${file}`);

  await loadEnv();
  const supabase = opts.commit ? adminClient() : null;

  console.log(`Parsing ${files.length} PDF(s)${opts.commit ? '' : ' — dry run, nothing will be written to the database'}`);
  const results: FileResult[] = [];
  const failures: string[] = [];
  for (const file of files) {
    try {
      results.push(await parseFile(file));
    } catch (error) {
      failures.push((error as Error).message);
    }
  }

  const kinds = new Set(results.map((r) => r.kind));
  const duplicates = dedupe(results);

  await mkdir(opts.out!, { recursive: true });
  for (const result of results) {
    const base = path.join(opts.out!, result.file.replace(/\.pdf$/i, ''));
    await writeFile(`${base}.rows.csv`, csv(result.rows as unknown as Record<string, unknown>[]));
    await writeFile(`${base}.rejects.csv`, csv(result.rejects as unknown as Record<string, unknown>[]));
  }

  console.log('\nFile summary');
  console.table(
    results.map((r) => ({
      file: r.file,
      kind: r.kind,
      pages: r.pages,
      rows: r.rows.length,
      rejected: r.rejects.length,
      'ignored lines': r.skippedLines,
    })),
  );
  if (duplicates) console.log(`${duplicates} duplicate row(s) across/within files were dropped (first occurrence kept).`);
  for (const r of results) {
    const reasons = new Map<string, number>();
    for (const reject of r.rejects) reasons.set(reject.reason.replace(/".*"/, '"…"'), (reasons.get(reject.reason.replace(/".*"/, '"…"')) ?? 0) + 1);
    for (const [reason, count] of reasons) console.log(`  ${r.file}: ${count} × ${reason}`);
  }
  console.log(`Reports written to ${path.resolve(opts.out!)}`);

  if (kinds.has('tin') && !results.some((r) => r.kind === 'tin' && r.rows.length)) {
    console.warn('\nNo valid TIN rows. Check the rejects CSV, or use --debug-page / --columns / --assessment-year.');
  }

  if (failures.length) {
    for (const failure of failures) console.error(`\n✗ ${failure}`);
    throw new Error(`${failures.length} file(s) could not be parsed; nothing was imported.`);
  }
  if (!supabase) {
    console.log('\nDry run complete. Review the CSVs, then re-run with --commit to import.');
    return;
  }

  // Fail fast if the importer migration has not been applied.
  const { error: schemaError } = await supabase.from('audit_tin').select('source_pdf, zone, circle').limit(0);
  if (schemaError && /fetch failed|ENOTFOUND|ECONNREFUSED/i.test(schemaError.message)) {
    throw new Error(`Cannot reach Supabase (${schemaError.message}). Check SUPABASE_URL and your internet connection.`);
  }
  if (schemaError) {
    throw new Error(
      `Database is not ready (${schemaError.message}). Apply supabase/migrations/20261001000000_nbr_audit_import.sql first.`,
    );
  }

  let total = 0;
  for (const result of results) {
    if (!result.rows.length) continue;
    total += await upsertFile(supabase, result);
  }

  const [tin, bin] = await Promise.all([
    supabase.from('audit_tin').select('id', { count: 'exact', head: true }),
    supabase.from('audit_bin').select('bin', { count: 'exact', head: true }),
  ]);
  console.log(`\nDone: ${total} row(s) upserted. Database now holds ${tin.count ?? '?'} TIN and ${bin.count ?? '?'} BIN records.`);
  console.log('The website counters refresh within an hour (or on the next admin save).');
}

main().catch((error) => {
  console.error(`\nImport failed: ${(error as Error).message}`);
  process.exit(1);
});
