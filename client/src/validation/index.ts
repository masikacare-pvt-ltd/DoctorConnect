import { z } from 'zod';

export const caseSchema = z.object({
  title: z.string().trim().min(4, 'Title must be at least 4 characters').max(120),
  description: z.string().trim().min(10, 'Description must be at least 10 characters').max(2000),
  specializationId: z.string().min(1, 'Select a specialization'),
  diseaseTags: z.array(z.string().trim().min(1).max(30)).max(12).default([]),
  urgent: z.boolean().default(false),
  caseQuote: z.string().trim().max(280).optional().default(''),
});

export type CaseInput = z.infer<typeof caseSchema>;

export const commentSchema = z.object({
  text: z.string().trim().min(1, 'Comment cannot be empty').max(1000),
  attachmentName: z.string().max(120).nullable().default(null),
});

export type CommentInput = z.infer<typeof commentSchema>;

export const profileSchema = z.object({
  firstName: z.string().trim().min(1, 'First name is required').max(50),
  lastName: z.string().trim().min(1, 'Last name is required').max(50),
  designation: z.string().trim().max(80).default(''),
  specializationId: z.string().min(1, 'Select a specialization'),
  hospital: z.string().trim().max(120).default(''),
  mobile: z.string().trim().max(30).default(''),
  bio: z.string().trim().max(500).default(''),
  gender: z.string().trim().max(10).default('male'),
});

export type ProfileInput = z.infer<typeof profileSchema>;

export const loginSchema = z.object({
  email: z.string().trim().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const signupSchema = z.object({
  email: z.string().trim().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6),
  firstName: z.string().trim().min(1, 'First name is required').max(50),
  lastName: z.string().trim().min(1, 'Last name is required').max(50),
  mobile: z.string().trim().max(30).default(''),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export type SignupInput = z.infer<typeof signupSchema>;
