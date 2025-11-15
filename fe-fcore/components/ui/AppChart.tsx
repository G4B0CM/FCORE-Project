'use client';

import React from 'react';
import { Chart } from 'primereact/chart';

export type AppChartProps = {
    type:
    | 'line'
    | 'bar'
    | 'radar'
    | 'pie'
    | 'doughnut'
    | 'polarArea'
    | 'bubble'
    | 'scatter'
    | 'mixed';
    data: any;
    options?: any;
    className?: string;
    height?: number | string;
    width?: number | string;
    style?: React.CSSProperties;
};

export default function AppChart(props: AppChartProps) {
    const { type, data, options, className, height, width, style } = props;
    const computedStyle = { height, width, ...style };
    return <Chart type={type as any} data={data} options={options} className={className} style={computedStyle} />;
}
