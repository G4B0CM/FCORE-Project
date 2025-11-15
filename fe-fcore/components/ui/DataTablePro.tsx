'use client';

import React, { ReactNode, useMemo, useState } from 'react';
import { DataTable, DataTableFilterMeta, DataTableFilterEvent, DataTablePageEvent, DataTableSortEvent, DataTableSelectionMultipleChangeEvent, DataTableSelectionSingleChangeEvent } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from 'primereact/inputtext';

export type Align = 'left' | 'center' | 'right';

export type ColumnDef<T> = {
    field?: string;
    header: string;
    body?: (row: T) => ReactNode;
    filter?: boolean;
    filterElement?: (options: any) => ReactNode;
    filterPlaceholder?: string;
    filterMatchMode?: string;
    showFilterMenu?: boolean;
    sortable?: boolean;
    style?: React.CSSProperties;
    dataType?: 'text' | 'numeric' | 'date' | 'boolean';
    align?: Align;
    frozen?: boolean;
    expander?: boolean;
};

export type DataTableProProps<T> = {
    value: T[];
    columns: ColumnDef<T>[];
    loading?: boolean;
    dataKey?: string;
    paginator?: boolean;
    rows?: number;
    totalRecords?: number;
    lazy?: boolean;
    onPage?: (e: DataTablePageEvent) => void;
    onSort?: (e: DataTableSortEvent) => void;
    onFilter?: (e: DataTableFilterEvent) => void;
    filters?: DataTableFilterMeta;
    globalFilterFields?: string[];
    globalPlaceholder?: string;
    headerLeft?: React.ReactNode;
    headerRight?: React.ReactNode;
    selectionMode?: 'single' | 'multiple';
    selection?: any;
    onSelectionChange?: (e: DataTableSelectionMultipleChangeEvent<T> | DataTableSelectionSingleChangeEvent<T>) => void;
    responsiveLayout?: 'scroll' | 'stack';
    emptyMessage?: string;
    className?: string;
    stateKey?: string;
    stateStorage?: 'session' | 'local';
    rowsPerPageOptions?: number[];   // <--- NUEVO
};

export default function DataTablePro<T>(props: DataTableProProps<T>) {
    const {
        value,
        columns,
        loading,
        dataKey,
        paginator = true,
        rows = 10,
        totalRecords,
        lazy,
        onPage,
        onSort,
        onFilter,
        filters,
        globalFilterFields = [],
        globalPlaceholder = 'Buscar...',
        headerLeft,
        headerRight,
        selectionMode,
        selection,
        onSelectionChange,
        responsiveLayout = 'scroll',
        emptyMessage = 'Sin resultados',
        className,
        stateKey,
        stateStorage,
        rowsPerPageOptions      // <--- NUEVO
    } = props;

    const controlledFilters = !!filters;
    const [localFilters, setLocalFilters] = useState<DataTableFilterMeta>({ global: { value: null, matchMode: 'contains' } });
    const [globalValue, setGlobalValue] = useState('');
    const appliedFilters = controlledFilters ? (filters as DataTableFilterMeta) : localFilters;

    const header = useMemo(() => {
        if (headerRight) return (
            <div className="flex justify-content-between align-items-center gap-3">
                <div>{headerLeft}</div>
                <div>{headerRight}</div>
            </div>
        );
        return (
            <div className="flex justify-content-between align-items-center gap-3">
                <div>{headerLeft}</div>
                <div className="w-20rem">
                    <IconField iconPosition="left" className="w-full">
                        <InputIcon className="pi pi-search" />
                        <InputText
                            className="w-full"
                            value={globalValue}
                            onChange={(e) => {
                                const v = e.target.value;
                                setGlobalValue(v);
                                if (controlledFilters) {
                                    onFilter?.({} as DataTableFilterEvent);
                                } else {
                                    const next = { ...appliedFilters };
                                    if (!next['global']) next['global'] = { value: null, matchMode: 'contains' };
                                    (next['global'] as any).value = v;
                                    setLocalFilters(next);
                                }
                            }}
                            placeholder={globalPlaceholder}
                        />
                    </IconField>
                </div>
            </div>
        );
    }, [headerLeft, headerRight, globalValue, globalPlaceholder, controlledFilters, appliedFilters, onFilter]);

    return (
        <DataTable
            value={value}
            dataKey={dataKey}
            loading={loading}
            paginator={paginator}
            rows={rows}
            rowsPerPageOptions={rowsPerPageOptions}   // <--- NUEVO
            totalRecords={totalRecords}
            lazy={lazy}
            onPage={onPage}
            onSort={onSort}
            onFilter={(e) => {
                if (controlledFilters) onFilter?.(e);
                else setLocalFilters(e.filters);
            }}
            filters={appliedFilters}
            filterDisplay="row"
            globalFilterFields={globalFilterFields}
            header={header}
            emptyMessage={emptyMessage}
            className={className}
            selectionMode={selectionMode}
            selection={selection}
            onSelectionChange={onSelectionChange as any}
            responsiveLayout={responsiveLayout}
            stateKey={stateKey}
            stateStorage={stateStorage}
        >
            {columns.map((c, i) => (
                <Column
                    key={c.field ?? `col-${i}`}
                    field={c.field}
                    header={c.header}
                    body={c.body as any}
                    sortable={c.sortable}
                    filter={c.filter}
                    filterElement={c.filterElement as any}
                    filterPlaceholder={c.filterPlaceholder}
                    filterMatchMode={c.filterMatchMode as any}
                    showFilterMenu={c.showFilterMenu}
                    dataType={c.dataType}
                    style={c.style}
                    align={c.align}
                    frozen={c.frozen}
                    expander={c.expander}
                />
            ))}
        </DataTable>
    );
}
