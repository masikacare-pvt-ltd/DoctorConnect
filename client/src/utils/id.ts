export function generateId(prefix = ''): string {
  const rand = Math.random().toString(36).slice(2, 10);
  const time = Date.now().toString(36);
  return `${prefix}${time}${rand}`;
}

export function generateCaseNumber(): string {
  const n = Math.floor(10000 + Math.random() * 90000);
  return `MC-${n}`;
}

export function readingTime(text: string): number {
  const words = (text || '').trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}
