'use client';

import ReactECharts from 'echarts-for-react';
import { Box, Typography, useTheme } from '@mui/material';

interface DownUnitChartProps {
    data: {
        months: string[];
        currentYear: number[];
        lastYear: number[];
    };
}

export default function DownUnitChart({ data }: DownUnitChartProps) {
    const theme = useTheme();

    const option = {
        tooltip: {
            trigger: 'axis',
        },
        legend: {
            data: ['Down Hours', 'Down Hours LY'],
            bottom: 0,
            icon: 'circle',
            itemWidth: 10,
            textStyle: {
                fontSize: 12,
                color: theme.palette.text.secondary,
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '15%',
            top: '10%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: data.months,
            axisLabel: {
                fontSize: 11,
                color: theme.palette.text.secondary,
            },
            axisLine: {
                lineStyle: {
                    color: theme.palette.divider,
                }
            }
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                fontSize: 11,
                color: theme.palette.text.secondary,
            },
            splitLine: {
                lineStyle: {
                    color: theme.palette.divider,
                    type: 'dashed'
                }
            }
        },
        series: [
            {
                name: 'Down Hours',
                type: 'line',
                data: data.currentYear,
                smooth: true,
                symbol: 'circle',
                symbolSize: 8,
                label: {
                    show: true,
                    position: 'top',
                    fontSize: 10,
                    color: theme.palette.text.primary,
                },
                itemStyle: {
                    color: '#00BCD4', // Teal from screenshot
                },
                lineStyle: {
                    width: 3,
                }
            },
            {
                name: 'Down Hours LY',
                type: 'line',
                data: data.lastYear,
                smooth: true,
                symbol: 'circle',
                symbolSize: 8,
                label: {
                    show: true,
                    position: 'top',
                    fontSize: 10,
                    color: theme.palette.text.primary,
                },
                itemStyle: {
                    color: '#424242', // Grey/Black from screenshot
                },
                lineStyle: {
                    width: 3,
                }
            }
        ]
    };

    return (
        <Box sx={{ width: '100%' }}>
            {/* Header Strip */}
            <Box sx={{ 
                bgcolor: '#E0E0E0', 
                py: 0.5, 
                px: 2, 
                mb: 2, 
                borderRadius: '4px 4px 0 0',
                display: 'flex',
                justifyContent: 'center'
            }}>
                <Typography variant="subtitle2" fontWeight="bold" sx={{ color: '#616161', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                    Units Down Hours CY vs LY
                </Typography>
            </Box>
            <ReactECharts option={option} style={{ height: 300 }} />
        </Box>
    );
}
