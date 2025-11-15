'use client';

import React, { useEffect, useMemo, useState } from 'react';
import FileUploadField, { FilesValidator } from '@/components/ui/FileUploadField';
import { useFormContext, FieldValidator } from './FormProvider';

export type FormFileUploadFieldProps = Omit<React.ComponentProps<typeof FileUploadField>, 'validate'> & {
    name: string;
    validators?: FilesValidator | FilesValidator[];
};

export default function FormFileUploadField(props: FormFileUploadFieldProps) {
    const { name, validators, ...rest } = props;
    const form = useFormContext();
    const [val, setVal] = useState<File[]>([]);

    const vList = useMemo<FieldValidator[]>(() => {
        if (!validators) return [];
        const arr = Array.isArray(validators) ? validators : [validators];
        return arr.map((fn) => (value) => fn((value as File[]) ?? []));
    }, [validators]);

    useEffect(() => {
        form.register({ name, getValue: () => val, validators: vList });
        return () => form.unregister(name);
    }, [form, name, val, vList]);

    return (
        <FileUploadField
            {...rest}
            validate={Array.isArray(validators) ? validators : validators ? [validators] : []}
            onSelect={(files) => setVal((prev) => [...prev, ...files])}
            onUpload={(files) => setVal(files)}
            onClear={() => setVal([])}
        />
    );
}
