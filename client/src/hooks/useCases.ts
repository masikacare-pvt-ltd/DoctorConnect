import { useEffect, useState, useCallback, useRef } from 'react';
import { fetchCases } from '../services/case.service';
import type { ClinicalCase } from '../types/domain';

export function useCases(specializationId?: string, search?: string) {
  const [cases, setCases] = useState<ClinicalCase[]>([]);
  const [loading, setLoading] = useState(true);
  const mounted = useRef(false);

  const load = useCallback(async () => {
    if (!mounted.current) {
      setLoading(true);
    }
    try {
      const params: Record<string, string> = {};
      if (specializationId) params.specialization = specializationId;
      if (search) params.search = search;
      const result = await fetchCases(Object.keys(params).length ? params : undefined);
      setCases(result.cases);
    } catch {
      setCases([]);
    } finally {
      setLoading(false);
      mounted.current = true;
    }
  }, [specializationId, search]);

  useEffect(() => { load(); }, [load]);

  return { cases, loading, refresh: load };
}
