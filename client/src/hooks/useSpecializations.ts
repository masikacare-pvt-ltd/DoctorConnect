import { useEffect, useState } from 'react';
import { loadSpecializations } from '../services/specialization.service';
import type { Specialization } from '../types/domain';

export function useSpecializations() {
  const [specializations, setSpecializations] = useState<Specialization[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    loadSpecializations()
      .then((s) => active && setSpecializations(s))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, []);

  return { specializations, loading };
}
