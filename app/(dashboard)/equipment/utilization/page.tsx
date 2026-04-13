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
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    useTheme,
    alpha,
    Skeleton,
} from '@mui/material';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import formatter from '@/app/helpers/formatter';

// Dynamically import ReactECharts with ssr: false
const ReactECharts = dynamic(() => import('echarts-for-react'), { 
    ssr: false,
    loading: () => <Skeleton variant="rectangular" width="100%" height={300} sx={{ borderRadius: 2 }} />
});

interface MonthlyData {
    month: string;
    billed: number;
    hoursUtil: number;
    avgHourlyRate: number;
}

interface UnitTypeUtilization {
    unitType: string;
    months: Record<string, MonthlyData>;
}

const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const MOCK_UTILIZATION_DATA: UnitTypeUtilization[] = [
    {
        unitType: '155 Ton AT Class',
        months: {
            'Jan': { month: 'Jan', billed: 194921, hoursUtil: 298, avgHourlyRate: 389 },
            'Feb': { month: 'Feb', billed: 114196, hoursUtil: 178, avgHourlyRate: 382 },
            'Mar': { month: 'Mar', billed: 153298, hoursUtil: 237, avgHourlyRate: 386 },
            'Apr': { month: 'Apr', billed: 146856, hoursUtil: 231, avgHourlyRate: 378 },
            'May': { month: 'May', billed: 148257, hoursUtil: 229, avgHourlyRate: 386 },
            'Jun': { month: 'Jun', billed: 51107, hoursUtil: 87, avgHourlyRate: 456 },
        }
    },
    {
        unitType: '80 Ton AT Class',
        months: {
            'Jan': { month: 'Jan', billed: 102213, hoursUtil: 64, avgHourlyRate: 316 },
            'Feb': { month: 'Feb', billed: 73102, hoursUtil: 95, avgHourlyRate: 153 },
            'Mar': { month: 'Mar', billed: 62556, hoursUtil: 70, avgHourlyRate: 176 },
            'Apr': { month: 'Apr', billed: 63570, hoursUtil: 53, avgHourlyRate: 237 },
            'May': { month: 'May', billed: 58701, hoursUtil: 58, avgHourlyRate: 201 },
            'Jun': { month: 'Jun', billed: 43565, hoursUtil: 46, avgHourlyRate: 187 },
        }
    },
    {
        unitType: '350 Ton AT Class',
        months: {
            'Jan': { month: 'Jan', billed: 38644, hoursUtil: 36, avgHourlyRate: 634 },
            'Feb': { month: 'Feb', billed: 44524, hoursUtil: 36, avgHourlyRate: 742 },
            'Mar': { month: 'Mar', billed: 90513, hoursUtil: 76, avgHourlyRate: 710 },
            'Apr': { month: 'Apr', billed: 61694, hoursUtil: 49, avgHourlyRate: 743 },
            'May': { month: 'May', billed: 60840, hoursUtil: 42, avgHourlyRate: 869 },
            'Jun': { month: 'Jun', billed: 87368, hoursUtil: 57, avgHourlyRate: 920 },
        }
    },
    {
        unitType: '330 ton crawler',
        months: {
            'Jan': { month: 'Jan', billed: 201375, hoursUtil: 251, avgHourlyRate: 477 },
            'Feb': { month: 'Feb', billed: 120806, hoursUtil: 155, avgHourlyRate: 464 },
            'Mar': { month: 'Mar', billed: 162030, hoursUtil: 213, avgHourlyRate: 453 },
            'Apr': { month: 'Apr', billed: 87121, hoursUtil: 114, avgHourlyRate: 453 },
            'May': { month: 'May', billed: 59200, hoursUtil: 0, avgHourlyRate: 0 },
            'Jun': { month: 'Jun', billed: 59200, hoursUtil: 0, avgHourlyRate: 0 },
        }
    },
    {
        unitType: '75 Ton RT',
        months: {
            'Jan': { month: 'Jan', billed: 20373, hoursUtil: 14, avgHourlyRate: 420 },
            'Feb': { month: 'Feb', billed: 29305, hoursUtil: 33, avgHourlyRate: 263 },
            'Mar': { month: 'Mar', billed: 33045, hoursUtil: 25, avgHourlyRate: 398 },
            'Apr': { month: 'Apr', billed: 3086, hoursUtil: 2, avgHourlyRate: 386 },
            'May': { month: 'May', billed: 31583, hoursUtil: 26, avgHourlyRate: 361 },
            'Jun': { month: 'Jun', billed: 32530, hoursUtil: 46, avgHourlyRate: 211 },
        }
    }
];

