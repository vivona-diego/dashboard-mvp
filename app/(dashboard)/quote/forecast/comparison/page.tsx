'use client';

import { Box, Typography } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { DateTime } from 'luxon';
import ComparisonFilters from '@/app/components/quote/forecast/ComparisonFilters';
import ComparisonGrid, { ComparisonGridData } from '@/app/components/quote/forecast/ComparisonGrid';
import api from '@/app/lib/axiosClient';

export default function QuoteForecastComparisonPage() {
    const [dateRange, setDateRange] = useState<{ start: DateTime | null; end: DateTime | null }>({
        start: DateTime.fromObject({ year: 2024, month: 1, day: 1 }),
        end: DateTime.fromObject({ year: 2024, month: 6, day: 30 }),
    });

    const [filters, setFilters] = useState({
        salesperson: 'All',
        customer: 'All',
        salesperson2: 'All',
        jobCode: 'All',
    });

    const handleFilterChange = (key: string, value: string) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [rows, setRows] = useState<any[]>([]);

    const startStr = dateRange.start ? dateRange.start.toFormat('yyyy-MM-dd') : null;
    const endStr = dateRange.end ? dateRange.end.toFormat('yyyy-MM-dd') : null;

    useEffect(() => {
        const fetch = async () => {
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
                const effectiveSalesperson =
                    filters.salesperson !== 'All'
                        ? filters.salesperson
                        : filters.salesperson2 !== 'All'
                          ? filters.salesperson2
                          : null;

                if (effectiveSalesperson) {
                    requestFilters.push({
                        segmentName: 'CreatedBy',
                        operator: 'eq',
                        value: effectiveSalesperson,
                    });
                }

                const requestBody = {
                    datasetName: 'quote_profit_forecast',
                    groupBySegments: ['QuoteNumber', 'CreatedBy', 'CreatedDate', 'Item'],
                    metrics: [
                        { metricName: 'Revenue' },
                        { metricName: 'TotalExpense' },
                        { metricName: 'DirectExpense' },
                        { metricName: 'IndirectExpense' },
                    ],
                    ...(requestFilters.length > 0 ? { filters: requestFilters } : {}),
                    limit: 2000,
                };

                const res = await api.post('/bi/query', requestBody);
                if (!res.data?.success || !res.data?.data?.data) {
                    throw new Error('Invalid response from BI query');
                }
                setRows(res.data.data.data);
            } catch (err: any) {
                console.error('Error fetching comparison data:', err);
                setError(err.response?.data?.message || err.message || 'Failed to load comparison data');
                setRows([]);
            } finally {
                setLoading(false);
            }
        };

        fetch();
    }, [startStr, endStr, filters.salesperson, filters.salesperson2]);

    const gridData: ComparisonGridData[] = useMemo(() => {
        const filtered = rows;

        const byQuote = new Map<string, { est?: any; act?: any }>();
        for (const r of filtered) {
            const key = String(r.QuoteNumber ?? '');
            if (!key) continue;
            const entry = byQuote.get(key) ?? {};
            if (r.Item === true) entry.act = r;
            else if (r.Item === false) entry.est = r;
            else entry.est = entry.est ?? r;
            byQuote.set(key, entry);
        }

        const out: ComparisonGridData[] = [];
        let idx = 0;
        for (const [quoteNo, pair] of byQuote.entries()) {
            const estRev = Number(pair.est?.Revenue ?? 0);
            const estExp = Number(pair.est?.TotalExpense ?? (Number(pair.est?.DirectExpense ?? 0) + Number(pair.est?.IndirectExpense ?? 0)));
            const estProfit = estRev - estExp;
            const marginPct = estRev !== 0 ? (estProfit / estRev) * 100 : 0;

            const actRev = pair.act ? Number(pair.act?.Revenue ?? 0) : null;
            const actExp = pair.act
                ? Number(pair.act?.TotalExpense ?? (Number(pair.act?.DirectExpense ?? 0) + Number(pair.act?.IndirectExpense ?? 0)))
                : null;
            const actProfit = actRev !== null && actExp !== null ? actRev - actExp : null;
            const profitPct = actRev !== null && actRev !== 0 && actProfit !== null ? (actProfit / actRev) * 100 : null;

            const varDollar = actProfit !== null ? actProfit - estProfit : -estProfit;
            const varPct = estProfit !== 0 ? (varDollar / estProfit) * 100 : null;

            const createdDateIso = pair.est?.CreatedDate ?? pair.act?.CreatedDate ?? null;
            const createdDate = createdDateIso ? DateTime.fromISO(createdDateIso).toFormat('MM/dd/yyyy') : '';

            out.push({
                id: String(idx++),
                quoteNo,
                customer: pair.est?.CreatedBy ?? pair.act?.CreatedBy ?? '-', // dataset no trae Customer
                date: createdDate,
                estimatedDollar: estRev,
                expenseDollar: estExp,
                netProfit: estProfit,
                marginPct,
                jobCode: null,
                hasLink: Boolean(pair.act),
                startDt: null,
                endDt: null,
                status: pair.act ? 'Finished' : null,
                actRevenue: actRev,
                actExpense: actExp,
                profitDollar: actProfit,
                profitPct,
                varDollar,
                varPct,
            });
        }

        return out.sort((a, b) => (b.estimatedDollar ?? 0) - (a.estimatedDollar ?? 0)).slice(0, 200);
    }, [rows]);

    return (
        <Box sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column', gap: 4 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
                Quote Profit Forecast Vs. Actual Job Profit %
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

            {/* Filters */}
            <ComparisonFilters
                dateRange={dateRange}
                onDateRangeChange={setDateRange}
                filters={filters}
                onFilterChange={handleFilterChange}
            />

            {/* Grid */}
            <Box sx={{ flexGrow: 1, overflowX: 'auto' }}>
                <ComparisonGrid data={gridData} />
            </Box>
        </Box>
    );
}
