import { z } from 'zod';

export const createCaseSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().min(1, 'Description is required').max(5000),
  specialization: z.string().optional(),
  urgent: z.boolean().optional(),
  diseaseTags: z.array(z.string()).optional(),
  category: z.string().optional(),
});

export const addCommentSchema = z.object({
  caseId: z.string().min(1, 'Case ID is required'),
  content: z.string().min(1, 'Comment is required').max(3000),
});

export const completeProfileSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(100),
  lastName: z.string().min(1, 'Last name is required').max(100),
  designation: z.string().max(200).optional(),
  specializationId: z.string().min(1, 'Specialization is required'),
  hospital: z.string().max(200).optional(),
  mobile: z.string().max(20).optional(),
  bio: z.string().max(1000).optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
});

export const avatarUploadSchema = z.object({
  imageData: z.string().min(1, 'Image data is required'),
});

export const toggleBookmarkSchema = z.object({
  caseId: z.string().min(1, 'Case ID is required'),
});
