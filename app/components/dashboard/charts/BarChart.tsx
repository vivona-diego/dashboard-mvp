'use client'

import ReactECharts from 'echarts-for-react';
import { useTheme } from '@mui/material';

interface BarChartProps {
    labels: string[];
    data: any[];
    options?: any;
    onBarClick?: (personName: string) => void;
    orientation?: 'vertical' | 'horizontal';
}

const BarChart = ({ labels, data, options, onBarClick, orientation = 'vertical' }: BarChartProps) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    const isHorizontal = orientation === 'horizontal';

    // Merge custom options with defaults
    const finalOptions = {
        color: ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'],
        grid: {
            top: 20,
            right: 20,
            bottom: 40,
            left: isHorizontal ? '3%' : 20,
            containLabel: true,
        },
        tooltip: {
            trigger: 'axis',
        },
        xAxis: isHorizontal ? {
            type: 'value',
            splitLine: {
                lineStyle: {
                    color: theme.palette.divider,
                    type: 'dashed',
                },
            },
            axisLabel: {
                color: theme.palette.text.secondary,
            },
        } : {
            type: 'category',
            data: labels,
            axisLabel: {
                color: theme.palette.text.secondary,
            },
            axisLine: {
                lineStyle: {
                    color: theme.palette.divider,
                },
            },
        },
        yAxis: isHorizontal ? {
            type: 'category',
            data: labels,
            inverse: true,
            axisLabel: {
                color: theme.palette.text.secondary,
            },
            axisLine: {
                lineStyle: {
                    color: theme.palette.divider,
                },
            },
        } : {
            type: 'value',
            splitLine: {
                lineStyle: {
                    color: theme.palette.divider,
                    type: 'dashed',
                },
            },
            axisLabel: {
                color: theme.palette.text.secondary,
            },
        },
        series: data,
        ...options,
    };

    const handleEvents = {
        click: (params: any) => {
            if (onBarClick && params.name) {
                onBarClick(params.name);
            }
        },
    };

    return (
        <ReactECharts
            option={finalOptions}
            style={{ height: '350px', width: '100%' }}
            theme={isDark ? 'dark' : undefined}
            onEvents={onBarClick ? handleEvents : undefined}
        />
    );
};

export default BarChart;
