'use client'

import ReactECharts from 'echarts-for-react';
import { useTheme, Box } from '@mui/material';

interface DonutChartProps {
    data: any[];
    options?: any;
    centered_element?: React.ReactNode;
}

const DonutChart = ({ data, options, centered_element }: DonutChartProps) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    const finalOptions = {
        color: ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'],
        tooltip: {
            trigger: 'item',
        },
        legend: {
            bottom: 0,
            textStyle: {
                color: theme.palette.text.secondary,
            },
        },
        series: data.map(series => ({
            type: 'pie',
            avoidLabelOverlap: false,
            itemStyle: {
                borderRadius: 10,
                borderColor: theme.palette.background.paper,
                borderWidth: 2,
            },
            label: {
                show: false,
                position: 'center',
            },
            emphasis: {
                label: {
                    show: false, 
                },
            },
            labelLine: {
                show: false,
            },
            ...series,
        })),
        ...options,
    };

    return (
        <Box sx={{ position: 'relative', height: '300px', width: '100%' }}>
            <ReactECharts
                option={finalOptions}
                style={{ height: '100%', width: '100%' }}
                theme={isDark ? 'dark' : undefined}
            />
            {centered_element && (
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -60%)',
                        textAlign: 'center',
                        pointerEvents: 'none',
                    }}
                >
                    {centered_element}
                </Box>
            )}
        </Box>
    );
};

export default DonutChart;
