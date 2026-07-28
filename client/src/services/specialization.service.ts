import { apiGet, apiPost } from '../lib/api';
import type { Specialization } from '../types/domain';

interface RawSpecialization {
  slug?: string;
  name: string;
  description?: string;
  order?: number;
}

const SEED: Omit<Specialization, 'id'>[] = [
  { name: 'Cardiology', slug: 'cardiology', description: 'Heart and cardiovascular system', order: 1 },
  { name: 'Dermatology', slug: 'dermatology', description: 'Skin, hair, and nails', order: 2 },
  { name: 'Neurology', slug: 'neurology', description: 'Brain and nervous system', order: 3 },
  { name: 'Radiology', slug: 'radiology', description: 'Medical imaging', order: 4 },
  { name: 'Pediatrics', slug: 'pediatrics', description: 'Child and adolescent care', order: 5 },
  { name: 'Pathology', slug: 'pathology', description: 'Disease diagnosis', order: 6 },
  { name: 'General Medicine', slug: 'general-medicine', description: 'Primary and internal medicine', order: 7 },
];

export async function loadSpecializations(): Promise<Specialization[]> {
  try {
    const res = await apiGet<{ status: string; data: RawSpecialization[] }>('/api/specializations');
    if (res.data && res.data.length > 0) {
      return res.data.map((s) => ({
        id: s.slug || s.name.toLowerCase().replace(/\s+/g, '-'),
        name: s.name,
        slug: s.slug || s.name.toLowerCase().replace(/\s+/g, '-'),
        description: s.description || '',
        order: s.order || 0,
      }));
    }
  } catch (e) {
    console.warn('Failed to fetch specializations from server, using local seed', e);
  }
  return SEED.map((s) => ({ id: s.slug, ...s }));
}

export async function seedSpecializations(): Promise<void> {
  try {
    await apiPost('/api/specializations/seed', { specializations: SEED });
  } catch (e) {
    console.warn('Failed to seed specializations', e);
  }
}
