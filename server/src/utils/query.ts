export function asString(val: unknown): string | undefined {
  if (typeof val === 'string') return val;
  if (Array.isArray(val)) return String(val[0] ?? '');
  return undefined;
}
