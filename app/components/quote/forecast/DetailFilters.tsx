'use client';

import { Box, Typography, TextField, Stack } from '@mui/material';
import { DateTime } from 'luxon';
import SegmentSelector from '@/app/components/dashboard/SegmentSelector';

interface DetailFiltersProps {
    dateRange: { start: DateTime | null; end: DateTime | null };
    onDateRangeChange: (range: { start: DateTime | null; end: DateTime | null }) => void;
    filters: {
        company: string;
        yard: string;
        department: string;
        salesperson: string;
        status: string;
    };
    onFilterChange: (key: string, value: string) => void;
}

export default function DetailFilters({
    dateRange,
    onDateRangeChange,
    filters,
    onFilterChange
}: DetailFiltersProps) {
    
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
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr 1fr' }, gap: 3, p: 2, bgcolor: 'background.paper', borderRadius: 2 }}>
            
            {/* Row 1 */}
            <SegmentSelector 
                label="Select a Company"
                segments={['All', 'Company A', 'Company B']}
                selectedSegment={filters.company}
                onSelect={(val) => onFilterChange('company', val || 'All')}
                orientation="vertical"
            />
            
            <SegmentSelector 
                label="Select a Yard"
                segments={['All', 'Yard 1', 'Yard 2']}
                selectedSegment={filters.yard}
                onSelect={(val) => onFilterChange('yard', val || 'All')}
                orientation="vertical"
            />

            <SegmentSelector 
                label="Select a Department"
                segments={['All', 'Dept A', 'Dept B']}
                selectedSegment={filters.department}
                onSelect={(val) => onFilterChange('department', val || 'All')}
                orientation="vertical"
            />

            <SegmentSelector 
                label="Salesperson"
                segments={['All', 'Matt McVittie', 'Chad McComas', 'Trever Weber']}
                selectedSegment={filters.salesperson}
                onSelect={(val) => onFilterChange('salesperson', val || 'All')}
                orientation="vertical"
            />

            {/* Row 2 */}
            <SegmentSelector 
                label="Salesperson" // Duplicate in screenshot? Keeping as is for now, maybe user meant 'Project Manager' or similar? Or it's just repeating.
                segments={['All', 'Matt McVittie', 'Chad McComas', 'Trever Weber']}
                selectedSegment={filters.salesperson}
                onSelect={(val) => onFilterChange('salesperson', val || 'All')}
                orientation="vertical"
            />

            <SegmentSelector 
                label="Quote Status"
                segments={['All', 'Draft', 'Sent', 'Accepted', 'Did Job']}
                selectedSegment={filters.status}
                onSelect={(val) => onFilterChange('status', val || 'All')}
                orientation="vertical"
            />

            {/* Date Range - Spanning 2 columns or just sitting there */}
            <Box sx={{ gridColumn: { md: 'span 2' } }}>
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
                            minWidth: '300px',
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
            </Box>
        </Box>
    );
}
