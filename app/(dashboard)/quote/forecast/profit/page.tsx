'use client';

import { Box, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { DateTime } from 'luxon';
import ForecastFilters from '@/app/components/quote/forecast/ForecastFilters';
import ProfitForecastChart from '@/app/components/quote/forecast/ProfitForecastChart';
import MarginForecastChart from '@/app/components/quote/forecast/MarginForecastChart';
import ForecastGrid, { GridData } from '@/app/components/quote/forecast/ForecastGrid';
import api from '@/app/lib/axiosClient';

export default function QuoteProfitForecastPage() {
    // State for filters
    const [dateRange, setDateRange] = useState<{ start: DateTime | null; end: DateTime | null }>({
        start: DateTime.fromObject({ year: 2024, month: 1, day: 1 }),
        end: DateTime.fromObject({ year: 2024, month: 6, day: 30 })
    });

    const [filters, setFilters] = useState({
        status: 'All',
        salesperson: 'All',
        quoteNo: 'All'
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [profitChartData, setProfitChartData] = useState<{ name: string; value: number }[]>([]);
    const [marginChartData, setMarginChartData] = useState<{ name: string; value: number }[]>([]);
    const [gridData, setGridData] = useState<GridData[]>([]);

    const handleFilterChange = (key: string, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    // Carga de datos reales desde quote_profit_forecast
    const startStr = dateRange.start ? dateRange.start.toFormat('yyyy-MM-dd') : null;
    const endStr = dateRange.end ? dateRange.end.toFormat('yyyy-MM-dd') : null;

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                const requestFilters: any[] = [];

                if (startStr && endStr) {
                    requestFilters.push({
                        segmentName: 'CreatedDate',
                        operator: 'between',
                        value: startStr,
                        secondValue: endStr,
                    });
                }

                if (filters.salesperson && filters.salesperson !== 'All') {
                    requestFilters.push({
                        segmentName: 'CreatedBy',
                        operator: 'eq',
                        value: filters.salesperson,
                    });
                }

                if (filters.quoteNo && filters.quoteNo !== 'All') {
                    requestFilters.push({
                        segmentName: 'QuoteNumber',
                        operator: 'eq',
                        value: filters.quoteNo,
                    });
                }

                if (filters.status && filters.status !== 'All') {
                    // Item=true => con "job linkage"/aceptado/did job (según convención del backend)
                    const itemValue =
                        filters.status === 'Accepted' ? true : false;
                    requestFilters.push({
                        segmentName: 'Item',
                        operator: 'eq',
                        value: itemValue,
                    });
                }

                const requestBody = {
                    datasetName: 'quote_profit_forecast',
                    groupBySegments: ['CreatedBy'],
                    metrics: [
                        { metricName: 'Revenue' },
                        { metricName: 'DirectExpense' },
                        { metricName: 'IndirectExpense' },
                        { metricName: 'TotalExpense' },
                        { metricName: 'Quantity' },
                    ],
                    ...(requestFilters.length > 0 ? { filters: requestFilters } : {}),
                    limit: 50,
                };

                const res = await api.post('/bi/query', requestBody);

                if (!res.data?.success || !res.data?.data?.data) {
                    throw new Error('Invalid response from BI query');
                }

                const rows: any[] = res.data.data.data;

                const mapped: GridData[] = rows.map((row, idx) => {
                    const estimated = Number(row.Revenue ?? 0);
                    const directExpense = Number(row.DirectExpense ?? 0);
                    const indirectExp = Number(row.IndirectExpense ?? 0);
                    const totalExpense = Number(
                        row.TotalExpense ?? directExpense + indirectExp
                    );
                    const netProfit = estimated - totalExpense;
                    const qty = Number(row.Quantity ?? 0);
                    const rate = qty > 0 ? estimated / qty : 0;
                    const margin =
                        estimated !== 0 ? (netProfit / estimated) * 100 : 0;

                    return {
                        id: String(idx),
                        salesperson: row.CreatedBy || 'Unknown',
                        qty,
                        rate,
                        measure: 'Each',
                        estimated,
                        directExpense,
                        grossProfit: estimated - directExpense,
                        indirectExp,
                        expense: totalExpense,
                        netProfit,
                        margin,
                        children: [],
                    };
                });

                setGridData(mapped);

                const topForProfit = [...mapped]
                    .sort((a, b) => b.netProfit - a.netProfit)
                    .slice(0, 10);
                const topForMargin = [...mapped]
                    .filter((r) => !isNaN(r.margin))
                    .sort((a, b) => b.margin - a.margin)
                    .slice(0, 10);

                setProfitChartData(
                    topForProfit.map((r) => ({
                        name: r.salesperson,
                        value: r.netProfit,
                    }))
                );

                setMarginChartData(
                    topForMargin.map((r) => ({
                        name: r.salesperson,
                        value: Number(r.margin.toFixed(1)),
                    }))
                );
            } catch (err: any) {
                console.error('Error fetching quote profit forecast data:', err);
                setError(
                    err.response?.data?.message ||
                        err.message ||
                        'Failed to load quote forecast data'
                );
                setGridData([]);
                setProfitChartData([]);
                setMarginChartData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [startStr, endStr, filters.status, filters.salesperson, filters.quoteNo]);

    return (
        <Box sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column', gap: 4 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
                Quote Profit Forecast - Summary
            </Typography>

            {error && (
                <Typography color="error" variant="body2">
                    {error}
                </Typography>
            )}
            {loading && (
                <Typography variant="body2" color="text.secondary">
                    Cargando...
                </Typography>
            )}

            <Box sx={{ display: 'grid', gridTemplateColumns: 'minmax(250px, 1fr) 2fr 2fr', gap: 4 }}>
                {/* Left Column: Filters */}
                <ForecastFilters
                    dateRange={dateRange}
                    onDateRangeChange={setDateRange}
                    filters={filters}
                    onFilterChange={handleFilterChange}
                />

                {/* Middle Column: Profit Chart */}
                <Box sx={{ bgcolor: 'background.paper', p: 2, borderRadius: 2, boxShadow: 1 }}>
                    <ProfitForecastChart data={profitChartData} />
                </Box>

                {/* Right Column: Margin Chart */}
                <Box sx={{ bgcolor: 'background.paper', p: 2, borderRadius: 2, boxShadow: 1 }}>
                    <MarginForecastChart data={marginChartData} />
                </Box>
            </Box>

            {/* Bottom Row: Grid */}
            <Box sx={{ flexGrow: 1, mt: 2 }}>
                <ForecastGrid data={gridData} />
            </Box>
        </Box>
    );
}
