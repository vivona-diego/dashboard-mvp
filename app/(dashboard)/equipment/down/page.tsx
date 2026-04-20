'use client';

import { 
    Box, Typography, Paper, Grid, Button, ButtonGroup, 
    CircularProgress, Stack 
} from '@mui/material';
import { useState, useEffect } from 'react';
import SegmentSelector from '@/app/components/dashboard/SegmentSelector';
import DownUnitChart from '@/app/components/equipment/DownUnitChart';
import DownUnitTable from '@/app/components/equipment/DownUnitTable';
import api from '@/app/lib/axiosClient';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function DownUnitReportPage() {
    const DATASET_NAME = 'Equipment_Utilization';
    
    // Filters State
    const [selectedYear, setSelectedYear] = useState('2022');
    const [unitType, setUnitType] = useState<string | null>(null);
    const [unitCode, setUnitCode] = useState<string | null>(null);

    // Segment Options
    const [unitTypes, setUnitTypes] = useState<string[]>([]);
    const [unitCodes, setUnitCodes] = useState<string[]>([]);

    // Loading & Data Status
    const [loadingFilters, setLoadingFilters] = useState(false);
    const [loadingData, setLoadingData] = useState(false);
    
    const [tableData, setTableData] = useState<any[]>([]);
    const [chartData, setChartData] = useState({
        months: MONTHS,
        currentYear: Array(12).fill(0),
        lastYear: Array(12).fill(0),
    });

    const years = ['2022', '2023', '2024', '2025', '2026'];

    const fetchFilterData = async (segmentName: string, setter: (data: string[]) => void) => {
        try {
            const res = await api.get('/bi/segment-values', {
                params: {
                    datasetName: DATASET_NAME,
                    segmentName: segmentName,
                    limit: 100,
                },
            });
            const values = res.data?.data?.values || res.data?.values || [];
            setter(values.map((v: any) => v.displayValue));
        } catch (error) {
            console.error(`Error fetching ${segmentName}:`, error);
        }
    };

    useEffect(() => {
        const loadFilters = async () => {
            setLoadingFilters(true);
            await Promise.all([
                fetchFilterData('UnitType', setUnitTypes),
                fetchFilterData('UnitCode', setUnitCodes),
            ]);
            setLoadingFilters(false);
        };
        loadFilters();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            setLoadingData(true);
            try {
                const baseFilters = [
                    ...(unitType && unitType !== 'All' ? [{ segmentName: 'UnitType', operator: 'eq', value: unitType }] : []),
                    ...(unitCode && unitCode !== 'All' ? [{ segmentName: 'UnitCode', operator: 'eq', value: unitCode }] : []),
                ];

                // 1. Fetch Chart Data (CY and LY)
                const chartFiltersCY = [...baseFilters, { segmentName: 'Year', operator: 'eq', value: selectedYear }];
                const chartFiltersLY = [...baseFilters, { segmentName: 'Year', operator: 'eq', value: (parseInt(selectedYear) - 1).toString() }];

                const [resChartCY, resChartLY, resTable] = await Promise.all([
                    api.post('/bi/query', {
                        datasetName: DATASET_NAME,
                        groupBySegments: ['Month'],
                        metrics: [{ metricName: 'TotalDowntimeHours' }],
                        ...(chartFiltersCY.length > 0 && { filters: chartFiltersCY }),
                        pagination: { page: 1, pageSize: 50 }
                    }).catch(() => null),
                    api.post('/bi/query', {
                        datasetName: DATASET_NAME,
                        groupBySegments: ['Month'],
                        metrics: [{ metricName: 'TotalDowntimeHours' }],
                        ...(chartFiltersLY.length > 0 && { filters: chartFiltersLY }),
                        pagination: { page: 1, pageSize: 50 }
                    }).catch(() => null),
                    api.post('/bi/query', {
                         datasetName: DATASET_NAME,
                         groupBySegments: ['UnitCode'],
                         metrics: [{ metricName: 'TotalDowntimeDays' }, { metricName: 'TotalDowntimeHours' }],
                         ...(chartFiltersCY.length > 0 && { filters: chartFiltersCY }),
                         pagination: { page: 1, pageSize: 1000 }
                    }).catch(() => null)
                ]);

                // Map Chart Data
                const cyHours = Array(12).fill(0);
                const lyHours = Array(12).fill(0);
                
                const processChartRes = (res: any, targetArray: number[]) => {
                    if (res?.data?.success || (res?.data?.data && Array.isArray(res.data.data?.data))) {
                        const rows = res.data.data?.data || res.data.data || [];
                        rows.forEach((r: any) => {
                            const monthIdx = parseInt(r.Month) - 1;
                            if (monthIdx >= 0 && monthIdx < 12) {
                                targetArray[monthIdx] = parseFloat(r.TotalDowntimeHours || 0);
                            }
                        });
                    }
                };

                processChartRes(resChartCY, cyHours);
                processChartRes(resChartLY, lyHours);

                setChartData({ months: MONTHS, currentYear: cyHours, lastYear: lyHours });

                // Map Table Data
                if (resTable?.data?.success || (resTable?.data?.data && Array.isArray(resTable.data.data?.data))) {
                    const rows = resTable.data.data?.data || resTable.data.data || [];
                    const mappedRows = rows.map((r: any) => ({
                         unitCode: r.UnitCode || 'Unknown',
                         startDt: '',
                         endDt: '',
                         daysDown: parseFloat(r.TotalDowntimeDays || 0),
                         downHours: parseFloat(r.TotalDowntimeHours || 0),
                         reason: 'Down',
                         comments: ''
                    }));
                    // Remove 0 records
                    const filteredRows = mappedRows.filter((r: any) => r.daysDown > 0 || r.downHours > 0);
                    // Sort descending by hours
                    filteredRows.sort((a: any, b: any) => b.downHours - a.downHours);
                    setTableData(filteredRows);
                } else {
                    setTableData([]);
                }

            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoadingData(false);
            }
        };

        fetchData();
    }, [selectedYear, unitType, unitCode]);


    return (
        <Box sx={{ p: 4, bgcolor: 'background.default', minHeight: '100vh', display: 'flex', flexDirection: 'column', gap: 4 }}>
            {/* Top Row: Title and Year Filter */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h5" fontWeight="bold" sx={{ color: '#00BCD4' }}>
                    Down Unit - Report
                </Typography>
                <ButtonGroup size="small" variant="outlined" sx={{ '& .MuiButton-root': { py: 0.5, px: 2 } }}>
                    {years.map((year) => (
                        <Button
                            key={year}
                            onClick={() => setSelectedYear(year)}
                            sx={{
                                color: selectedYear === year ? 'white' : 'text.secondary',
                                bgcolor: selectedYear === year ? '#424242' : 'transparent',
                                borderColor: 'divider',
                                '&:hover': {
                                    bgcolor: selectedYear === year ? '#424242' : 'action.hover',
                                    borderColor: 'divider',
                                },
                            }}
                        >
                            {year}
                        </Button>
                    ))}
                </ButtonGroup>
            </Box>

            {/* Middle Section: Dropdown Filters and Chart */}
            <Grid container spacing={4} sx={{ position: 'relative' }}>
                {loadingData && (
                    <Box sx={{ 
                        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, 
                        display: 'flex', alignItems: 'center', justifyContent: 'center', 
                        bgcolor: 'rgba(255,255,255,0.7)', zIndex: 1 
                    }}>
                        <CircularProgress />
                    </Box>
                )}
                
                <Grid size={{ xs: 12, md: 3 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <Box>
                            <SegmentSelector 
                                label='Select a Unit Type'
                                segments={unitTypes} 
                                selectedSegment={unitType} 
                                onSelect={setUnitType}
                                loading={loadingFilters}
                            />
                        </Box>
                        <Box>
                             <SegmentSelector 
                                label='Select a Unit Code'
                                segments={unitCodes} 
                                selectedSegment={unitCode} 
                                onSelect={setUnitCode}
                                loading={loadingFilters}
                            />
                        </Box>
                    </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 9 }}>
                    <Paper elevation={0} sx={{ p: 0, borderRadius: 2, overflow: 'hidden' }}>
                        <DownUnitChart data={chartData} />
                    </Paper>
                </Grid>
            </Grid>

            {/* Bottom Section: Table */}
            <Box sx={{ flexGrow: 1, position: 'relative' }}>
                {loadingData && (
                    <Box sx={{ 
                        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, 
                        display: 'flex', alignItems: 'center', justifyContent: 'center', 
                        bgcolor: 'rgba(255,255,255,0.7)', zIndex: 1 
                    }}>
                        <CircularProgress />
                    </Box>
                )}
                <DownUnitTable data={tableData} />
            </Box>
        </Box>
    );
}
