// src/app/(protected)/analysts/AnalystsClient.tsx
'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Toast } from 'primereact/toast';
import AppButton from '@/components/ui/AppButton';
import DataTablePro from '@/components/ui/DataTablePro';
import TagCell from '@/components/ui/TagCell';
import BoolIconCell from '@/components/ui/BoolIconCell';
import FormDialog from '@/components/form/FormDialog';
import FormInputField from '@/components/form/FormInputField';
import FormInputPassword from '@/components/form/FormInputPassword';
import FormSelectField from '@/components/form/FormSelectField';
import { required, minLen, equalPasswords, qcode } from '@/components/form/validators';
import { oficialService } from '@/services/oficial.service';
import { rolesService } from '@/services/roles.service';
import type { RolResponseDto } from '@/types/rol';
import AppToolbar from '@/components/ui/AppToolbar';

type Row = {
    id: number;
    qcode: string;
    name: string | null;
    lastname: string | null;
    is_active: boolean;
    rolId: number | null;
    rolName: string | null;
};

export default function AnalystsClient() {
    const toast = useRef<Toast>(null);

    const [rows, setRows] = useState<Row[]>([]);
    const [loading, setLoading] = useState(false);

    const [createOpen, setCreateOpen] = useState(false);
    const [editOpen, setEditOpen] = useState<{ open: boolean; row: Row | null }>({ open: false, row: null });

    const [roles, setRoles] = useState<RolResponseDto[]>([]);
    const rawOfsRef = useRef<any[]>([]);
    const mappedRef = useRef<any[]>([]);

    const [editInitials, setEditInitials] = useState<{ name: string; lastname: string; rolId: number | null } | null>(null);
    const [editKey, setEditKey] = useState<string>('');

    const pick = (o: any, keys: string[]) => {
        for (const k of keys) if (o && o[k] !== undefined && o[k] !== null) return o[k];
        return undefined;
    };

    const normalizeOficial = (o: any) => {
        const idCand = pick(o, ['id', '_id', 'id_oficial', 'oficial_id']);
        const idNum = typeof idCand === 'number' ? idCand : Number(idCand);
        const id = Number.isFinite(idNum) ? idNum : NaN;
        const qcodeCand = pick(o, ['qcode', 'q_code', '_q_code', 'qCode']);
        const qcode = typeof qcodeCand === 'string' ? qcodeCand : String(qcodeCand ?? '');
        const isActiveCand = pick(o, ['is_active', '_is_active', 'active', 'enabled']);
        const is_active = typeof isActiveCand === 'boolean' ? isActiveCand : Boolean(isActiveCand);
        const nameCand = pick(o, ['name', '_name']);
        const lastnameCand = pick(o, ['lastname', '_lastname']);
        const name = typeof nameCand === 'string' ? nameCand : nameCand != null ? String(nameCand) : null;
        const lastname = typeof lastnameCand === 'string' ? lastnameCand : lastnameCand != null ? String(lastnameCand) : null;
        return { id, qcode, is_active, name, lastname };
    };

    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            const [ofs, allRoles] = await Promise.all([oficialService.list(), rolesService.getAll()]);
            rawOfsRef.current = Array.isArray(ofs) ? ofs : [];
            const mappedRaw = rawOfsRef.current.map((raw) => ({ raw, norm: normalizeOficial(raw) }));
            const mapped = mappedRaw.filter((x) => Number.isFinite(x.norm.id) && x.norm.qcode);
            mappedRef.current = mapped;

            const withRoles: Row[] = mapped.map(({ raw, norm }) => {
                const embedded = Array.isArray(raw?._roles) && raw._roles.length > 0 ? raw._roles[0] : null;
                if (embedded) {
                    const rId = embedded?._id ?? embedded?.id ?? null;
                    const rName = embedded?._main_name ?? embedded?.name ?? null;
                    return {
                        id: norm.id,
                        qcode: norm.qcode,
                        name: norm.name ?? null,
                        lastname: norm.lastname ?? null,
                        is_active: norm.is_active,
                        rolId: rId ?? null,
                        rolName: rName ?? null,
                    };
                }
                return {
                    id: norm.id,
                    qcode: norm.qcode,
                    name: norm.name ?? null,
                    lastname: norm.lastname ?? null,
                    is_active: norm.is_active,
                    rolId: null,
                    rolName: null,
                };
            });

            setRoles(allRoles);
            setRows(withRoles);

            if (withRoles.length === 0) {
                toast.current?.show({ severity: 'warn', summary: 'Sin filas visibles', detail: `Registros crudos: ${rawOfsRef.current.length} | Mapeados: ${mapped.length}`, life: 3000 });
            }
        } catch (e: any) {
            toast.current?.show({ severity: 'error', summary: 'Error cargando datos', detail: e?.message ?? 'Error', life: 3000 });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const roleOptions = useMemo(
        () => roles.filter((r) => r.is_active).map((r) => ({ label: r.name, value: r.id })),
        [roles]
    );

    const createOne = useCallback(async (values: Record<string, unknown>) => {
        const payload = {
            q_code: String(values.q_code ?? '').trim(),
            name: String(values.name ?? '').trim(),
            lastname: String(values.lastname ?? '').trim(),
            password: String(values.password ?? ''),
            rolId: Number(values.rolId ?? 0),
        };
        const res = await fetch('/api/oficials/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            throw new Error(data?.detail ?? 'Error al crear');
        }
        return res.json();
    }, []);

    const onCreateValid = useCallback(async (values: Record<string, unknown>) => {
        try {
            if (!values.rolId) throw new Error('Debe seleccionar un rol');
            await createOne(values);
            toast.current?.show({ severity: 'success', summary: 'Creado', detail: 'Oficial creado y rol asignado', life: 2000 });
            setCreateOpen(false);
            await loadData();
        } catch (e: any) {
            toast.current?.show({ severity: 'error', summary: 'No se pudo crear', detail: e?.message ?? 'Error', life: 3000 });
        }
    }, [createOne, loadData]);

    const onUpdateValid = useCallback(async (values: Record<string, unknown>, row: Row) => {
        const name = String(values.name ?? '').trim();
        const lastname = String(values.lastname ?? '').trim();
        const rolId = Number(values.rolId ?? 0);
        try {
            await oficialService.update({ id: row.id, name, lastname });
            const current = await oficialService.getRoles(row.id).catch(() => []);
            const currentId = current?.[0]?.id ?? null;
            if (rolId && currentId !== rolId) {
                if (currentId) await oficialService.removeRole(row.id, currentId);
                await oficialService.assignRole(row.id, rolId);
            }
            toast.current?.show({ severity: 'success', summary: 'Actualizado', detail: `Oficial ${row.qcode}`, life: 2000 });
            setEditOpen({ open: false, row: null });
            setEditInitials(null);
            await loadData();
        } catch (e: any) {
            toast.current?.show({ severity: 'error', summary: 'No se pudo actualizar', detail: e?.message ?? 'Error', life: 3000 });
        }
    }, [loadData]);

    const onDeactivate = useCallback(async (r: Row) => {
        try {
            await oficialService.deactivate(r.qcode);
            toast.current?.show({ severity: 'success', summary: 'Desactivado', detail: r.qcode, life: 1500 });
            await loadData();
        } catch (e: any) {
            toast.current?.show({ severity: 'error', summary: 'No se pudo desactivar', detail: e?.message ?? 'Error', life: 3000 });
        }
    }, [loadData]);

    const hydrateEditInitials = useCallback(async (row: Row) => {
        let name = row.name ?? '';
        let lastname = row.lastname ?? '';

        if (!name || !lastname) {
            try {
                const detail: any = await oficialService.findById(row.id);
                name = pick(detail, ['name', '_name']) ?? name;
                lastname = pick(detail, ['lastname', '_lastname']) ?? lastname;
            } catch { }
        }

        if (!name || !lastname) {
            const raw = rawOfsRef.current.find((r) => {
                const n = normalizeOficial(r);
                return Number.isFinite(n.id) && n.id === row.id;
            });
            if (raw) {
                name = name || (pick(raw, ['name', '_name']) as string) || '';
                lastname = lastname || (pick(raw, ['lastname', '_lastname']) as string) || '';
            }
        }

        setEditInitials({ name, lastname, rolId: row.rolId ?? null });
        setEditKey(`edit-${row.id}-${Date.now()}`);
    }, []);

    const header = (
        <AppToolbar
            end={
                <div className="flex align-items-center gap-2">
                    <AppButton label="Nuevo analista" icon="pi pi-plus" severity="primary" onClick={() => setCreateOpen(true)} />
                </div>
            }
            start={<h2 className="text-600">Administración de analistas</h2>}
            className="mb-3"
        />
    );

    const columns = [
        { field: 'id', header: 'ID', sortable: true, style: { width: '6rem' } },
        {
            field: 'name',
            header: 'Analista',
            sortable: true,
            body: (r: Row) => {
                const full = [r.name, r.lastname].filter(Boolean).join(' ');
                return (
                    <div className="flex align-items-center gap-2">
                        <i className="pi pi-user text-500" />
                        <div className="flex flex-column">
                            <span className="font-medium">{full || '—'}</span>
                            <span className="text-500 text-sm">{r.qcode}</span>
                        </div>
                    </div>
                );
            },
        },
        { field: 'rolName', header: 'Rol', sortable: true, body: (r: Row) => <TagCell value={r.rolName ?? 'Sin rol'} severity={r.rolName ? 'info' : 'warning'} /> },
        { field: 'is_active', header: 'Activo', sortable: true, body: (r: Row) => <BoolIconCell value={r.is_active} /> },
        {
            field: 'actions',
            header: 'Acciones',
            body: (r: Row) => (
                <div className="flex gap-2">
                    <AppButton
                        label="Editar"
                        icon="pi pi-pencil"
                        size="small"
                        onClick={async () => {
                            await hydrateEditInitials(r);
                            setEditOpen({ open: true, row: r });
                        }}
                    />
                    <AppButton label="Desactivar" icon="pi pi-ban" size="small" severity="danger" isOutlined onClick={() => onDeactivate(r)} />
                </div>
            ),
            style: { width: '18rem' },
        },
    ];

    return (
        <div>
            <Toast ref={toast} position="bottom-right" />
            {header}

            <DataTablePro
                value={rows}
                dataKey="id"
                loading={loading}
                globalFilterFields={['name', 'lastname', 'qcode', 'rolName']}
                columns={columns as any}
                paginator
                rows={10}
                rowsPerPageOptions={[10, 20, 50]}
                selectionMode="single"
            />

            <FormDialog
                visible={createOpen}
                onClose={() => setCreateOpen(false)}
                title="Nuevo analista"
                initialValues={{ q_code: '', name: '', lastname: '', password: '', rolId: null }}
                defaults={{ validateOn: 'change', touchOnMount: true, validateOnMount: true }}
                submitLabel="Crear"
                submitIcon="pi pi-check"
                submitSeverity="success"
                size="md"
                onValid={onCreateValid}
                onInvalid={(errors) => {
                    const first = Object.values(errors).find(Boolean) as string | null;
                    if (first) toast.current?.show({ severity: 'warn', summary: 'Revisa el formulario', detail: first, life: 2500 });
                }}
            >
                <div className="grid pt-4 mb-3 text-sm text-600 gap-y-6">
                    <div className="w-full md:col-6 mb-2">
                        <FormInputField name="q_code" className='w-full' label="QCode" placeholder="QCode" validators={[required, qcode]} />
                    </div>
                    <div className="col-12 md:col-6 mb-2">
                        <FormInputPassword name="password" className="w-full"
                            containerClassName="w-full" label="Contraseña" toggleMask feedback showHelp validators={[required, minLen(6)]} />
                    </div>
                    <div className="col-12 md:col-6 mb-2">
                        <FormInputField name="name" label="Nombre" placeholder="Nombre" validators={[required]} />
                    </div>
                    <div className="col-12 md:col-6 w-50vh mb-2">
                        <FormInputField name="lastname" label="Apellido" placeholder="Apellido" validators={[required]} />
                    </div>

                    <div className="col-12 md:col-6 mb-2">
                        <FormSelectField name="rolId" label="Rol" options={roleOptions} placeholder="Seleccione un rol" appendTo='body' validators={[required]} />
                    </div>
                </div>

            </FormDialog>

            {editOpen.open && editOpen.row && (
                <FormDialog
                    key={editKey}
                    visible={editOpen.open}
                    onClose={() => {
                        setEditOpen({ open: false, row: null });
                        setEditInitials(null);
                    }}
                    title={`Editar analista ${editOpen.row.qcode}`}
                    initialValues={{
                        name: editInitials?.name ?? editOpen.row.name ?? '',
                        lastname: editInitials?.lastname ?? editOpen.row.lastname ?? '',
                        rolId: editInitials?.rolId ?? editOpen.row.rolId ?? null,
                    }}
                    defaults={{ validateOn: 'change', touchOnMount: true, validateOnMount: true }}
                    submitLabel="Guardar"
                    submitIcon="pi pi-save"
                    submitSeverity="success"
                    size="sm"
                    onValid={async (values) => {
                        if (!editOpen.row) return;
                        await onUpdateValid(values, editOpen.row);
                    }}
                    onInvalid={(errors) => {
                        const first = Object.values(errors).find(Boolean) as string | null;
                        if (first) toast.current?.show({ severity: 'warn', summary: 'Revisa el formulario', detail: first, life: 2500 });
                    }}
                >
                    <div className="grid pt-4 ">
                        <div className="col-12 md:col-6">
                            <FormInputField name="name" label="Nombre" placeholder="Nombre" validators={[required]} />
                        </div>
                        <div className="col-12 md:col-6">
                            <FormInputField name="lastname" label="Apellido" placeholder="Apellido" validators={[required]} />
                        </div>
                        <div className="col-12 mt-2">
                            <FormSelectField name="rolId" label="Rol" options={roleOptions} placeholder="Seleccione un rol" appendTo="self" validators={[required]} />
                        </div>
                    </div>
                </FormDialog>
            )}
        </div>
    );
}
