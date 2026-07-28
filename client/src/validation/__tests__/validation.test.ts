import { describe, it, expect } from 'vitest';
import {
  caseSchema,
  commentSchema,
  profileSchema,
  loginSchema,
  signupSchema,
} from '../index';

describe('caseSchema', () => {
  const base = {
    title: 'Interesting cardiac case',
    description: 'A 54-year-old patient presented with chest pain.',
    specializationId: 'cardiology',
    diseaseTags: ['hypertension'],
    urgent: false,
  };

  it('accepts a valid case and applies defaults', () => {
    const parsed = caseSchema.parse(base);
    expect(parsed.urgent).toBe(false);
    expect(parsed.caseQuote).toBe('');
    expect(parsed.diseaseTags).toEqual(['hypertension']);
  });

  it('rejects a short title', () => {
    expect(() => caseSchema.parse({ ...base, title: 'abc' })).toThrow(/4 characters/);
  });

  it('rejects an empty specialization', () => {
    expect(() => caseSchema.parse({ ...base, specializationId: '' })).toThrow(/specialization/);
  });

  it('rejects too many disease tags', () => {
    const tags = Array(13).fill('tag');
    expect(() => caseSchema.parse({ ...base, diseaseTags: tags })).toThrow();
  });
});

describe('commentSchema', () => {
  it('accepts text with optional attachment', () => {
    expect(commentSchema.parse({ text: 'Looks like myocarditis', attachmentName: 'scan.jpg' }).attachmentName).toBe('scan.jpg');
  });

  it('rejects empty comment', () => {
    expect(() => commentSchema.parse({ text: '   ' })).toThrow(/empty/);
  });

  it('defaults attachmentName to null', () => {
    expect(commentSchema.parse({ text: 'ok' }).attachmentName).toBeNull();
  });
});

describe('profileSchema', () => {
  const base = { firstName: 'Ada', lastName: 'Lovelace', specializationId: 'neurology' };

  it('requires first and last name', () => {
    expect(() => profileSchema.parse({ ...base, firstName: '' })).toThrow(/First name/);
    expect(() => profileSchema.parse({ ...base, lastName: '' })).toThrow(/Last name/);
  });

  it('applies empty defaults', () => {
    const p = profileSchema.parse(base);
    expect(p.hospital).toBe('');
    expect(p.bio).toBe('');
  });
});

describe('loginSchema', () => {
  it('validates email + password', () => {
    expect(loginSchema.parse({ email: 'a@b.com', password: 'secret1' }).email).toBe('a@b.com');
    expect(() => loginSchema.parse({ email: 'nope', password: 'secret1' })).toThrow(/valid email/);
    expect(() => loginSchema.parse({ email: 'a@b.com', password: '123' })).toThrow(/6 characters/);
  });
});

describe('signupSchema', () => {
  const base = {
    email: 'a@b.com',
    password: 'secret1',
    confirmPassword: 'secret1',
    firstName: 'Ada',
    lastName: 'Lovelace',
    specializationId: 'neurology',
  };

  it('accepts matching passwords', () => {
    expect(signupSchema.parse(base).firstName).toBe('Ada');
  });

  it('rejects mismatched passwords', () => {
    expect(() => signupSchema.parse({ ...base, confirmPassword: 'other' })).toThrow(/do not match/);
  });
});
