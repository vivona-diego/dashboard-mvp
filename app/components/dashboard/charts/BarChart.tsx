'use client'

import ReactECharts from 'echarts-for-react';
import { useTheme } from '@mui/material';

interface BarChartProps {
    labels: string[];
    data: any[];
    options?: any;
}

const BarChart = ({ labels, data, options }: BarChartProps) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    // Merge custom options with defaults
    const finalOptions = {
        color: ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'],
        grid: {
            top: 20,
            right: 20,
            bottom: 40,
            left: 20,
            containLabel: true,
        },
        tooltip: {
            trigger: 'axis',
        },
        xAxis: {
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
        yAxis: {
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

    return (
        <ReactECharts
            option={finalOptions}
            style={{ height: '350px', width: '100%' }}
            theme={isDark ? 'dark' : undefined}
        />
    );
};

export default BarChart;