export default function EquipmentUtilizationPage() {
    const theme = useTheme();
    const [year, setYear] = useState('2022');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const getUtilizationColor = (percent: number) => {
        if (percent >= 65) return '#00bfa5'; // Greenish Cyan
        if (percent >= 50) return '#ffb300'; // Amber/Yellow
        if (percent > 0) return '#ff5252'; // Red
        return 'transparent';
    };

    // Chart Options
    const utilizationLineOptions = {
        title: { text: 'Hours Utilization % By Month', left: 'center', textStyle: { fontSize: 14, color: theme.palette.text.secondary } },
        tooltip: { trigger: 'axis' },
        grid: { left: '10%', right: '10%', bottom: '15%', top: '20%' },
        xAxis: { type: 'category', data: MONTHS_SHORT, axisLabel: { color: theme.palette.text.secondary } },
        yAxis: { type: 'value', axisLabel: { formatter: '{value}%', color: theme.palette.text.secondary }, min: 30, max: 70 },
        series: [{
            data: [51, 50, 48, 43, 41, 40, 47, 56, 54, 57, 37, 45],
            type: 'line',
            smooth: true,
            symbolSize: 8,
            itemStyle: { color: '#00bfa5' },
            lineStyle: { width: 3 },
            label: { show: true, position: 'top', formatter: '{c}%' }
        }]
    };

    const billedLineOptions = {
        title: { text: 'Billed $ By Month', left: 'center', textStyle: { fontSize: 14, color: theme.palette.text.secondary } },
        tooltip: { trigger: 'axis' },
        grid: { left: '15%', right: '5%', bottom: '15%', top: '20%' },
        xAxis: { type: 'category', data: MONTHS_SHORT, axisLabel: { color: theme.palette.text.secondary } },
        yAxis: { type: 'value', axisLabel: { formatter: '${value}M', color: theme.palette.text.secondary } },
        series: [{
            data: [0.68, 0.54, 0.66, 0.53, 0.55, 0.46, 0.44, 0.82, 0.61, 0.51, 0.48, 0.48],
            type: 'line',
            smooth: true,
            symbolSize: 8,
            itemStyle: { color: '#00bfa5' },
            lineStyle: { width: 3 },
            label: { show: true, position: 'top', formatter: '${c}M' }
        }]
    };

    const rateLineOptions = {
        title: { text: 'Avg Hrly Rate $ By Month', left: 'center', textStyle: { fontSize: 14, color: theme.palette.text.secondary } },
        tooltip: { trigger: 'axis' },
        grid: { left: '15%', right: '5%', bottom: '15%', top: '20%' },
        xAxis: { type: 'category', data: MONTHS_SHORT, axisLabel: { color: theme.palette.text.secondary } },
        yAxis: { type: 'value', axisLabel: { formatter: '${value}', color: theme.palette.text.secondary }, min: 150, max: 250 },
        series: [{
            data: [239, 193, 249, 219, 244, 211, 168, 238, 205, 163, 226, 188],
            type: 'line',
            smooth: true,
            symbolSize: 8,
            itemStyle: { color: '#00bfa5' },
            lineStyle: { width: 3 },
            label: { show: true, position: 'top', formatter: '${c}' }
        }]
    };

    if (!mounted) return null;

    return (
        <Box sx={{ p: 3, bgcolor: 'background.default', minHeight: '100vh' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                <Typography variant="h4" fontWeight="bold" color="primary">Yearly Utilization By Unit Type</Typography>
                
                <Stack direction="row" spacing={4} alignItems="center">
                    <Stack direction="row" spacing={2} alignItems="center">
                        <Typography variant="caption" fontWeight="bold" color="text.secondary">Hours Util %</Typography>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Box sx={{ width: 30, height: 15, bgcolor: '#00bfa5' }} />
                            <Typography variant="caption">65% Above</Typography>
                        </Stack>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Box sx={{ width: 30, height: 15, bgcolor: '#ffb300' }} />
                            <Typography variant="caption">{'>=50% and <65%'}</Typography>
                        </Stack>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Box sx={{ width: 30, height: 15, bgcolor: '#ff5252' }} />
                            <Typography variant="caption">{'< 50%'}</Typography>
                        </Stack>
                    </Stack>

                    <Box sx={{ minWidth: 150 }}>
                        <Typography variant="caption" sx={{ fontWeight: 'bold', mb: 0.5, display: 'block' }}>Select a year</Typography>
                        <FormControl fullWidth size="small">
                            <Select value={year} onChange={(e) => setYear(e.target.value)}>
                                <MenuItem value="2022">2022</MenuItem>
                                <MenuItem value="2021">2021</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </Stack>
            </Stack>

            <TableContainer component={Paper} elevation={0} sx={{ mb: 4, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                <Table size="small" sx={{ minWidth: 1200 }}>
                    <TableHead>
                        <TableRow sx={{ bgcolor: alpha(theme.palette.action.hover, 0.5) }}>
                            <TableCell rowSpan={2} sx={{ fontWeight: 'bold', borderRight: '1px solid', borderColor: 'divider' }}>Unit Type</TableCell>
                            {MONTHS_SHORT.slice(0, 6).map(m => (
                                <TableCell key={m} colSpan={3} align="center" sx={{ fontWeight: 'bold', borderRight: '1px solid', borderColor: 'divider' }}>{m}</TableCell>
                            ))}
                        </TableRow>
                        <TableRow sx={{ bgcolor: alpha(theme.palette.action.hover, 0.3) }}>
                            {MONTHS_SHORT.slice(0, 6).map(m => (
                                <React.Fragment key={`${m}-sub`}>
                                    <TableCell align="right" sx={{ fontSize: '0.7rem' }}>Billed $</TableCell>
                                    <TableCell align="right" sx={{ fontSize: '0.7rem' }}>Hours Util %</TableCell>
                                    <TableCell align="right" sx={{ fontSize: '0.7rem', borderRight: '1px solid', borderColor: 'divider' }}>Avg Hrly Rate</TableCell>
                                </React.Fragment>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {MOCK_UTILIZATION_DATA.map((row, idx) => (
                            <TableRow key={idx} hover>
                                <TableCell sx={{ fontWeight: 'medium', borderRight: '1px solid', borderColor: 'divider' }}>{row.unitType}</TableCell>
                                {MONTHS_SHORT.slice(0, 6).map(m => {
                                    const data = row.months[m];
                                    return (
                                        <React.Fragment key={`${m}-data`}>
                                            <TableCell align="right">{data ? formatter.as_currency(data.billed, true) : '-'}</TableCell>
                                            <TableCell align="right" sx={{ 
                                                bgcolor: data ? getUtilizationColor(data.hoursUtil) : 'transparent',
                                                color: data && data.hoursUtil > 0 ? 'white' : 'inherit',
                                                fontWeight: 'bold'
                                            }}>
                                                {data ? `${data.hoursUtil}%` : '-'}
                                            </TableCell>
                                            <TableCell align="right" sx={{ borderRight: '1px solid', borderColor: 'divider' }}>
                                                {data ? `$${data.avgHourlyRate}` : '-'}
                                            </TableCell>
                                        </React.Fragment>
                                    );
                                })}
                            </TableRow>
                        ))}
                        {/* Total Row */}
                        <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                            <TableCell sx={{ fontWeight: 'bold', borderRight: '1px solid', borderColor: 'divider' }}>Total</TableCell>
                            {MONTHS_SHORT.slice(0, 6).map(m => (
                                <React.Fragment key={`${m}-total`}>
                                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>$638,738</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>64%</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 'bold', borderRight: '1px solid', borderColor: 'divider' }}>$258</TableCell>
                                </React.Fragment>
                            ))}
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>

            <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Paper elevation={0} sx={{ p: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                        <ReactECharts option={utilizationLineOptions} style={{ height: 300 }} />
                    </Paper>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Paper elevation={0} sx={{ p: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                        <ReactECharts option={billedLineOptions} style={{ height: 300 }} />
                    </Paper>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Paper elevation={0} sx={{ p: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                        <ReactECharts option={rateLineOptions} style={{ height: 300 }} />
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}

import React from 'react';
