'use client';

import { FilterService } from 'primereact/api';

export function registerNumberRangeFilter() {
    if ((FilterService as any)._custom_rangeNumber_registered) return;
    FilterService.register('custom_rangeNumber', (value: number, filters?: [number | null, number | null]) => {
        const [from, to] = filters ?? [null, null];
        if (from === null && to === null) return true;
        if (from !== null && to === null) return from <= value;
        if (from === null && to !== null) return value <= to;
        return from <= value && value <= to;
    });
    (FilterService as any)._custom_rangeNumber_registered = true;
}
