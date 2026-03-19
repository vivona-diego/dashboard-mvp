'use client';

import { Box, Typography } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { DateTime } from 'luxon';
import DetailFilters from '@/app/components/quote/forecast/DetailFilters';
import DetailGrid, { DetailGridData } from '@/app/components/quote/forecast/DetailGrid';
import api from '@/app/lib/axiosClient';

export default function QuoteProfitForecastDetailPage() {
    // State for filters
    const [dateRange, setDateRange] = useState<{ start: DateTime | null; end: DateTime | null }>({
        start: DateTime.fromObject({ year: 2024, month: 1, day: 1 }),
        end: DateTime.fromObject({ year: 2024, month: 6, day: 30 })
    });

    const [filters, setFilters] = useState({
        company: 'All',
        yard: 'All',
        department: 'All',
        salesperson: 'All',
        status: 'All'
    });

    const handleFilterChange = (key: string, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [rawRows, setRawRows] = useState<any[]>([]);

    useEffect(() => {
        const fetchDetailRows = async () => {
            try {
                setLoading(true);
                setError(null);

                const requestBody = {
                    datasetName: 'quote_profit_forecast',
                    groupBySegments: [
                        'QuoteNumber',
                        'BillingDescription',
                        'Measure',
                        'CreatedBy',
                        'CreatedDate',
                        'Item',
                    ],
                    metrics: [
                        { metricName: 'Revenue' },
                        { metricName: 'Quantity' },
                        { metricName: 'TotalExpense' },
                        { metricName: 'DirectExpense' },
                        { metricName: 'IndirectExpense' },
                    ],
                    limit: 500,
                };

                const res = await api.post('/bi/query', requestBody);
                if (!res.data?.success || !res.data?.data?.data) {
                    throw new Error('Invalid response from BI query');
                }

                setRawRows(res.data.data.data);
            } catch (err: any) {
                console.error('Error fetching quote detail rows:', err);
                setError(
                    err.response?.data?.message ||
                        err.message ||
                        'Failed to load quote detail data'
                );
                setRawRows([]);
            } finally {
                setLoading(false);
            }
        };

        fetchDetailRows();
    }, []);

    const gridData: DetailGridData[] = useMemo(() => {
        const start = dateRange.start;
        const end = dateRange.end;
        const inRange = (iso?: string | null) => {
            if (!start && !end) return true;
            if (!iso) return true;
            const dt = DateTime.fromISO(iso);
            if (!dt.isValid) return true;
            if (start && dt < start.startOf('day')) return false;
            if (end && dt > end.endOf('day')) return false;
            return true;
        };

        const matchSalesperson =
            filters.salesperson && filters.salesperson !== 'All'
                ? filters.salesperson
                : null;
        const matchStatus =
            filters.status && filters.status !== 'All' ? filters.status : null;

        const rows = rawRows
            .filter((r) => inRange(r.CreatedDate))
            .filter((r) =>
                matchSalesperson ? r.CreatedBy === matchSalesperson : true
            )
            .map((r, idx) => {
                const estimated = Number(r.Revenue ?? 0);
                const direct = Number(r.DirectExpense ?? 0);
                const indirect = Number(r.IndirectExpense ?? 0);
                const expense = Number(r.TotalExpense ?? direct + indirect);
                const netProfit = estimated - expense;
                const qty = Number(r.Quantity ?? 0);
                const rate = qty > 0 ? estimated / qty : 0;
                const totalHrlyCost = qty > 0 ? expense / qty : 0;
                const margin = estimated !== 0 ? (netProfit / estimated) * 100 : 0;

                const status =
                    r.Item === true
                        ? 'Did Job'
                        : r.Item === false
                          ? 'Budgetary'
                          : '';

                return {
                    id: String(idx),
                    quoteNo: r.QuoteNumber ?? '',
                    status,
                    salesperson: r.CreatedBy ?? '',
                    customer: '-', // no existe en el dataset
                    date: r.CreatedDate
                        ? DateTime.fromISO(r.CreatedDate).toFormat('MM/dd/yyyy')
                        : '',
                    line: idx + 1,
                    billingDesc: r.BillingDescription ?? '',
                    measure: r.Measure ?? '',
                    qty,
                    rate,
                    estimated,
                    totalHrlyCost,
                    expense,
                    netProfit,
                    margin,
                };
            })
            .filter((r) => (matchStatus ? r.status === matchStatus : true));

        return rows;
    }, [rawRows, dateRange.start, dateRange.end, filters.salesperson, filters.status]);

    return (
        <Box sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column', gap: 4 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
                Quote Profit Forecast - Detail
            </Typography>

            {error && (
                <Typography color="error" variant="body2">
                    {error}
                </Typography>
            )}

            {/* Filters */}
            <DetailFilters 
                dateRange={dateRange}
                onDateRangeChange={setDateRange}
                filters={filters}
                onFilterChange={handleFilterChange}
            />

            {/* Grid */}
            <Box sx={{ flexGrow: 1 }}>
                <DetailGrid data={gridData} />
                {loading && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Cargando...
                    </Typography>
                )}
            </Box>
        </Box>
    );
}
