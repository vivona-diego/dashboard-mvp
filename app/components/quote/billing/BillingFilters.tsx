'use client';

import { Box } from '@mui/material';
import { useEffect, useState } from 'react';
import SegmentSelector from '@/app/components/dashboard/SegmentSelector';
import api from '@/app/lib/axiosClient';

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
    const DATASET_NAME = 'quote_profit_forecast';

    const [billingCodeOptions, setBillingCodeOptions] = useState<string[]>([]);
    const [measureOptions, setMeasureOptions] = useState<string[]>([]);
    const [loadingOptions, setLoadingOptions] = useState(false);

    useEffect(() => {
        const loadOptions = async () => {
            try {
                setLoadingOptions(true);
                const [billingRes, measureRes] = await Promise.all([
                    api.get('/bi/segment-values', {
                        params: { datasetName: DATASET_NAME, segmentName: 'BillingDescription', limit: 100 },
                    }),
                    api.get('/bi/segment-values', {
                        params: { datasetName: DATASET_NAME, segmentName: 'Measure', limit: 100 },
                    }),
                ]);

                const billingValues =
                    billingRes.data?.data?.values || billingRes.data?.values || [];
                const measureValues =
                    measureRes.data?.data?.values || measureRes.data?.values || [];

                setBillingCodeOptions(billingValues.map((v: any) => v.displayValue));
                setMeasureOptions(measureValues.map((v: any) => v.displayValue));
            } catch (err) {
                console.error('Error loading Billing filters:', err);
                setBillingCodeOptions([]);
                setMeasureOptions([]);
            } finally {
                setLoadingOptions(false);
            }
        };

        loadOptions();
    }, []);

    return (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, p: 2, bgcolor: 'background.paper', borderRadius: 2 }}>
            <SegmentSelector 
                label="Billing Code"
                segments={['All', ...billingCodeOptions]}
                selectedSegment={filters.billingCode}
                onSelect={(val) => onFilterChange('billingCode', val || 'All')}
                loading={loadingOptions}
                orientation="vertical"
            />
            
            <SegmentSelector 
                label="Measure"
                segments={['All', ...measureOptions]}
                selectedSegment={filters.measure}
                onSelect={(val) => onFilterChange('measure', val || 'All')}
                loading={loadingOptions}
                orientation="vertical"
            />
        </Box>
    );
}
