'use client';

import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    FormControl,
    Select,
    MenuItem,
    TextField,
    Stack,
    Grid,
    useTheme,
    alpha,
} from '@mui/material';
import { useState } from 'react';
import formatter from '@/app/helpers/formatter';

interface EquipmentData {
    unitType: string;
    revenue: number;
    totalExpenses: number;
    profit: number;
    profitPercent: number;
    labor: number;
    materialsExpenses: number;
    overhead: number;
    unionExpenses: number;
    laborBurden: number;
    unitLaborWC: number;
    laborOverhead: number;
    materialsOverhead: number;
}

const MOCK_EQUIPMENT_DATA: EquipmentData[] = [
    { unitType: '275 Ton AT Class', revenue: 219391, totalExpenses: -132513, profit: 86878, profitPercent: 39.60, labor: 40107, materialsExpenses: 2731, overhead: 89675, unionExpenses: 24284, laborBurden: 59472, unitLaborWC: 1931, laborOverhead: 85688, materialsOverhead: 3987 },
    { unitType: '155 Ton AT Class', revenue: 201063, totalExpenses: -121589, profit: 79474, profitPercent: 39.53, labor: 36764, materialsExpenses: 2764, overhead: 82062, unionExpenses: 22489, laborBurden: 54435, unitLaborWC: 1801, laborOverhead: 78725, materialsOverhead: 3337 },
    { unitType: '275 ton crawler', revenue: 102969, totalExpenses: -31986, profit: 70983, profitPercent: 68.94, labor: 10216, materialsExpenses: 0, overhead: 21770, unionExpenses: 6811, laborBurden: 14960, unitLaborWC: 0, laborOverhead: 21770, materialsOverhead: 0 },
    { unitType: '120 Ton AT Class', revenue: 67262, totalExpenses: -32600, profit: 34661, profitPercent: 51.53, labor: 9839, materialsExpenses: 898, overhead: 21863, unionExpenses: 6824, laborBurden: 14531, unitLaborWC: 508, laborOverhead: 21863, materialsOverhead: 0 },
    { unitType: '50 Ton RT Class', revenue: 116638, totalExpenses: -83243, profit: 33395, profitPercent: 28.63, labor: 23328, materialsExpenses: 2798, overhead: 57117, unionExpenses: 17687, laborBurden: 34564, unitLaborWC: 1473, laborOverhead: 53724, materialsOverhead: 3392 },
    { unitType: '80 Ton RT Class', revenue: 77829, totalExpenses: -48041, profit: 29788, profitPercent: 38.27, labor: 14414, materialsExpenses: 67, overhead: 33560, unionExpenses: 11123, laborBurden: 21384, unitLaborWC: 1053, laborOverhead: 33560, materialsOverhead: 0 },
    { unitType: '330 ton crawler', revenue: 72158, totalExpenses: -53414, profit: 18744, profitPercent: 25.98, labor: 14918, materialsExpenses: 2045, overhead: 36451, unionExpenses: 10472, laborBurden: 22038, unitLaborWC: 878, laborOverhead: 33389, materialsOverhead: 3062 },
    { unitType: '65 ton RT', revenue: 45760, totalExpenses: -27224, profit: 18536, profitPercent: 40.51, labor: 8107, materialsExpenses: 0, overhead: 19118, unionExpenses: 6463, laborBurden: 12016, unitLaborWC: 639, laborOverhead: 19118, materialsOverhead: 0 },
    { unitType: '90 Ton RT', revenue: 49724, totalExpenses: -31439, profit: 18285, profitPercent: 36.77, labor: 9617, materialsExpenses: 36, overhead: 21785, unionExpenses: 7101, laborBurden: 14235, unitLaborWC: 449, laborOverhead: 21785, materialsOverhead: 0 },
    { unitType: '70 ton RT class', revenue: 27525, totalExpenses: -13937, profit: 13588, profitPercent: 49.36, labor: 4244, materialsExpenses: 0, overhead: 9693, unionExpenses: 3101, laborBurden: 6289, unitLaborWC: 303, laborOverhead: 9693, materialsOverhead: 0 },
    { unitType: '30 Ton RT Class', revenue: 19837, totalExpenses: -9047, profit: 10790, profitPercent: 54.39, labor: 2518, materialsExpenses: 271, overhead: 6257, unionExpenses: 1976, laborBurden: 3756, unitLaborWC: 181, laborOverhead: 5913, materialsOverhead: 344 },
    { unitType: '23 Ton BT Class', revenue: 13360, totalExpenses: -6327, profit: 7033, profitPercent: 52.64, labor: 1838, materialsExpenses: 79, overhead: 4409, unionExpenses: 1546, laborBurden: 2730, unitLaborWC: 110, laborOverhead: 4386, materialsOverhead: 24 },
    { unitType: '75 Ton RT', revenue: 51525, totalExpenses: -45644, profit: 5881, profitPercent: 11.41, labor: 13679, materialsExpenses: 0, overhead: 31965, unionExpenses: 10633, laborBurden: 20259, unitLaborWC: 1073, laborOverhead: 31965, materialsOverhead: 0 },
    { unitType: '80 ton TC class', revenue: 13785, totalExpenses: -8464, profit: 5321, profitPercent: 38.60, labor: 2065, materialsExpenses: 871, overhead: 5528, unionExpenses: 1605, laborBurden: 3055, unitLaborWC: 99, laborOverhead: 4758, materialsOverhead: 770 },
    { unitType: 'MAN BASKET', revenue: 4640, totalExpenses: 0, profit: 4640, profitPercent: 100.00, labor: 0, materialsExpenses: 0, overhead: 0, unionExpenses: 0, laborBurden: 0, unitLaborWC: 0, laborOverhead: 0, materialsOverhead: 0 },
    { unitType: '26 Ton Boom Truck', revenue: 25359, totalExpenses: -21568, profit: 3791, profitPercent: 14.95, labor: 4516, materialsExpenses: 6712, overhead: 10340, unionExpenses: 3186, laborBurden: 6723, unitLaborWC: 272, laborOverhead: 10181, materialsOverhead: 159 },
    { unitType: '45 Ton RT Class', revenue: 4900, totalExpenses: -1126, profit: 3774, profitPercent: 77.01, labor: 166, materialsExpenses: 236, overhead: 725, unionExpenses: 126, laborBurden: 249, unitLaborWC: 5, laborOverhead: 380, materialsOverhead: 344 },
    { unitType: '15 Ton Carry Deck Class', revenue: 2700, totalExpenses: 0, profit: 2700, profitPercent: 100.00, labor: 0, materialsExpenses: 0, overhead: 0, unionExpenses: 0, laborBurden: 0, unitLaborWC: 0, laborOverhead: 0, materialsOverhead: 0 },
    { unitType: '18 Ton Carry Deck Class', revenue: 1385, totalExpenses: -1220, profit: 165, profitPercent: 11.95, labor: 357, materialsExpenses: 19, overhead: 844, unionExpenses: 282, laborBurden: 535, unitLaborWC: 28, laborOverhead: 844, materialsOverhead: 0 },
    { unitType: '8k telescopic forklift', revenue: 0, totalExpenses: -6744, profit: -6744, profitPercent: 0.00, labor: 225, materialsExpenses: 2458, overhead: 4061, unionExpenses: 229, laborBurden: 329, unitLaborWC: 7, laborOverhead: 564, materialsOverhead: 3497 },
    { unitType: '350 Ton AT Class', revenue: 133914, totalExpenses: -141887, profit: -7973, profitPercent: -5.95, labor: 16113, materialsExpenses: 70291, overhead: 55484, unionExpenses: 11694, laborBurden: 23825, unitLaborWC: 508, laborOverhead: 36027, materialsOverhead: 19457 },
    { unitType: 'Trailer', revenue: 0, totalExpenses: -12845, profit: -12845, profitPercent: 0.00, labor: 529, materialsExpenses: 4496, overhead: 7820, unionExpenses: 453, laborBurden: 788, unitLaborWC: 15, laborOverhead: 1256, materialsOverhead: 6564 },
];

