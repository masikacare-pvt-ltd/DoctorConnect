import { describe, it, expect } from 'vitest';
import { generateId, generateCaseNumber, readingTime } from '../id';
import { validateImageFile } from '../image';

describe('id utils', () => {
  it('generateId returns a non-empty string', () => {
    expect(typeof generateId()).toBe('string');
    expect(generateId().length).toBeGreaterThan(0);
  });

  it('generateCaseNumber returns MC- prefix and 5 digits', () => {
    const n = generateCaseNumber();
    expect(n).toMatch(/^MC-\d{5}$/);
  });

  it('generateCaseNumber is unique across calls', () => {
    expect(generateCaseNumber()).not.toBe(generateCaseNumber());
  });
});

describe('time utils', () => {
  it('readingTime estimates minutes from word count', () => {
    const text = Array(250).fill('word').join(' ');
    expect(readingTime(text)).toBeGreaterThanOrEqual(1);
  });

  it('readingTime floors to at least 1 minute', () => {
    expect(readingTime('short text')).toBe(1);
  });
});

describe('image validation', () => {
  const makeFile = (type: string, size: number) =>
    ({ type, size, name: 'x' } as unknown as File);

  it('accepts a small png', () => {
    expect(validateImageFile(makeFile('image/png', 1000))).toBeNull();
  });

  it('rejects non-image files', () => {
    expect(validateImageFile(makeFile('application/pdf', 1000))).toMatch(/image/i);
  });

  it('rejects oversized images', () => {
    expect(validateImageFile(makeFile('image/jpeg', 20 * 1024 * 1024))).toMatch(/exceeds|MB/i);
  });
});
