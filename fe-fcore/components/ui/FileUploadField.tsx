'use client';

import React, { useMemo, useRef, useState } from 'react';
import {
    FileUpload,
    FileUploadHeaderTemplateOptions,
    FileUploadSelectEvent,
    FileUploadUploadEvent,
    ItemTemplateOptions
} from 'primereact/fileupload';
import { ProgressBar } from 'primereact/progressbar';

export type FilesValidator = (files: File[]) => string | null;

// Si en tu proyecto tienes ButtonProps, usa ese tipo real.
// Aquí hacemos un normalizador flexible.
type BtnOpts = Record<string, any> | string | undefined | null;

export type FileUploadFieldProps = {
    name?: string;
    url?: string;
    multiple?: boolean;
    accept?: string;
    maxFileSize?: number;
    auto?: boolean;
    customHeader?: (opts: FileUploadHeaderTemplateOptions, totalSize: number, formatted: string) => React.ReactNode;
    itemTemplate?: (file: File, opts: ItemTemplateOptions) => React.ReactNode;
    emptyTemplate?: React.ReactNode;
    chooseOptions?: BtnOpts;
    uploadOptions?: BtnOpts;
    cancelOptions?: BtnOpts;
    className?: string;
    disabled?: boolean;
    onSelect?: (files: File[]) => void;
    onUpload?: (files: File[]) => void;
    onClear?: () => void;
    validate?: FilesValidator | FilesValidator[];
    showError?: boolean;
};

function normalizeBtnOpts(opt: BtnOpts) {
    if (!opt) return {};                 // <- nunca undefined
    if (typeof opt === 'string') return { label: opt };
    if (typeof opt === 'object') return opt;
    return {};
}

export default function FileUploadField(props: FileUploadFieldProps) {
    const {
        name, url, multiple, accept, maxFileSize, auto,
        customHeader, itemTemplate, emptyTemplate,
        chooseOptions, uploadOptions, cancelOptions,
        className, disabled, onSelect, onUpload, onClear,
        validate, showError = true
    } = props;

    const ref = useRef<any>(null);
    const [totalSize, setTotalSize] = useState(0);
    const [files, setFiles] = useState<File[]>([]);
    const [error, setError] = useState<string | null>(null);

    const validators = useMemo(() => {
        if (!validate) return [] as FilesValidator[];
        return Array.isArray(validate) ? validate : [validate];
    }, [validate]);

    const runValidation = (list: File[]) => {
        for (const v of validators) {
            const res = v(list);
            if (res) return res;
        }
        return null;
    };

    const headerTemplate = (opts: FileUploadHeaderTemplateOptions) => {
        const denom = maxFileSize ? maxFileSize : 1;
        const value = denom > 0 ? totalSize / denom : 0;
        const formatted = ref.current ? ref.current.formatSize(totalSize) : '0 B';

        if (customHeader) return customHeader(opts, totalSize, formatted);

        // OJO: esta 'className' es la que pasa Prime en opts
        const { className: headerCls, chooseButton, uploadButton, cancelButton } = opts;

        return (
            <div className={headerCls} style={{ backgroundColor: 'transparent', display: 'flex', alignItems: 'center' }}>
                {chooseButton}
                {uploadButton}
                {cancelButton}
                <div className="flex align-items-center gap-3 ml-auto">
                    <span>
                        {formatted}
                        {maxFileSize ? ` / ${ref.current?.formatSize(maxFileSize)}` : ''}
                    </span>
                    <ProgressBar
                        value={Math.min(100, value * 100)}
                        showValue={false}
                        style={{ width: '10rem', height: '12px' }}
                    />
                </div>
            </div>
        );
    };

    const onTemplateSelect = (e: FileUploadSelectEvent) => {
        const list = Array.from(e.files ?? []);
        const nextFiles = [...files, ...list];
        const size = nextFiles.reduce((acc, f) => acc + (f.size || 0), 0);
        setFiles(nextFiles);
        setTotalSize(size);
        setError(runValidation(nextFiles));
        onSelect?.(list);
    };

    const onTemplateUpload = (e: FileUploadUploadEvent) => {
        const uploaded = Array.from(e.files ?? []);
        setFiles(uploaded);
        setTotalSize(uploaded.reduce((acc, f) => acc + (f.size || 0), 0));
        setError(runValidation(uploaded));
        onUpload?.(uploaded);
    };

    const onTemplateClear = () => {
        setFiles([]);
        setTotalSize(0);
        setError(runValidation([]));
        onClear?.();
    };

    const itemTpl = (inFile: object, opts: ItemTemplateOptions) => {
        const file = inFile as File;
        if (itemTemplate) return itemTemplate(file, opts);
        return (
            <div className="flex align-items-center flex-wrap w-full">
                <div className="flex align-items-center" style={{ width: '50%' }}>
                    <span className="flex flex-column text-left ml-3">
                        {file.name}
                        <small>{new Date().toLocaleString()}</small>
                    </span>
                </div>
                <span className="ml-auto mr-2">{opts.formatSize}</span>
                <button
                    type="button"
                    className="p-button p-button-text p-button-danger p-button-rounded"
                    onClick={(e) => opts.onRemove(e)}
                >
                    <i className="pi pi-times" />
                </button>
            </div>
        );
    };

    // <- Normalizamos aquí para no pasar nunca undefined
    const chooseOpts = useMemo(() => normalizeBtnOpts(chooseOptions), [chooseOptions]);
    const uploadOpts = useMemo(() => normalizeBtnOpts(uploadOptions), [uploadOptions]);
    const cancelOpts = useMemo(() => normalizeBtnOpts(cancelOptions), [cancelOptions]);

    return (
        <div className={className}>
            <FileUpload
                ref={ref}
                name={name ?? 'files[]'}
                url={url}
                multiple={multiple}
                accept={accept}
                maxFileSize={maxFileSize}
                auto={auto}
                onSelect={onTemplateSelect}
                onUpload={onTemplateUpload}
                onError={onTemplateClear}
                onClear={onTemplateClear}
                headerTemplate={headerTemplate}
                itemTemplate={itemTpl}
                emptyTemplate={emptyTemplate}
                chooseOptions={chooseOpts}     // <- nunca undefined
                uploadOptions={uploadOpts}     // <- nunca undefined
                cancelOptions={cancelOpts}     // <- nunca undefined
                disabled={disabled}
            />
            {showError && error && <small className="p-error block mt-2">{error}</small>}
        </div>
    );
}
