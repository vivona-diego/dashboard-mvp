'use client';

import { Box, Typography } from '@mui/material';
import { useState } from 'react';
import BillingFilters from '@/app/components/quote/billing/BillingFilters';
import BillingGrid, { BillingGridData } from '@/app/components/quote/billing/BillingGrid';

export default function BillingPage() {
    const [filters, setFilters] = useState({
        billingCode: 'All',
        measure: 'All'
    });

    const handleFilterChange = (key: string, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    // Mock Data based on screenshot
    const gridData: BillingGridData[] = [
        {
            id: '1',
            billingCodeId: 1,
            billingCode: 'Cartage Lot',
            measure: 'Each',
            effStartDt: '01/01/2021',
            effEndDt: '31/12/2026',
            equipmentHourly: 0.00,
            laborHourly: 0.00,
            unionHourly: 0,
            wcHourly: 0.00,
            directCost: 0.00,
            materialBurden: 0.00,
            laborBurden: 0.00,
            totalCost: 0.00
        },
        {
            id: '4',
            billingCodeId: 4,
            billingCode: 'Oakland County Permit',
            measure: 'Each',
            effStartDt: '01/01/2021',
            effEndDt: '31/12/2026',
            equipmentHourly: 0.00,
            laborHourly: 0.00,
            unionHourly: 0,
            wcHourly: 0.00,
            directCost: 57.92,
            materialBurden: 1.00,
            laborBurden: 0.00,
            totalCost: 58.92
        },
        {
            id: '6',
            billingCodeId: 6,
            billingCode: '80 Ton CP Bare Rental',
            measure: 'Weeks',
            effStartDt: '01/01/2021',
            effEndDt: '31/12/2026',
            equipmentHourly: 53.92,
            laborHourly: 0.00,
            unionHourly: 0,
            wcHourly: 0.00,
            directCost: 53.92,
            materialBurden: 0.00,
            laborBurden: 0.00,
            totalCost: 53.92
        },
        {
            id: '7',
            billingCodeId: 7,
            billingCode: '22 Ton CP Bare Rental',
            measure: 'Weeks',
            effStartDt: '01/01/2021',
            effEndDt: '31/12/2026',
            equipmentHourly: 6.02,
            laborHourly: 0.00,
            unionHourly: 0,
            wcHourly: 0.00,
            directCost: 6.02,
            materialBurden: 0.00,
            laborBurden: 0.00,
            totalCost: 6.02
        },
         {
            id: '8',
            billingCodeId: 8,
            billingCode: '440 Ton MC Hourly Rate',
            measure: 'Hours',
            effStartDt: '01/01/2021',
            effEndDt: '31/12/2026',
            equipmentHourly: 335.08,
            laborHourly: 0.00,
            unionHourly: 0,
            wcHourly: 0.00,
            directCost: 335.08,
            materialBurden: 0.00,
            laborBurden: 0.00,
            totalCost: 335.08
        },
        {
            id: '37',
            billingCodeId: 37,
            billingCode: 'Operator Straight Time',
            measure: 'Hours',
            effStartDt: '04/12/2024',
            effEndDt: '31/12/2026',
            equipmentHourly: 0.00,
            laborHourly: 42.15,
            unionHourly: 33.02,
            wcHourly: 3.72,
            directCost: 78.89,
            materialBurden: 0.00,
            laborBurden: 48.47,
            totalCost: 127.36
        },
        {
            id: '38',
            billingCodeId: 38,
            billingCode: 'Operator Time And Half',
            measure: 'Hours',
            effStartDt: '04/12/2024',
            effEndDt: '31/12/2026',
            equipmentHourly: 0.00,
            laborHourly: 107.51,
            unionHourly: 64.04,
            wcHourly: 6.32,
            directCost: 177.87,
            materialBurden: 0.00,
            laborBurden: 123.64,
            totalCost: 301.51
        },
        // Add more rows if needed, but this covers the types
    ];

    return (
        <Box sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column', gap: 4 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
                Billing Codes, Costs & Calculations
            </Typography>

            {/* Filters and Explanatory Text */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 2fr' }, gap: 4 }}>
                <BillingFilters
                    filters={filters}
                    onFilterChange={handleFilterChange}
                />
                
                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                        <strong>Direct Costs (Total)</strong> = Equipment + Labor + Union + WC Costs (Represented hourly, measure conversion applied for totals)
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        <strong>Indirect Cost</strong> = Burden Cost
                    </Typography>
                     <Typography variant="body2" color="text.secondary">
                        <strong>Gross Profit $</strong> = Estimate - Direct Costs
                    </Typography>
                     <Typography variant="body2" color="text.secondary">
                        <strong>Net Profit</strong> = Estimate - (Direct Costs + Indirect Cost)
                    </Typography>
                </Box>
            </Box>

            {/* Grid */}
            <Box sx={{ flexGrow: 1 }}>
                <BillingGrid data={gridData} />
            </Box>
        </Box>
    );
}
