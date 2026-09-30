/**
 * Schema-driven forms for the admin panel. The same field definitions render
 * the editor on the client and sanitise the payload in the server action, so
 * the database only ever receives the shape the form declares.
 */

export type FieldType =
  | 'text'
  | 'textarea'
  | 'markdown'
  | 'markup'
  | 'url'
  | 'email'
  | 'slug'
  | 'number'
  | 'date'
  | 'toggle'
  | 'select'
  | 'color'
  | 'icon'
  | 'image'
  | 'list'
  | 'group'
  | 'repeater';

export interface Field {
  name: string;
  label: string;
  type: FieldType;
  help?: string;
  placeholder?: string;
  required?: boolean;
  /** Grid span inside a section: full width by default. */
  half?: boolean;
  rows?: number;
  max?: number;
  options?: { value: string; label: string }[];
  /** Storage folder for image uploads. */
  folder?: string;
  /** For group/repeater. */
  fields?: Field[];
  /** Repeater item label: the sub-field shown as the collapsed title. */
  itemLabel?: string;
  /** Group that may be switched off entirely (stored as null). */
  optional?: boolean;
}

export interface FormSection {
  title: string;
  description?: string;
  fields: Field[];
}

export const accentOptions = [
  { value: 'teal', label: 'Teal' },
  { value: 'orange', label: 'Orange' },
  { value: 'gold', label: 'Gold' },
];

/* --------------------------------------------------------------- sanitise */

const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;

export class ValidationError extends Error {}

function str(value: unknown, max = 20000): string {
  if (value === null || value === undefined) return '';
  return String(value).slice(0, max).trim();
}

function sanitizeField(field: Field, value: unknown): unknown {
  switch (field.type) {
    case 'number': {
      const n = Number(value);
      return Number.isFinite(n) ? Math.round(n) : 0;
    }
    case 'toggle':
      return value === true || value === 'true' || value === 'on';
    case 'select':
    case 'color': {
      const v = str(value, 100);
      const allowed = field.type === 'color' ? accentOptions : field.options ?? [];
      if (v && allowed.length && !allowed.some((option) => option.value === v)) {
        throw new ValidationError(`${field.label}: choose one of the listed options.`);
      }
      return v || allowed[0]?.value || '';
    }
    case 'slug': {
      const v = str(value, 120).toLowerCase();
      if (!SLUG.test(v)) {
        throw new ValidationError(
          `${field.label}: use lowercase letters, numbers and single hyphens (e.g. tax-advisory).`,
        );
      }
      return v;
    }
    case 'date': {
      const v = str(value, 10);
      if (!DATE.test(v)) throw new ValidationError(`${field.label}: pick a valid date.`);
      return v;
    }
    case 'image': {
      const v = str(value, 1000);
      return v || null;
    }
    case 'url': {
      const v = str(value, 1000);
      if (v && !/^(https?:\/\/|mailto:|tel:|\/)/i.test(v)) {
        throw new ValidationError(`${field.label}: enter a full link starting with https://`);
      }
      return v;
    }
    case 'list': {
      const list = Array.isArray(value) ? value : [];
      return list.map((item) => str(item, 300)).filter(Boolean).slice(0, 100);
    }
    case 'group': {
      if (field.optional && (value === null || value === undefined)) return null;
      return sanitizeFields(field.fields ?? [], (value ?? {}) as Record<string, unknown>);
    }
    case 'repeater': {
      const list = Array.isArray(value) ? value : [];
      return list
        .slice(0, 100)
        .map((item) => sanitizeFields(field.fields ?? [], (item ?? {}) as Record<string, unknown>));
    }
    default:
      return str(value, field.max ?? (field.type === 'markdown' ? 100000 : 5000));
  }
}

export function sanitizeFields(fields: Field[], input: Record<string, unknown>) {
  const output: Record<string, unknown> = {};
  for (const field of fields) {
    const value = sanitizeField(field, input[field.name]);
    if (field.required && (value === '' || value === null)) {
      throw new ValidationError(`${field.label} is required.`);
    }
    output[field.name] = value;
  }
  return output;
}

export function sanitizeSections(sections: FormSection[], input: Record<string, unknown>) {
  return sanitizeFields(
    sections.flatMap((section) => section.fields),
    input,
  );
}

/** Empty value for a field — used when adding repeater items. */
export function emptyValue(field: Field): unknown {
  switch (field.type) {
    case 'number':
      return 0;
    case 'toggle':
      return false;
    case 'list':
    case 'repeater':
      return [];
    case 'group':
      return field.optional ? null : emptyObject(field.fields ?? []);
    case 'image':
      return null;
    case 'color':
      return 'teal';
    case 'select':
      return field.options?.[0]?.value ?? '';
    default:
      return '';
  }
}

export function emptyObject(fields: Field[]): Record<string, unknown> {
  return Object.fromEntries(fields.map((field) => [field.name, emptyValue(field)]));
}
