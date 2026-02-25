'use client';

import { Box, Typography } from '@mui/material';
import { useState } from 'react';
import { DateTime } from 'luxon';
import ForecastFilters from '@/app/components/quote/forecast/ForecastFilters';
import ProfitForecastChart from '@/app/components/quote/forecast/ProfitForecastChart';
import MarginForecastChart from '@/app/components/quote/forecast/MarginForecastChart';
import ForecastGrid, { GridData } from '@/app/components/quote/forecast/ForecastGrid';

export default function QuoteProfitForecastPage() {
    // State for filters
    const [dateRange, setDateRange] = useState<{ start: DateTime | null; end: DateTime | null }>({
        start: DateTime.fromObject({ year: 2024, month: 1, day: 1 }),
        end: DateTime.fromObject({ year: 2024, month: 6, day: 30 })
    });

    const [filters, setFilters] = useState({
        status: 'All',
        salesperson: 'All',
        quoteNo: 'All'
    });

    const handleFilterChange = (key: string, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    // Mock Data
    const profitChartData = [
        { name: 'Matt McVittie', value: 13300000 },
        { name: 'Chad McComas', value: 1300000 },
        { name: 'Trever Weber', value: 100000 },
    ];

    const marginChartData = [
        { name: 'Trever Weber', value: 78.9 },
        { name: 'Matt McVittie', value: 75.7 },
        { name: 'Chad McComas', value: 59.2 },
    ];

    const gridData: GridData[] = [
        {
            id: '1',
            salesperson: 'Chad McComas',
            qty: 10074,
            rate: 315,
            measure: 'Days',
            estimated: 2275521,
            directExpense: 750315,
            grossProfit: 1764785,
            indirectExp: 177421,
            expense: 927736,
            netProfit: 1347785,
            margin: 59.2,
            children: []
        },
        {
            id: '2',
            salesperson: 'Matt McVittie',
            qty: 74295,
            rate: 1204,
            measure: 'CASE',
            estimated: 17521852,
            directExpense: 3924080,
            grossProfit: 14317531,
            indirectExp: 333607,
            expense: 4257687,
            netProfit: 13264165,
            margin: 75.7,
            children: []
        },
        {
            id: '3',
            salesperson: 'Trever Weber',
            qty: 826,
            rate: 407,
            measure: 'Each',
            estimated: 166851,
            directExpense: 31997,
            grossProfit: 139817,
            indirectExp: 3204,
            expense: 35201,
            netProfit: 131649,
            margin: 78.9,
             children: [
                {
                    id: '3-1',
                    salesperson: 'DTE ENERGY - ST. CLAIR PP',
                    qty: 35,
                    rate: 1067,
                    measure: 'Each',
                    estimated: 10621,
                    directExpense: 2718,
                    grossProfit: 8903,
                    indirectExp: 1598,
                    expense: 4316,
                    netProfit: 6306,
                    margin: 59.4,
                     children: [
                        {
                            id: '3-1-1',
                            salesperson: 'C-18654',
                            qty: 35,
                            rate: 1067,
                            measure: 'Each',
                            estimated: 10621,
                            directExpense: 2718,
                            grossProfit: 8903,
                            indirectExp: 1598,
                            expense: 4316,
                            netProfit: 6306,
                            margin: 59.4,
                            children: [
                                {
                                    id: '3-1-1-1',
                                    salesperson: 'Operator MC ST',
                                    qty: 16,
                                    rate: 117,
                                    measure: 'Hours',
                                    estimated: 1872,
                                    directExpense: 1220,
                                    grossProfit: 652,
                                    indirectExp: 1214,
                                    expense: 2433,
                                    netProfit: -561,
                                    margin: -30.0,
                                },
                                {
                                    id: '3-1-1-2',
                                    salesperson: 'Cartage In',
                                    qty: 1,
                                    rate: 2500,
                                    measure: 'Each',
                                    estimated: 2500,
                                    directExpense: 500,
                                    grossProfit: 2500, // Should be 2000 logically but matching screen
                                    indirectExp: 192,
                                    expense: 692,
                                    netProfit: 1808,
                                    margin: 72.3,
                                }
                            ]
                        }
                     ]
                }
            ]
        }
    ];

    return (
        <Box sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column', gap: 4 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
                Quote Profit Forecast - Summary
            </Typography>

            <Box sx={{ display: 'grid', gridTemplateColumns: 'minmax(250px, 1fr) 2fr 2fr', gap: 4 }}>
                {/* Left Column: Filters */}
                <ForecastFilters 
                    dateRange={dateRange}
                    onDateRangeChange={setDateRange}
                    filters={filters}
                    onFilterChange={handleFilterChange}
                />

                {/* Middle Column: Profit Chart */}
                <Box sx={{ bgcolor: 'background.paper', p: 2, borderRadius: 2, boxShadow: 1 }}>
                    <ProfitForecastChart data={profitChartData} />
                </Box>

                {/* Right Column: Margin Chart */}
                <Box sx={{ bgcolor: 'background.paper', p: 2, borderRadius: 2, boxShadow: 1 }}>
                    <MarginForecastChart data={marginChartData} />
                </Box>
            </Box>

            {/* Bottom Row: Grid */}
            <Box sx={{ flexGrow: 1, mt: 2 }}>
                <ForecastGrid data={gridData} />
            </Box>
        </Box>
    );
}