export default function EquipmentRevenuePage() {
    const theme = useTheme();
    const [unitType, setUnitType] = useState('All');
    const [unitCode, setUnitCode] = useState('All');
    const [startDate, setStartDate] = useState('2021-07-01');
    const [endDate, setEndDate] = useState('2021-07-31');

    const totalRow = MOCK_EQUIPMENT_DATA.reduce((acc, curr) => ({
        unitType: 'Total',
        revenue: acc.revenue + curr.revenue,
        totalExpenses: acc.totalExpenses + curr.totalExpenses,
        profit: acc.profit + curr.profit,
        profitPercent: 0, // Calculated after
        labor: acc.labor + curr.labor,
        materialsExpenses: acc.materialsExpenses + curr.materialsExpenses,
        overhead: acc.overhead + curr.overhead,
        unionExpenses: acc.unionExpenses + curr.unionExpenses,
        laborBurden: acc.laborBurden + curr.laborBurden,
        unitLaborWC: acc.unitLaborWC + curr.unitLaborWC,
        laborOverhead: acc.laborOverhead + curr.laborOverhead,
        materialsOverhead: acc.materialsOverhead + curr.materialsOverhead,
    }), {
        unitType: 'Total', revenue: 0, totalExpenses: 0, profit: 0, profitPercent: 0, labor: 0, materialsExpenses: 0, overhead: 0, unionExpenses: 0, laborBurden: 0, unitLaborWC: 0, laborOverhead: 0, materialsOverhead: 0
    });
    totalRow.profitPercent = totalRow.revenue !== 0 ? (totalRow.profit / totalRow.revenue) * 100 : 0;

    const getProfitColor = (percent: number) => {
        if (percent >= 30) return '#00BCD4'; // Cyan
        if (percent >= 10) return '#FBC02D'; // Yellow
        return '#EF5350'; // Red
    };

    return (
        <Box sx={{ p: 4, bgcolor: 'background.default', minHeight: '100vh' }}>
            <Typography variant="h5" fontWeight="bold" sx={{ mb: 3, color: 'text.primary' }}>
                Equipment Revenue Report
            </Typography>

            {/* Filters Row */}
            <Paper elevation={0} sx={{ p: 2, mb: 4, bgcolor: 'background.paper', borderRadius: 2 }}>
                <Grid container spacing={3} alignItems="flex-end">
                    <Grid size={{ xs: 12, md: 3 }}>
                        <Typography variant="caption" sx={{ fontWeight: 'bold', mb: 0.5, display: 'block', color: 'text.secondary' }}>Unit Type</Typography>
                        <FormControl fullWidth size="small">
                            <Select 
                                value={unitType} 
                                onChange={(e) => setUnitType(e.target.value)}
                            >
                                <MenuItem value="All">All</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid size={{ xs: 12, md: 3 }}>
                        <Typography variant="caption" sx={{ fontWeight: 'bold', mb: 0.5, display: 'block', color: 'text.secondary' }}>Unit Code</Typography>
                        <FormControl fullWidth size="small">
                            <Select 
                                value={unitCode} 
                                onChange={(e) => setUnitCode(e.target.value)}
                            >
                                <MenuItem value="All">All</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Stack direction="row" spacing={2} justifyContent="flex-end">
                            <Box>
                                <Typography variant="caption" sx={{ fontWeight: 'bold', mb: 0.5, display: 'block', color: 'text.secondary' }}>Start Date</Typography>
                                <TextField type="date" size="small" value={startDate} onChange={(e) => setStartDate(e.target.value)} sx={{ width: 160 }} />
                            </Box>
                            <Box>
                                <Typography variant="caption" sx={{ fontWeight: 'bold', mb: 0.5, display: 'block', color: 'text.secondary' }}>End Date</Typography>
                                <TextField type="date" size="small" value={endDate} onChange={(e) => setEndDate(e.target.value)} sx={{ width: 160 }} />
                            </Box>
                        </Stack>
                    </Grid>
                </Grid>
            </Paper>

            {/* Legend */}
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 3, gap: 4 }}>
                <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'text.primary' }}>Profit % Legend:</Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                    <Box sx={{ width: 32, height: 16, bgcolor: '#00BCD4', borderRadius: 0.5 }} />
                    <Typography variant="caption" color="text.secondary">30% Above</Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                    <Box sx={{ width: 32, height: 16, bgcolor: '#FBC02D', borderRadius: 0.5 }} />
                    <Typography variant="caption" color="text.secondary">10% - 30%</Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                    <Box sx={{ width: 32, height: 16, bgcolor: '#EF5350', borderRadius: 0.5 }} />
                    <Typography variant="caption" color="text.secondary">10% Below</Typography>
                </Stack>
            </Box>

            {/* Main Table */}
            <TableContainer component={Paper} elevation={0} sx={{ overflow: 'hidden' }}>
                <Table stickyHeader size="small" sx={{ 
                    minWidth: 1200,
                    '& .MuiTableCell-root': { 
                        py: 1.5, 
                        px: 2,
                    } 
                }}>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>Unit Type</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold' }}>Revenue</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold' }}>Expenses</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold' }}>Profit $</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold', width: 90 }}>Profit %</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold' }}>Labor</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold' }}>Materials</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold' }}>Overhead</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold' }}>Union</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold' }}>Burden</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold' }}>Labor WC</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold' }}>L_OH</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold' }}>M_OH</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {MOCK_EQUIPMENT_DATA.map((row, idx) => (
                            <TableRow key={idx} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell sx={{ fontWeight: 500, color: 'text.primary' }}>{row.unitType}</TableCell>
                                <TableCell align="right">{formatter.as_currency(row.revenue, false).replace('.00', '')}</TableCell>
                                <TableCell align="right" sx={{ color: row.totalExpenses < 0 ? 'error.main' : 'inherit' }}>
                                    {row.totalExpenses < 0 ? `(${formatter.as_currency(Math.abs(row.totalExpenses), false).replace('.00', '')})` : formatter.as_currency(row.totalExpenses, false).replace('.00', '')}
                                </TableCell>
                                <TableCell align="right" sx={{ fontWeight: 600 }}>{formatter.as_currency(row.profit, false).replace('.00', '')}</TableCell>
                                <TableCell align="right" sx={{ 
                                    bgcolor: alpha(getProfitColor(row.profitPercent), 0.8), 
                                    color: 'white',
                                    fontWeight: 'bold',
                                    borderRadius: '4px',
                                    m: 1,
                                    display: 'table-cell'
                                }}>
                                    {row.profitPercent.toFixed(2)}%
                                </TableCell>
                                <TableCell align="right" color="text.secondary">{row.labor ? formatter.with_commas(row.labor, 0) : '-'}</TableCell>
                                <TableCell align="right" color="text.secondary">{row.materialsExpenses ? formatter.with_commas(row.materialsExpenses, 0) : '-'}</TableCell>
                                <TableCell align="right" color="text.secondary">{row.overhead ? formatter.with_commas(row.overhead, 0) : '-'}</TableCell>
                                <TableCell align="right" color="text.secondary">{row.unionExpenses ? formatter.with_commas(row.unionExpenses, 0) : '-'}</TableCell>
                                <TableCell align="right" color="text.secondary">{row.laborBurden ? formatter.with_commas(row.laborBurden, 0) : '-'}</TableCell>
                                <TableCell align="right" color="text.secondary">{row.unitLaborWC ? formatter.with_commas(row.unitLaborWC, 0) : '-'}</TableCell>
                                <TableCell align="right" color="text.secondary">{row.laborOverhead ? formatter.with_commas(row.laborOverhead, 0) : '-'}</TableCell>
                                <TableCell align="right" color="text.secondary">{row.materialsOverhead ? formatter.with_commas(row.materialsOverhead, 0) : '-'}</TableCell>
                            </TableRow>
                        ))}
                        {/* Total Row */}
                        <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05), '& td': { fontWeight: 'bold', color: 'text.primary' } }}>
                            <TableCell>TOTAL</TableCell>
                            <TableCell align="right">{formatter.as_currency(totalRow.revenue, false).replace('.00', '')}</TableCell>
                            <TableCell align="right">
                                {totalRow.totalExpenses < 0 ? `(${formatter.as_currency(Math.abs(totalRow.totalExpenses), false).replace('.00', '')})` : formatter.as_currency(totalRow.totalExpenses, false).replace('.00', '')}
                            </TableCell>
                            <TableCell align="right">{formatter.as_currency(totalRow.profit, false).replace('.00', '')}</TableCell>
                            <TableCell align="right" sx={{ bgcolor: getProfitColor(totalRow.profitPercent), color: 'white' }}>{totalRow.profitPercent.toFixed(2)}%</TableCell>
                            <TableCell align="right">{formatter.with_commas(totalRow.labor, 0)}</TableCell>
                            <TableCell align="right">{formatter.with_commas(totalRow.materialsExpenses, 0)}</TableCell>
                            <TableCell align="right">{formatter.with_commas(totalRow.overhead, 0)}</TableCell>
                            <TableCell align="right">{formatter.with_commas(totalRow.unionExpenses, 0)}</TableCell>
                            <TableCell align="right">{formatter.with_commas(totalRow.laborBurden, 0)}</TableCell>
                            <TableCell align="right">{formatter.with_commas(totalRow.unitLaborWC, 0)}</TableCell>
                            <TableCell align="right">{formatter.with_commas(totalRow.laborOverhead, 0)}</TableCell>
                            <TableCell align="right">{formatter.with_commas(totalRow.materialsOverhead, 0)}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}
