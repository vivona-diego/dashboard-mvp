'use client';

import { Box, Typography, TextField, Stack } from '@mui/material';
import { DateTime } from 'luxon';
import SegmentSelector from '@/app/components/dashboard/SegmentSelector';

interface ForecastFiltersProps {
    dateRange: { start: DateTime | null; end: DateTime | null };
    onDateRangeChange: (range: { start: DateTime | null; end: DateTime | null }) => void;
    filters: {
        status: string;
        salesperson: string;
        quoteNo: string;
    };
    onFilterChange: (key: string, value: string) => void;
}

export default function ForecastFilters({
    dateRange,
    onDateRangeChange,
    filters,
    onFilterChange
}: ForecastFiltersProps) {
    
    // Format Luxon date to string yyyy-MM-dd for input type="date"
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
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, p: 2, bgcolor: 'background.paper', borderRadius: 2 }}>
            
            {/* Date Range Section */}
            <Stack direction="row" spacing={2} alignItems="center">
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
                  width: '100%',
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
                    width: '100%'
                  }}
                />
              </Stack>
            </Stack>

            {/* Filters Section */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                
                {/* Status Filter */}
                <SegmentSelector 
                    label="Quote Status"
                    segments={['All', 'Draft', 'Sent', 'Accepted']}
                    selectedSegment={filters.status}
                    onSelect={(val) => onFilterChange('status', val || 'All')}
                    orientation="vertical"
                />

                 {/* Salesperson Filter */}
                 <SegmentSelector 
                    label="Salesperson"
                    segments={['All', 'Matt McVittie', 'Chad McComas', 'Trever Weber']}
                    selectedSegment={filters.salesperson}
                    onSelect={(val) => onFilterChange('salesperson', val || 'All')}
                    orientation="vertical"
                />

                {/* Quote No Filter */}
                <SegmentSelector 
                    label="Quote No"
                    segments={['All', 'Q-1001', 'Q-1002']}
                    selectedSegment={filters.quoteNo}
                    onSelect={(val) => onFilterChange('quoteNo', val || 'All')}
                    orientation="vertical"
                />
            </Box>
        </Box>
    );
}
