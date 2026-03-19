'use client';

import { Box, Typography, TextField, Stack } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { DateTime } from 'luxon';
import YoYProfitChart from '@/app/components/quote/forecast/YoYProfitChart';
import api from '@/app/lib/axiosClient';

export default function QPFYoYAnalysisPage() {
    const [dateRange, setDateRange] = useState<{ start: DateTime | null; end: DateTime | null }>({
        start: DateTime.fromObject({ year: 2024, month: 1, day: 1 }),
        end: DateTime.fromObject({ year: 2024, month: 6, day: 30 }),
    });

    const formatDate = (date: DateTime | null) => {
        return date ? date.toFormat('yyyy-MM-dd') : '';
    };

    const handleDateChange = (type: 'start' | 'end', value: string) => {
        const newDate = value ? DateTime.fromISO(value) : null;
        setDateRange((prev) => ({ ...prev, [type]: newDate }));
    };

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [rows, setRows] = useState<any[]>([]);

    useEffect(() => {
        const fetch = async () => {
            try {
                setLoading(true);
                setError(null);

                const requestBody = {
                    datasetName: 'quote_profit_forecast',
                    groupBySegments: ['CreatedDate'],
                    metrics: [
                        { metricName: 'Revenue' },
                        { metricName: 'TotalExpense' },
                        { metricName: 'DirectExpense' },
                        { metricName: 'IndirectExpense' },
                    ],
                    limit: 5000,
                };

                const res = await api.post('/bi/query', requestBody);
                if (!res.data?.success || !res.data?.data?.data) {
                    throw new Error('Invalid response from BI query');
                }
                setRows(res.data.data.data);
            } catch (err: any) {
                console.error('Error fetching YoY data:', err);
                setError(err.response?.data?.message || err.message || 'Failed to load YoY data');
                setRows([]);
            } finally {
                setLoading(false);
            }
        };

        fetch();
    }, []);

    const chartData = useMemo(() => {
        const start = dateRange.start;
        const end = dateRange.end;

        const bucket = new Map<string, { rev: number; exp: number; dt: DateTime }>();
        for (const r of rows) {
            const iso = r.CreatedDate;
            if (!iso) continue;
            const dt = DateTime.fromISO(iso);
            if (!dt.isValid) continue;
            if (start && dt < start.startOf('day')) continue;
            if (end && dt > end.endOf('day')) continue;

            const key = dt.toFormat('yyyy-LL');
            const rev = Number(r.Revenue ?? 0);
            const exp = Number(
                r.TotalExpense ??
                    (Number(r.DirectExpense ?? 0) + Number(r.IndirectExpense ?? 0))
            );

            const prev = bucket.get(key);
            if (!prev) bucket.set(key, { rev, exp, dt: dt.startOf('month') });
            else bucket.set(key, { rev: prev.rev + rev, exp: prev.exp + exp, dt: prev.dt });
        }

        const points = Array.from(bucket.values())
            .sort((a, b) => a.dt.toMillis() - b.dt.toMillis())
            .map((b) => {
                const profit = b.rev - b.exp;
                const pct = b.rev !== 0 ? (profit / b.rev) * 100 : 0;
                return { month: b.dt.toFormat('LLL yyyy'), profitPct: Number(pct.toFixed(1)) };
            });

        return points;
    }, [rows, dateRange.start, dateRange.end]);

    return (
        <Box sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column', gap: 4 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
                QPF Year-over-Year Analysis
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

            {/* Date Range Filter */}
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    p: 2,
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                }}
            >
                <Stack direction="column" spacing={1}>
                    <Typography
                        variant="caption"
                        color="primary"
                        fontWeight="bold"
                        sx={{ textTransform: 'uppercase', letterSpacing: 0.5, fontSize: '0.75rem' }}
                    >
                        Quote Created Date
                    </Typography>
                    <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        sx={{
                            bgcolor: 'background.default',
                            p: 0.5,
                            borderRadius: 1.5,
                            border: '1px solid',
                            borderColor: 'divider',
                            width: 'fit-content',
                            minWidth: '280px',
                            justifyContent: 'space-between',
                        }}
                    >
                        <TextField
                            type="date"
                            size="small"
                            value={formatDate(dateRange.start)}
                            onChange={(e) => handleDateChange('start', e.target.value)}
                            sx={{
                                '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                                '& .MuiInputBase-input': { py: 0.5, fontSize: '0.875rem' },
                                width: '100%',
                            }}
                        />
                        <Typography variant="body2" color="text.secondary">
                            -
                        </Typography>
                        <TextField
                            type="date"
                            size="small"
                            value={formatDate(dateRange.end)}
                            onChange={(e) => handleDateChange('end', e.target.value)}
                            sx={{
                                '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                                '& .MuiInputBase-input': { py: 0.5, fontSize: '0.875rem' },
                                width: '100%',
                            }}
                        />
                    </Stack>
                </Stack>
            </Box>

            {/* Chart */}
            <Box sx={{ bgcolor: 'background.paper', p: 3, borderRadius: 2, boxShadow: 1 }}>
                <YoYProfitChart data={chartData} />
            </Box>
        </Box>
    );
}
