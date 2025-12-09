'use client'

import api from '@/app/api/axiosClient';
import BarChart from './BarChart';
import formatter from '@/app/helpers/formatter';
import {
    Box,
    Typography
} from '@mui/material';
import { DateTime } from 'luxon';
import { useEffect, useMemo, useState } from 'react';

interface BarTileProps {
    title: string;
    datasetName: string;
    groupBySegments: string[];
    metrics: string[];
    filters: Record<string, string[]>;
    date_range: string;
}

const BarTile = (props: BarTileProps) => {
    const {
        title,
        datasetName,
        groupBySegments,
        metrics,
        filters,
        date_range
    } = props;

    const [results, set_results] = useState<any>(null);
    const [loading, set_loading] = useState(false);

    useEffect(() => {
        const refresh_data = async () => {
            set_loading(true);
            try {
                // Construct filters from props and date_range
                const apiFilters: any[] = [];
                
                // Segment filters
                Object.keys(filters).forEach(segment => {
                    if (filters[segment] && filters[segment].length > 0) {
                        apiFilters.push({
                            segmentName: segment,
                            operator: 'in',
                            value: filters[segment]
                        });
                    }
                });

                // Date filters
                const now = DateTime.now();
                if (date_range === 'this_month') {
                    apiFilters.push({ segmentName: 'Year', operator: 'eq', value: now.year });
                    apiFilters.push({ segmentName: 'Month', operator: 'eq', value: now.month });
                } else if (date_range === 'last_month') {
                    const lastMonth = now.minus({ month: 1 });
                    apiFilters.push({ segmentName: 'Year', operator: 'eq', value: lastMonth.year });
                    apiFilters.push({ segmentName: 'Month', operator: 'eq', value: lastMonth.month });
                } else if (date_range === 'this_year') {
                    apiFilters.push({ segmentName: 'Year', operator: 'eq', value: now.year });
                }

                const res = await api.post('/bi/chart', {
                    datasetName,
                    groupBySegments,
                    metrics: metrics.map(m => ({ metricName: m })),
                    filters: apiFilters.length > 0 ? apiFilters : undefined,
                    orderBy: [{ field: metrics[0], direction: 'DESC' }],
                    chartConfig: {
                        chartType: 'bar',
                        xAxis: groupBySegments[0],
                        yAxis: metrics,
                        showLegend: true
                    }
                });

                if (res.status >= 400 || !res.data.success) {
                    console.error('BI API failed:', res.status, res.statusText);
                    set_results(null);
                } else {
                    set_results(res.data.data);
                }
            } catch (error) {
                console.error('Error fetching BI data:', error);
                set_results(null);
            } finally {
                set_loading(false);
            }
        };

        refresh_data();
    }, [datasetName, groupBySegments, metrics, filters, date_range]);

    const content = useMemo(() => {
        if (!results || !results.chartData) return null;
        
        const { labels, datasets } = results.chartData;
        
        const series = datasets.map((ds: any) => ({
            name: ds.label,
            type: 'bar', // Force bar as expected by BarChart
            emphasis: { focus: 'series' },
            data: ds.data
        }));

        let val_formatter = (value: number) => formatter.with_commas(value, 0);
        if (metrics.some(m => m.includes('Cost') || m.includes('Sales'))) {
            val_formatter = (value: number) => formatter.as_currency(value);
        }

        return (
            <Box sx={{ p: 2, height: '100%', bgcolor: 'background.paper', borderRadius: 2, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)', display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h6" fontWeight="bold" color="text.primary" gutterBottom>
                    {title}
                </Typography>
                <Box sx={{ flex: 1, minHeight: 0 }}>
                    <BarChart
                        options={{
                            grid: {
                                left: '3%',
                                right: '4%',
                                bottom: '3%',
                                containLabel: true
                            },
                            tooltip: {
                                trigger: 'axis',
                                valueFormatter: val_formatter,
                                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                borderColor: '#e5e7eb',
                                textStyle: {
                                    color: '#374151'
                                }
                            },
                        }}
                        labels={labels}
                        data={series}
                    />
                </Box>
            </Box>
        )
    }, [results, metrics, title]);

    return content;
};

export default BarTile;
