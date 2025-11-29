'use client';

import { useEffect, useMemo, useState } from 'react';
import SelectField from '@/components/ui/SelectField';
import InputField from '@/components/ui/InputText';
import NumberField from '@/components/ui/NumberField';
import MultiSelectField from '@/components/ui/MultiSelectField';
import SwitchField from '@/components/ui/SwitchField';
import AppButton from '@/components/ui/AppButton';
import InputGroup from '@/components/ui/InputGroup';
import { useFormContext } from '@/components/form/FormProvider';

type VarType = 'number' | 'string' | 'enum' | 'boolean';
type Logical = 'AND' | 'OR';

type Row = {
  id: string;
  variable: string;
  varType: VarType;
  operator: string;
  value?: string;
  valueNum?: number | null;
  valueNum2?: number | null;
  valueList?: string[];
  valueBool?: boolean;
  compareWithVar?: boolean;
  rightVar?: string;
  connector: Logical;
};

const CHANNELS = ['POS', 'ECOM', 'ATM', 'P2P'];

const VARS: { label: string; value: string; type: VarType; enumValues?: string[] }[] = [
  { label: 'Monto', value: 'amount', type: 'number' },
  { label: 'Moneda', value: 'currency', type: 'string' },
  { label: 'País', value: 'country', type: 'string' },
  { label: 'Dirección IP', value: 'ip_address', type: 'string' },
  { label: 'Id dispositivo', value: 'device_id', type: 'string' },
  { label: 'Canal', value: 'channel', type: 'enum', enumValues: CHANNELS },
  { label: 'TRX en 10m', value: 'tx_count_10m', type: 'number' },
  { label: 'TRX en 30m', value: 'tx_count_30m', type: 'number' },
  { label: 'TRX en 24h', value: 'tx_count_24h', type: 'number' },
  { label: 'Promedio en 24h', value: 'avg_amount_24h', type: 'number' },
  { label: 'País Común', value: 'usual_country', type: 'string' },
  { label: 'IP Común', value: 'usual_ip', type: 'string' },
  { label: 'Transacción extrangera', value: 'is_foreign_transaction', type: 'boolean' },
  { label: 'Ratio de monto vs promedio', value: 'amount_ratio_vs_avg', type: 'number' },
  { label: 'Comercio en lista negra', value: 'is_blacklisted_merchant', type: 'boolean' },
  { label: 'Comercio en lista blanca', value: 'is_whitelisted_merchant', type: 'boolean' },
];

const OPS_BY_TYPE: Record<VarType, { label: string; value: string }[]> = {
  number: [
    { label: '>', value: '>' },
    { label: '>=', value: '>=' },
    { label: '<', value: '<' },
    { label: '<=', value: '<=' },
    { label: '==', value: '==' },
    { label: '!=', value: '!=' },
    { label: 'entre', value: 'between' },
  ],
  string: [
    { label: '==', value: '==' },
    { label: '!=', value: '!=' },
    { label: 'in', value: 'in' },
    { label: 'not in', value: 'not in' },
  ],
  enum: [
    { label: '==', value: '==' },
    { label: '!=', value: '!=' },
    { label: 'in', value: 'in' },
    { label: 'not in', value: 'not in' },
  ],
  boolean: [{ label: 'is', value: 'is' }],
};

const CONNECTORS: Logical[] = ['AND', 'OR'];

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function quote(s: string) {
  return `'${s.replace(/'/g, "\\'")}'`;
}

function buildRow(row: Row): string {
  const left = row.variable;
  if (row.varType === 'number') {
    if (row.operator === 'between') {
      const a = Number(row.valueNum ?? 0);
      const b = Number(row.valueNum2 ?? 0);
      return `(${left} >= ${a} and ${left} <= ${b})`;
    }
    const r = Number(row.valueNum ?? 0);
    return `${left} ${row.operator} ${r}`;
  }
  if (row.varType === 'boolean') {
    const val = row.valueBool ? 'True' : 'False';
    return `${left} == ${val}`;
  }
  if (row.operator === 'in' || row.operator === 'not in') {
    const list = (row.valueList ?? []).map(quote).join(', ');
    return `${left} ${row.operator} [${list}]`;
  }
  if (row.compareWithVar && row.rightVar) {
    return `${left} ${row.operator} ${row.rightVar}`;
  }
  const r = quote(String(row.value ?? ''));
  return `${left} ${row.operator} ${r}`;
}

