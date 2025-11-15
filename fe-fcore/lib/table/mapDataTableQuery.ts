// src/lib/table/mapDataTableQuery.ts
export type TableState = {
  page?: number;
  rows?: number;
  sortField?: string | null;
  sortOrder?: 1 | -1 | 0 | null;
  filters?: Record<string, any>;
};

export function mapToQuery(state: TableState) {
  const qs = new URLSearchParams();
  const page = state.page ?? 0;
  const size = state.rows ?? 10;
  qs.set('page', String(page));
  qs.set('size', String(size));
  if (state.sortField && state.sortOrder) {
    qs.set('sort', `${state.sortField},${state.sortOrder === 1 ? 'asc' : 'desc'}`);
  }
  if (state.filters) {
    Object.entries(state.filters).forEach(([k, v]) => {
      if (v == null) return;
      if (typeof v === 'object' && 'value' in v) {
        if (v.value != null && v.value !== '') qs.set(`f_${k}`, String(v.value));
      } else {
        qs.set(`f_${k}`, String(v));
      }
    });
  }
  return qs.toString();
}
