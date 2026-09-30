/** Shared by the client search form and the server — keep it free of server imports. */

export type AuditKind = 'tin' | 'bin';

export interface AuditBinRecord {
  bin: string;
  name: string;
  address: string;
  list_label: string;
  source: string;
}

export interface AuditTinRecord {
  tin: string;
  name: string;
  assessment_year: string;
  details: Record<string, unknown>;
  source: string;
}

export type AuditResult =
  | { status: 'found'; kind: 'bin'; record: AuditBinRecord }
  | { status: 'found'; kind: 'tin'; record: AuditTinRecord }
  | { status: 'not_found'; kind: AuditKind; query: string }
  | { status: 'invalid'; kind: AuditKind }
  | { status: 'error'; kind: AuditKind };

/** Digits only, then the display format NBR uses. */
export function formatAuditNumber(kind: AuditKind, value: string) {
  const digits = value.replace(/\D/g, '');
  if (kind === 'bin' && digits.length > 9) return `${digits.slice(0, 9)}-${digits.slice(9, 13)}`;
  return digits.slice(0, kind === 'tin' ? 12 : 13);
}

export function isValidAuditNumber(kind: AuditKind, value: string) {
  const digits = value.replace(/\D/g, '');
  return kind === 'tin' ? digits.length === 12 : digits.length === 13;
}
