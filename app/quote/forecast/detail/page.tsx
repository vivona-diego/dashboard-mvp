'use client';

import { Box, Typography } from '@mui/material';
import { useState } from 'react';
import { DateTime } from 'luxon';
import DetailFilters from '@/app/components/quote/forecast/DetailFilters';
import DetailGrid, { DetailGridData } from '@/app/components/quote/forecast/DetailGrid';

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

    // Mock Data based on screenshot
    const gridData: DetailGridData[] = [
        {
            id: '1',
            quoteNo: 'C-17910',
            status: 'Did Job',
            salesperson: 'Chad McComas',
            customer: 'Port City Marine Services Canada Inc.',
            date: '01/01/2024',
            line: 1,
            billingDesc: '115 Ton Truck Crane',
            measure: 'Hours',
            qty: 8,
            rate: 265.00,
            estimated: 1960,
            totalHrlyCost: 122,
            expense: 979,
            netProfit: 981,
            margin: 50.0
        },
        {
            id: '2',
            quoteNo: 'C-17910',
            status: 'Did Job',
            salesperson: 'Chad McComas',
            customer: 'Port City Marine Services Canada Inc.',
            date: '01/01/2024',
            line: 3,
            billingDesc: 'City of Detroit Permit',
            measure: 'Each',
            qty: 1,
            rate: 450.00,
            estimated: 400,
            totalHrlyCost: 435,
            expense: 435,
            netProfit: -35,
            margin: -8.7
        },
        {
            id: '3',
            quoteNo: 'C-17910',
            status: 'Did Job',
            salesperson: 'Chad McComas',
            customer: 'Port City Marine Services Canada Inc.',
            date: '01/01/2024',
            line: 6,
            billingDesc: 'Fuel Surcharge',
            measure: 'Percent',
            qty: 1,
            rate: 7.00,
            estimated: 213,
            totalHrlyCost: 0,
            expense: 0,
            netProfit: 213,
            margin: 100.0
        },
        // Adding more rows similar to screenshot
        {
            id: '4',
            quoteNo: 'C-17911',
            status: 'Did Job',
            salesperson: 'Chad McComas',
            customer: 'Limbach Company LLC',
            date: '02/01/2024',
            line: 1,
            billingDesc: '80 ton Truck Crane',
            measure: 'Hours',
            qty: 6,
            rate: 245.00,
            estimated: 1356,
            totalHrlyCost: 128,
            expense: 765,
            netProfit: 591,
            margin: 43.6
        },
        {
            id: '5',
            quoteNo: 'C-17912',
            status: 'Budgetary',
            salesperson: 'Matt McVittie',
            customer: 'COMMERCIAL CONTRACTING CORP',
            date: '03/01/2024',
            line: 1,
            billingDesc: '50 Ton ML Hourly',
            measure: 'Hours',
            qty: 40,
            rate: 215.00,
            estimated: 8400,
            totalHrlyCost: 31,
            expense: 1246,
            netProfit: 7154,
            margin: 85.2
        },
    ];

    return (
        <Box sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column', gap: 4 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
                Quote Profit Forecast - Detail
            </Typography>

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
            </Box>
        </Box>
    );
}
