'use client'

import formatter from '@/app/helpers/formatter';
import {
    Box,
    Typography
} from '@mui/material';
import { DateTime } from 'luxon';
import { useEffect, useState } from 'react';
import DonutChart from './DonutChart';
import api from '@/app/api/axiosClient';

interface DonutTileProps {
    title: string;
    datasetName: string;
    groupBySegments: string[];
    metrics: string[];
    filters: Record<string, string[]>;
    date_range: string;
}

const DonutTile = (props: DonutTileProps) => {
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
                        chartType: 'pie',
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

    if (!results || !results.chartData) {
        return null;
    }

    let format_fn = (val: any) => formatter.with_commas(val, 0);
    // Currency formatting check
    if (metrics.some(m => m.includes('Cost') || m.includes('Sales'))) {
        format_fn = formatter.as_currency;
    }
    const val_formatter = (value: number) => format_fn(value);
    
    const { labels, datasets } = results.chartData;
    const primaryDataset = datasets[0];

    // DonutChart expects `data` to be an array of series.
    // Each series has `data` which is an array of {name, value}.
    // We need to zip labels and primaryDataset.data
    
    const donutValues = labels.map((label: string, index: number) => ({
        name: label,
        value: primaryDataset.data[index]
    }));

    const donutSeries = [{
        radius: ['70%', '95%'],
        data: donutValues
    }];

    // Calculate total from API data response if possible, or sum up chart data
    // The API response `data.data` (the row array) is available in `results.data`
    // Let's use results.data which contains the raw rows to calculate total accurately
    // Wait, results.data in the new schema is the array of rows.
    // results is { success: true, data: [...], metadata: {...}, chartData: {...} }
    // So results.data is the array of rows.
    
    const primaryMetric = metrics[0];
    const total = (results.data || []).reduce((a: number, c: any) => a + (c[primaryMetric] || 0), 0);

    return (
        <Box sx={{ p: 2, height: '100%', bgcolor: 'background.paper', borderRadius: 2, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" fontWeight="bold" color="text.primary" gutterBottom>
                {title}
            </Typography>
            <Box sx={{ flex: 1, minHeight: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <DonutChart
                    options={{
                        tooltip: {
                            trigger: 'item',
                            valueFormatter: val_formatter,
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            borderColor: '#e5e7eb',
                            textStyle: {
                                color: '#374151'
                            }
                        },
                        legend: {
                            bottom: 0,
                            left: 'center',
                            icon: 'circle'
                        }
                    }}
                    data={donutSeries}
                    centered_element={
                        <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h5" fontWeight="bold" color="text.primary">
                                {format_fn(total)}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase' }}>
                                Total
                            </Typography>
                        </Box>
                    }
                />
            </Box>
        </Box>
    )
};

export default DonutTile;
