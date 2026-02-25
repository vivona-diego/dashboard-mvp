'use client';

import { Box, Typography, TextField, Stack } from '@mui/material';
import { DateTime } from 'luxon';
import SegmentSelector from '@/app/components/dashboard/SegmentSelector';

interface ComparisonFiltersProps {
    dateRange: { start: DateTime | null; end: DateTime | null };
    onDateRangeChange: (range: { start: DateTime | null; end: DateTime | null }) => void;
    filters: {
        salesperson: string;
        customer: string;
        salesperson2: string;
        jobCode: string;
    };
    onFilterChange: (key: string, value: string) => void;
}

export default function ComparisonFilters({
    dateRange,
    onDateRangeChange,
    filters,
    onFilterChange
}: ComparisonFiltersProps) {

    const formatDate = (date: DateTime | null) => {
        return date ? date.toFormat('yyyy-MM-dd') : '';
    };

    const handleDateChange = (type: 'start' | 'end', value: string) => {
        const newDate = value ? DateTime.fromISO(value) : null;
        onDateRangeChange({
            ...dateRange,
            [type]: newDate
        });
    };

    return (
        <Box
            sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr) auto' },
                gap: 2,
                p: 2,
                bgcolor: 'background.paper',
                borderRadius: 2,
                alignItems: 'start',
            }}
        >
            <SegmentSelector
                label="Salesperson"
                segments={['All', 'Trever Weber', 'Matt McVittie', 'Chad McComas']}
                selectedSegment={filters.salesperson}
                onSelect={(val) => onFilterChange('salesperson', val || 'All')}
                orientation="vertical"
            />

            <SegmentSelector
                label="Customer"
                segments={['All', 'J&J Industrial Contracting', 'SAV\'S WELDING', 'LAMAR', 'Mama Services']}
                selectedSegment={filters.customer}
                onSelect={(val) => onFilterChange('customer', val || 'All')}
                orientation="vertical"
            />

            <SegmentSelector
                label="Salesperson"
                segments={['All', 'Trever Weber', 'Matt McVittie', 'Chad McComas']}
                selectedSegment={filters.salesperson2}
                onSelect={(val) => onFilterChange('salesperson2', val || 'All')}
                orientation="vertical"
            />

            <SegmentSelector
                label="Job Code"
                segments={['All', 'C-34421', 'C-34408', 'C-34443', 'C-34533']}
                selectedSegment={filters.jobCode}
                onSelect={(val) => onFilterChange('jobCode', val || 'All')}
                orientation="vertical"
            />

            {/* Date Range */}
            <Box>
                <Stack direction="column" spacing={1}>
                    <Typography
                        variant="caption"
                        color="text.secondary"
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
                            minWidth: '260px',
                            justifyContent: 'space-between'
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
                                width: '100%'
                            }}
                        />
                        <Typography variant="body2" color="text.secondary">-</Typography>
                        <TextField
                            type="date"
                            size="small"
                            value={formatDate(dateRange.end)}
                            onChange={(e) => handleDateChange('end', e.target.value)}
                            sx={{
                                '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                                '& .MuiInputBase-input': { py: 0.5, fontSize: '0.875rem' },
                                width: '100%'
                            }}
                        />
                    </Stack>
                </Stack>
            </Box>
        </Box>
    );
}
