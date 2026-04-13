'use client';

import {
    Box,
    Typography,
    Paper,
    FormControl,
    Select,
    MenuItem,
    Stack,
    Grid,
    Card,
    CardContent,
    useTheme,
    Skeleton,
} from '@mui/material';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import ReactECharts with ssr: false to prevent hydration/layout effect errors
const ReactECharts = dynamic(() => import('echarts-for-react'), { 
    ssr: false,
    loading: () => <Skeleton variant="rectangular" width="100%" height="100%" sx={{ borderRadius: 1 }} />
});

export default function EquipmentSummaryPage() {
    const theme = useTheme();
    const [unitType, setUnitType] = useState('All');
    const [unitCode, setUnitCode] = useState('All');
    const [year, setYear] = useState('2021');
    const [month, setMonth] = useState('July');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const kpiData = {
        profitPercent: 25.95,
        revenue: 1000000,
        expenses: -964000,
        profitDol: 338000,
    };

    const commonChartOptions = {
        tooltip: { trigger: 'item' },
        backgroundColor: 'transparent',
    };

    // 1. Profit % Gauge
    const profitGaugeOptions = {
        ...commonChartOptions,
        series: [
            {
                type: 'pie',
                radius: ['60%', '80%'],
                center: ['50%', '75%'],
                startAngle: 180,
                label: { show: false },
                data: [
                    { value: kpiData.profitPercent, name: 'Profit %', itemStyle: { color: '#00BCD4' } },
                    { value: 100 - kpiData.profitPercent, name: '', itemStyle: { color: '#E0E0E0' } },
                    { value: 100, name: '', itemStyle: { color: 'none' } }
                ]
            }
        ]
    };

    // 2. Equipment Expenses (Pie)
    const equipmentExpensesOptions = {
        ...commonChartOptions,
        tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
        legend: { orient: 'vertical', right: '5%', top: 'center', textStyle: { color: theme.palette.text.primary } },
        series: [
            {
                name: 'Equipment Expenses',
                type: 'pie',
                radius: ['40%', '70%'],
                center: ['35%', '50%'],
                data: [
                    { value: 601000, name: 'Overhead', itemStyle: { color: '#F27127' } },
                    { value: 127000, name: 'Materials', itemStyle: { color: '#002E8A' } },
                    { value: 236000, name: 'Labor', itemStyle: { color: '#2C9CF2' } },
                ],
                label: {
                    formatter: '${c}\n({d}%)',
                    color: theme.palette.text.secondary
                }
            }
        ]
    };

    // 3. Labor Expenses Classification (Horizontal Bar)
    const laborExpensesOptions = {
        ...commonChartOptions,
        tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
        grid: { left: '25%', right: '15%', top: '10%', bottom: '15%' },
        xAxis: { type: 'value', axisLabel: { formatter: '${value}K', color: theme.palette.text.secondary }, splitLine: { lineStyle: { color: theme.palette.divider, type: 'dashed' } } },
        yAxis: { 
            type: 'category', 
            data: ['Oiler Shop', 'Operator S...', 'Grease Tr...', 'Mechanic L...', 'Oiler Labor', 'Operator L...'],
            axisLabel: { color: theme.palette.text.primary },
            axisLine: { lineStyle: { color: theme.palette.divider } }
        },
        series: [
            {
                type: 'bar',
                data: [0, 1000, 7000, 8000, 48000, 164000].map(v => Math.round(v/1000)),
                itemStyle: { color: '#2C9CF2' },
                label: { show: true, position: 'right', formatter: '${c}K', color: theme.palette.text.secondary }
            }
        ]
    };

    // 4. Material Expenses Classification (Horizontal Bar)
    const materialExpensesOptions = {
        ...commonChartOptions,
        tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
        grid: { left: '25%', right: '15%', top: '10%', bottom: '15%' },
        xAxis: { type: 'value', axisLabel: { formatter: '${value}K', color: theme.palette.text.secondary }, splitLine: { lineStyle: { color: theme.palette.divider, type: 'dashed' } } },
        yAxis: { 
            type: 'category', 
            data: ['Shop Mate...', 'Lubricants', 'Fuel', 'Outside Re...', 'Outside Fre...', 'Parts', 'Rent From...'],
            axisLabel: { color: theme.palette.text.primary },
            axisLine: { lineStyle: { color: theme.palette.divider } }
        },
        series: [
            {
                type: 'bar',
                data: [0, 0, 12000, 13000, 19000, 36000, 46000].map(v => Math.round(v/1000)), 
                itemStyle: { color: '#2C9CF2' },
                label: { show: true, position: 'right', formatter: '${c}K', color: theme.palette.text.secondary }
            }
        ]
    };

    // 5. YTD Revenue Area Chart
    const ytdOptions = {
        ...commonChartOptions,
        tooltip: { trigger: 'axis' },
        legend: { data: ['Revenue', 'Expenses', 'Profit'], top: 10, left: 'center', textStyle: { color: theme.palette.text.primary } },
        grid: { left: '5%', right: '5%', bottom: '15%', top: '20%', containLabel: true },
        xAxis: { 
            type: 'category', 
            boundaryGap: false, 
            data: ['January','February','March','April','May','June','July','August','September','October','November','December'],
            axisLabel: { color: theme.palette.text.secondary, rotate: 45 },
            axisLine: { lineStyle: { color: theme.palette.divider } }
        },
        yAxis: { 
            type: 'value', 
            axisLabel: { formatter: '${value}M', color: theme.palette.text.secondary },
            splitLine: { lineStyle: { color: theme.palette.divider, type: 'dashed' } }
        },
        series: [
            {
                name: 'Revenue',
                type: 'line',
                areaStyle: { opacity: 0.2 },
                data: [0.2, 0.5, 0.6, 0.7, 0.8, 1.3, 1.3, 0.8, 1.0, 1.0, 1.1, 1.3],
                itemStyle: { color: '#2C9CF2' },
                symbol: 'circle',
            },
            {
                name: 'Expenses',
                type: 'line',
                areaStyle: { opacity: 0.2 },
                data: [0.5, 0.6, 0.7, 0.6, 0.5, 0.8, 1.0, 0.5, 0.7, 0.8, 0.9, 0.7],
                itemStyle: { color: '#002E8A' },
                symbol: 'circle',
            },
            {
                name: 'Profit',
                type: 'line',
                areaStyle: { opacity: 0.2 },
                data: [0.1, 0.1, 0, 0.2, 0.5, 0.5, 0.3, 0.3, 0.3, 0.3, 0.3, 0.6],
                itemStyle: { color: '#F27127' },
                symbol: 'circle',
            }
        ]
    };

    // 6. Overhead Expenses (Donut)
    const overheadExpensesOptions = {
        ...commonChartOptions,
        tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
        legend: { orient: 'vertical', right: '5%', top: 'center', textStyle: { color: theme.palette.text.primary } },
        series: [
            {
                name: 'Overhead Expenses',
                type: 'pie',
                radius: ['40%', '70%'],
                center: ['35%', '50%'],
                data: [
                    { value: 601000, name: 'Material Overhead', itemStyle: { color: '#2C9CF2' } },
                    { value: 526000, name: 'Labor Overhead', itemStyle: { color: '#002E8A' } },
                    { value: 165000, name: 'Union', itemStyle: { color: '#F27127' } },
                ],
                label: {
                    formatter: '${c}\n({d}%)',
                    color: theme.palette.text.secondary
                }
            }
        ]
    };

    if (!mounted) {
        return <Box sx={{ p: 4, minHeight: '100vh', bgcolor: 'background.default' }} />;
    }

    return (
        <Box sx={{ p: { xs: 2, md: 3 }, bgcolor: 'background.default', minHeight: '100vh' }}>
            {/* Header Content */}
            <Paper elevation={0} sx={{ p: 2, mb: 3, bgcolor: 'background.paper', borderRadius: 2 }}>
                <Typography variant="h5" fontWeight="bold" sx={{ color: 'text.primary' }}>
                    Equipment P/L Dashboard
                </Typography>
            </Paper>

            <Grid container spacing={3}>
                {/* Left Side Filters */}
                <Grid size={{ xs: 12, md: 2 }}>
                    <Stack spacing={3}>
                        <Box>
                            <Typography variant="caption" sx={{ fontWeight: 'bold', mb: 0.5, display: 'block', color: 'text.secondary' }}>Unit Type</Typography>
                            <FormControl fullWidth size="small">
                                <Select value={unitType} onChange={(e) => setUnitType(e.target.value)}>
                                    <MenuItem value="All">All</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                        <Box>
                            <Typography variant="caption" sx={{ fontWeight: 'bold', mb: 0.5, display: 'block', color: 'text.secondary' }}>Unit Code</Typography>
                            <FormControl fullWidth size="small">
                                <Select value={unitCode} onChange={(e) => setUnitCode(e.target.value)}>
                                    <MenuItem value="All">All</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                        <Box>
                            <Typography variant="caption" sx={{ fontWeight: 'bold', mb: 0.5, display: 'block', color: 'text.secondary' }}>Year</Typography>
                            <FormControl fullWidth size="small">
                                <Select value={year} onChange={(e) => setYear(e.target.value)}>
                                    <MenuItem value="2021">2021</MenuItem>
                                    <MenuItem value="2022">2022</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                        <Box>
                            <Typography variant="caption" sx={{ fontWeight: 'bold', mb: 0.5, display: 'block', color: 'text.secondary' }}>Month</Typography>
                            <FormControl fullWidth size="small">
                                <Select value={month} onChange={(e) => setMonth(e.target.value)}>
                                    <MenuItem value="July">July</MenuItem>
                                    <MenuItem value="August">August</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                    </Stack>
                </Grid>

                {/* Right Side Main Content */}
                <Grid size={{ xs: 12, md: 10 }}>
                    <Stack spacing={3}>
                        
                        {/* KPI Row */}
                        <Grid container spacing={2}>
                            {/* Gauge Profit % */}
                            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                                <Card elevation={0} sx={{ height: 120, borderRadius: 2, display: 'flex', flexDirection: 'column', position: 'relative' }}>
                                    <CardContent sx={{ p: 2, pb: 0, flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <Typography variant="caption" color="text.secondary" fontWeight="bold">Profit %</Typography>
                                        <Box sx={{ width: '100%', height: 100, position: 'absolute', top: 20 }}>
                                            <ReactECharts option={profitGaugeOptions} style={{ height: '100%', width: '100%' }} />
                                            <Typography variant="h6" fontWeight="bold" sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -10%)' }}>
                                                {kpiData.profitPercent}%
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 2, pb: 1, zIndex: 1 }}>
                                        <Typography variant="caption" color="text.secondary">0.00%</Typography>
                                        <Typography variant="caption" color="text.secondary">100.00%</Typography>
                                    </Box>
                                </Card>
                            </Grid>
                            
                            {/* Equipment Revenue */}
                            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                                <Card elevation={0} sx={{ height: 120, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <CardContent sx={{ textAlign: 'center' }}>
                                        <Typography variant="h4" fontWeight="bold" color="text.primary">
                                            $1M
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: '#2C9CF2', mt: 1 }}>
                                            Equipment Revenue
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>

                            {/* Equipment Expenses */}
                            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                                <Card elevation={0} sx={{ height: 120, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <CardContent sx={{ textAlign: 'center' }}>
                                        <Typography variant="h4" fontWeight="bold" color="text.primary">
                                            ($964K)
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: '#2C9CF2', mt: 1 }}>
                                            Equipment Expenses
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>

                            {/* Profit $ & % */}
                            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                                <Grid container spacing={2}>
                                    <Grid size={6}>
                                        <Card elevation={0} sx={{ height: 120, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <CardContent sx={{ textAlign: 'center', p: 1 }}>
                                                <Typography variant="h5" fontWeight="bold" color="text.primary">
                                                    $338K
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: '#2C9CF2' }}>
                                                    Profit $
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                    <Grid size={6}>
                                        <Card elevation={0} sx={{ height: 120, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <CardContent sx={{ textAlign: 'center', p: 1 }}>
                                                <Typography variant="h5" fontWeight="bold" color="text.primary">
                                                    25.95%
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: '#2C9CF2' }}>
                                                    Profit %
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>

                        {/* Middle Charts Row */}
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <Card elevation={0} sx={{ borderRadius: 2, height: 350, display: 'flex', flexDirection: 'column' }}>
                                    <Box sx={{ p: 1.5, borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
                                        <Typography variant="subtitle2" fontWeight="bold" align="center">Equipment Expenses</Typography>
                                    </Box>
                                    <CardContent sx={{ p: 0, flexGrow: 1 }}>
                                        <ReactECharts option={equipmentExpensesOptions} style={{ height: '100%', width: '100%' }} />
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <Card elevation={0} sx={{ borderRadius: 2, height: 350, display: 'flex', flexDirection: 'column' }}>
                                    <Box sx={{ p: 1.5, borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
                                        <Typography variant="subtitle2" fontWeight="bold" align="center">Labor Expenses Classification</Typography>
                                    </Box>
                                    <CardContent sx={{ p: 0, flexGrow: 1 }}>
                                        <ReactECharts option={laborExpensesOptions} style={{ height: '100%', width: '100%' }} />
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <Card elevation={0} sx={{ borderRadius: 2, height: 350, display: 'flex', flexDirection: 'column' }}>
                                    <Box sx={{ p: 1.5, borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
                                        <Typography variant="subtitle2" fontWeight="bold" align="center">Material Expenses</Typography>
                                    </Box>
                                    <CardContent sx={{ p: 0, flexGrow: 1 }}>
                                        <ReactECharts option={materialExpensesOptions} style={{ height: '100%', width: '100%' }} />
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>

                        {/* Bottom Charts Row */}
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, md: 8 }}>
                                <Card elevation={0} sx={{ borderRadius: 2, height: 400, display: 'flex', flexDirection: 'column' }}>
                                    <Box sx={{ p: 1.5, borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
                                        <Typography variant="subtitle2" fontWeight="bold" align="center">YTD Revenue, Expenses and Profit by Month</Typography>
                                    </Box>
                                    <CardContent sx={{ p: 1, flexGrow: 1 }}>
                                        <ReactECharts option={ytdOptions} style={{ height: '100%', width: '100%' }} />
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <Card elevation={0} sx={{ borderRadius: 2, height: 400, display: 'flex', flexDirection: 'column' }}>
                                    <Box sx={{ p: 1.5, borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
                                        <Typography variant="subtitle2" fontWeight="bold" align="center">Overhead Expenses</Typography>
                                    </Box>
                                    <CardContent sx={{ p: 0, flexGrow: 1 }}>
                                        <ReactECharts option={overheadExpensesOptions} style={{ height: '100%', width: '100%' }} />
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>

                    </Stack>
                </Grid>
            </Grid>
        </Box>
    );
}
