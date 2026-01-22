'use client';

import { 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow, 
    Paper, 
    Typography,
    Box
} from '@mui/material';
import formatter from '@/app/helpers/formatter';

export interface MonthlyDetailedData {
    month: string;
    revenueGoal: number;
    estRevenue: number;
    highConfQuote: number;
    totalEst: number;
    actRevenue: number;
    cumulativeTotEst: number;
    cumulativeAct: number;
}

interface DetailedMonthlyTableProps {
    data: MonthlyDetailedData[];
}

export default function DetailedMonthlyTable({ data }: DetailedMonthlyTableProps) {
    // Calculate totals
    const totals = data.reduce((acc, curr) => ({
        revenueGoal: acc.revenueGoal + curr.revenueGoal,
        estRevenue: acc.estRevenue + curr.estRevenue,
        highConfQuote: acc.highConfQuote + curr.highConfQuote,
        totalEst: acc.totalEst + curr.totalEst,
        actRevenue: acc.actRevenue + curr.actRevenue,
        // Cumulative totals for the footer might not make sense to sum up, 
        // usually it shows the final value or is left empty. 
        // Based on image, the Total row has values for Cumulative cols.
        // It seems they are just summing the daily values? No, cumulative usually means running total.
        // If it's a "Total" row for the year, "Cumulative Tot Est" at the end should be the same as "Total Est" for the year?
        // In the image: 
        // Total Est (Total Row): $7,872,145
        // Cumulative Tot Est (Total Row): $7,872,145
        // So yes, the final cumulative value essentially. 
        // BUT, usually a Total row sums the columns. 
        // If I sum the "Cumulative" column, it doesn't make sense.
        // The image shows the Total row has the same value as the final cumulative month.
        // Let's just use the last month's cumulative value for the total row.
        cumulativeTotEst: curr.cumulativeTotEst, 
        cumulativeAct: curr.cumulativeAct
    }), {
        revenueGoal: 0,
        estRevenue: 0,
        highConfQuote: 0,
        totalEst: 0,
        actRevenue: 0,
        cumulativeTotEst: 0,
        cumulativeAct: 0
    });

    return (
        <Box sx={{ width: '100%' }}>
            <Typography variant="h6" gutterBottom component="div" sx={{ fontSize: '1rem', fontWeight: 'bold', mb: 2 }}>
                Revenue Goal, Est. Revenue and Act. Revenue by Date (Detailed)
            </Typography>
            <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2, boxShadow: '0 1px 3px 0 rgba(0,0,0,0.1)' }}>
                <Table size="small" aria-label="detailed monthly table">
                    <TableHead>
                        <TableRow sx={{ bgcolor: 'action.hover' }}>
                            <TableCell sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: 'text.secondary' }}>Month</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: 'text.secondary' }}>Revenue Goal</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: 'text.secondary' }}>Est. Revenue</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: 'text.secondary' }}>High Conf. Quote</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: 'text.secondary' }}>Total Est.</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: 'text.secondary' }}>Act. Revenue</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: 'text.secondary' }}>Cumulative Tot Est</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: 'text.secondary' }}>Cumulative Act</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((row) => (
                            <TableRow key={row.month} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell component="th" scope="row" sx={{ fontWeight: 500 }}>{row.month}</TableCell>
                                <TableCell align="right">{formatter.as_currency(row.revenueGoal, false)}</TableCell>
                                <TableCell align="right">{formatter.as_currency(row.estRevenue, false)}</TableCell>
                                <TableCell align="right">{row.highConfQuote ? formatter.as_currency(row.highConfQuote, false) : '-'}</TableCell>
                                <TableCell align="right">{formatter.as_currency(row.totalEst, false)}</TableCell>
                                <TableCell align="right">{formatter.as_currency(row.actRevenue, false)}</TableCell>
                                <TableCell align="right">{formatter.as_currency(row.cumulativeTotEst, false)}</TableCell>
                                <TableCell align="right">{formatter.as_currency(row.cumulativeAct, false)}</TableCell>
                            </TableRow>
                        ))}
                        <TableRow sx={{ bgcolor: 'action.selected' }}>
                            <TableCell sx={{ fontWeight: 'bold' }}>Total</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold' }}>{formatter.as_currency(totals.revenueGoal, false)}</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold' }}>{formatter.as_currency(totals.estRevenue, false)}</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold' }}>{formatter.as_currency(totals.highConfQuote, false)}</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold' }}>{formatter.as_currency(totals.totalEst, false)}</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold' }}>{formatter.as_currency(totals.actRevenue, false)}</TableCell>
                            {/* For cumulative totals, showing the last value makes the most sense as "Year End Total" */}
                            <TableCell align="right" sx={{ fontWeight: 'bold' }}>{formatter.as_currency(totals.cumulativeTotEst, false)}</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold' }}>{formatter.as_currency(totals.cumulativeAct, false)}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}