function buildDsl(rows: Row[]): string {
  if (!rows.length) return '';
  const parts: string[] = [];
  rows.forEach((r, idx) => {
    const expr = buildRow(r);
    parts.push(expr);
    if (idx < rows.length - 1) parts.push(String(r.connector).toLowerCase());
  });
  return parts.join(' ');
}

type Props = {
  onChangeDsl?: (dsl: string) => void;
  initialDsl?: string;
};

export default function RuleDslBuilder({ onChangeDsl, initialDsl }: Props) {
  const form = useFormContext();

  const [rows, setRows] = useState<Row[]>([
    {
      id: uid(),
      variable: 'amount',
      varType: 'number',
      operator: '>',
      valueNum: 0,
      valueNum2: null,
      compareWithVar: false,
      rightVar: '',
      connector: 'AND',
    },
  ]);

  // options como string[]
  const varOptions = useMemo<string[]>(() => VARS.map(v => v.value), []);
  const dsl = useMemo(() => buildDsl(rows), [rows]);

  useEffect(() => {
    onChangeDsl?.(dsl);
    form.register({
      name: 'dsl_expression',
      getValue: () => dsl,
      validators: [],
    });
    return () => form.unregister('dsl_expression');
  }, [dsl, onChangeDsl, form]);

  function addRow() {
    setRows(prev => [
      ...prev,
      {
        id: uid(),
        variable: 'country',
        varType: 'string',
        operator: '!=',
        value: '',
        valueList: [],
        compareWithVar: false,
        rightVar: '',
        connector: 'AND',
      },
    ]);
  }

  function removeRow(id: string) {
    setRows(prev => (prev.length <= 1 ? prev : prev.filter(r => r.id !== id)));
  }

  function onVarChange(id: string, variable: string) {
    const meta = VARS.find(v => v.value === variable)!;
    setRows(prev =>
      prev.map(r =>
        r.id === id
          ? {
              ...r,
              variable,
              varType: meta.type,
              operator: OPS_BY_TYPE[meta.type][0].value,
              value: '',
              valueNum: null,
              valueNum2: null,
              valueList: [],
              valueBool: false,
              compareWithVar: false,
              rightVar: '',
            }
          : r
      )
    );
  }

  function onOperatorChange(id: string, operator: string) {
    setRows(prev =>
      prev.map(r =>
        r.id === id
          ? {
              ...r,
              operator,
              value: '',
              valueNum: null,
              valueNum2: null,
              valueList: [],
              valueBool: false,
            }
          : r
      )
    );
  }

  function onConnectorChange(id: string, connector: Logical) {
    setRows(prev => prev.map(r => (r.id === id ? { ...r, connector } : r)));
  }

  return (
    <div className="flex flex-column gap-3">
      <div className="surface-card border-round p-3">
        <div className="grid text-600 mb-2">
          <div className="col-12 md:col-3">Variable</div>
          <div className="col-12 md:col-2">Operador</div>
          <div className="col-12 md:col-5">Valor</div>
          <div className="col-12 md:col-2">Conector</div>
        </div>

        {rows.map((row, idx) => {
          const meta = VARS.find(v => v.value === row.variable)!;
          const opsStrings = OPS_BY_TYPE[row.varType].map(o => o.value);
          const rightVarsStrings = VARS
            .filter(v => v.type === row.varType && v.value !== row.variable)
            .map(v => v.value);

          return (
            <div key={row.id} className="grid align-items-center mb-2">
              <div className="col-12 md:col-3">
                <SelectField<string>
                  value={row.variable}
                  options={varOptions}
                  onValueChange={(v) => onVarChange(row.id, v as string)}
                  placeholder="Variable"
                  className="w-full"
                />
              </div>

              <div className="col-12 md:col-2">
                <SelectField<string>
                  value={row.operator}
                  options={opsStrings}
                  onValueChange={(v) => onOperatorChange(row.id, v as string)}
                  placeholder="Operador"
                  className="w-full"
                />
              </div>

              <div className="col-12 md:col-5">
                {row.varType === 'number' && row.operator === 'between' && (
                  <div className="grid">
                    <div className="col-6">
                      <NumberField
                        value={row.valueNum ?? null}
                        onValueChange={(v) => setRows(p => p.map(r => (r.id === row.id ? { ...r, valueNum: v } : r)))}
                        placeholder="Desde"
                        className="w-full"
                        label=""
                      />
                    </div>
                    <div className="col-6">
                      <NumberField
                        value={row.valueNum2 ?? null}
                        onValueChange={(v) => setRows(p => p.map(r => (r.id === row.id ? { ...r, valueNum2: v } : r)))}
                        placeholder="Hasta"
                        className="w-full"
                        label=""
                      />
                    </div>
                  </div>
                )}

                {row.varType === 'number' && row.operator !== 'between' && (
                  <NumberField
                    value={row.valueNum ?? null}
                    onValueChange={(v) => setRows(p => p.map(r => (r.id === row.id ? { ...r, valueNum: v } : r)))}
                    placeholder="Valor"
                    className="w-full"
                    label=""
                  />
                )}

                {row.varType === 'boolean' && (
                  <div className="flex align-items-center gap-2">
                    <SwitchField
                      checked={!!row.valueBool}
                      onCheckedChange={(checked) => setRows(p => p.map(r => (r.id === row.id ? { ...r, valueBool: checked } : r)))}
                    />
                    <span>{row.valueBool ? 'True' : 'False'}</span>
                  </div>
                )}

                {(row.varType === 'string' || row.varType === 'enum') && (row.operator === 'in' || row.operator === 'not in') && (
                  <MultiSelectField<string>
                    value={row.valueList ?? []}
                    options={(meta.enumValues ?? [])}
                    onValueChange={(vals) => setRows(p => p.map(r => (r.id === row.id ? { ...r, valueList: vals as string[] } : r)))}
                    placeholder="Valores"
                    className="w-full"
                    disabled={!meta.enumValues?.length}
                  />
                )}

                {(row.varType === 'string' || row.varType === 'enum') && !(row.operator === 'in' || row.operator === 'not in') && (
                  <div className="grid">
                    <div className="col-12 md:col-6">
                      <SwitchField
                        checked={!!row.compareWithVar}
                        onCheckedChange={(checked) =>
                          setRows(p => p.map(r => (r.id === row.id ? { ...r, compareWithVar: checked, rightVar: '' } : r)))
                        }
                        label="Comparar con variable"
                      />
                    </div>

                    <div className="col-12 md:col-6">
                      {row.compareWithVar ? (
                        <SelectField<string>
                          value={row.rightVar ?? ''}
                          options={rightVarsStrings}
                          onValueChange={(v) => setRows(p => p.map(r => (r.id === row.id ? { ...r, rightVar: v as string } : r)))}
                          placeholder="Variable"
                          className="w-full"
                        />
                      ) : meta.enumValues?.length ? (
                        <SelectField<string>
                          value={row.value ?? ''}
                          options={(meta.enumValues ?? [])}
                          onValueChange={(v) => setRows(p => p.map(r => (r.id === row.id ? { ...r, value: v as string } : r)))}
                          placeholder="Valor"
                          className="w-full"
                        />
                      ) : (
                        <InputField
                          value={row.value ?? ''}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setRows(p => p.map(r => (r.id === row.id ? { ...r, value: e.target.value } : r)))
                          }
                          placeholder="Valor"
                          className="w-full"
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="col-12 md:col-2">
                <div className="flex gap-2 align-items-center">
                  {idx < rows.length - 1 ? (
                    <SelectField<Logical>
                      value={row.connector}
                      options={CONNECTORS}
                      onValueChange={(v) => onConnectorChange(row.id, v as Logical)}
                      className="w-full"
                    />
                  ) : (
                    <div className="w-full text-600 text-sm text-center">—</div>
                  )}
                  <AppButton
                    icon="pi pi-trash"
                    severity="danger"
                    onClick={() => removeRow(row.id)}
                    disabled={rows.length <= 1}
                  />
                </div>
              </div>
            </div>
          );
        })}

        <div className="mt-2">
          <AppButton label="Agregar condición" icon="pi pi-plus" onClick={addRow} />
        </div>
      </div>

      <InputGroup>
        <span className="text-600">DSL generado</span>
      </InputGroup>
      <pre className="m-0 p-2 border surface-border border-round surface-ground" style={{ whiteSpace: 'pre-wrap' }}>{dsl || '—'}</pre>
    </div>
  );
}
