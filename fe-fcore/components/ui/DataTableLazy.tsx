'use client';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useState } from 'react';
import type { DataTablePageEvent, DataTableSortEvent } from 'primereact/datatable';


export type LazyState = {
    page: number;
    rows: number;
    sortField?: string;
    sortOrder?: 1 | -1 | 0 | null;
};


type Props<T> = {
    value: T[];
    total: number;
    loading?: boolean;
    initialRows?: number;
    onQuery: (s: LazyState) => void;
    columns: { field: keyof T | string; header: string; body?: (row: T) => JSX.Element }[];
};


export function DataTableLazy<T>({ value, total, loading, onQuery, columns, initialRows = 20 }: Props<T>) {
    const [state, setState] = useState<LazyState>({ page: 0, rows: initialRows });


    return (
        <DataTable
            value={value}
            paginator
            lazy
            rows={state.rows}
            first={state.page * state.rows}
            totalRecords={total}
            onPage={(e: DataTablePageEvent) => {
                const next = { ...state, page: Math.floor((e.first ?? 0) / (e.rows ?? state.rows)), rows: e.rows ?? state.rows };
                setState(next);
                onQuery(next);
            }}
            onSort={(e: DataTableSortEvent) => {
                const next = { ...state, sortField: String(e.sortField), sortOrder: e.sortOrder as 1 | -1 | 0 | null };
                setState(next);
                onQuery(next);
            }}
            }}
dataKey = { typeof columns[0]?.field === 'string' ? (columns[0].field as string) : 'id' }
tableStyle = {{ minWidth: '50rem' }}
aria - label="Data Table"
    >
{
    columns.map((c) => (
        <Column key={String(c.field)} field={c.field as string} header={c.header} body={c.body as any} sortable />
    ))
}
        </DataTable >
    );
}