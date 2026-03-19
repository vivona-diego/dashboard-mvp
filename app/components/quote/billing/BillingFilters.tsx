'use client';

import { Box } from '@mui/material';
import SegmentSelector from '@/app/components/dashboard/SegmentSelector';

interface BillingFiltersProps {
    filters: {
        billingCode: string;
        measure: string;
    };
    onFilterChange: (key: string, value: string) => void;
}

export default function BillingFilters({
    filters,
    onFilterChange
}: BillingFiltersProps) {
    return (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, p: 2, bgcolor: 'background.paper', borderRadius: 2 }}>
            <SegmentSelector 
                label="Billing Code"
                segments={['All', 'Cartage Lot', 'Oakland County Permit']}
                selectedSegment={filters.billingCode}
                onSelect={(val) => onFilterChange('billingCode', val || 'All')}
                orientation="vertical"
            />
            
            <SegmentSelector 
                label="Measure"
                segments={['All', 'Each', 'Weeks', 'Hours']}
                selectedSegment={filters.measure}
                onSelect={(val) => onFilterChange('measure', val || 'All')}
                orientation="vertical"
            />
        </Box>
    );
}
