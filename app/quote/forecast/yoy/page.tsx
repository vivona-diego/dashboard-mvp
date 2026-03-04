'use client';

import { Box, Typography, TextField, Stack } from '@mui/material';
import { useState } from 'react';
import { DateTime } from 'luxon';
import YoYProfitChart from '@/app/components/quote/forecast/YoYProfitChart';

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

    // Mock data matching the screenshot line chart
    const chartData = [
        { month: 'Jan 2024', profitPct: 11.2 },
        { month: 'Feb 2024', profitPct: 27.5 },
        { month: 'Mar 2024', profitPct: 20.8 },
    ];

    return (
        <Box sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column', gap: 4 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
                QPF Year-over-Year Analysis
            </Typography>

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
