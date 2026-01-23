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

export interface CustomerRevenueData {
    customerName: string;
    estRevenue: number;
    highConfQuote: number;
    totalEst: number;
    actRevenue: number;
}

interface CustomerRevenueTableProps {
    data: CustomerRevenueData[];
}

export default function CustomerRevenueTable({ data }: CustomerRevenueTableProps) {
    // Calculate totals
    const totals = data.reduce((acc, curr) => ({
        estRevenue: acc.estRevenue + curr.estRevenue,
        highConfQuote: acc.highConfQuote + curr.highConfQuote,
        totalEst: acc.totalEst + curr.totalEst,
        actRevenue: acc.actRevenue + curr.actRevenue
    }), {
        estRevenue: 0,
        highConfQuote: 0,
        totalEst: 0,
        actRevenue: 0
    });

    return (
        <Box sx={{ width: '100%' }}>
            <Typography variant="h6" gutterBottom component="div" sx={{ fontSize: '1rem', fontWeight: 'bold', mb: 2, textAlign: 'center' }}>
                Revenue By Customers
            </Typography>
            <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
                <Table size="small" aria-label="customer revenue table">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold', bgcolor: 'primary.main', color: 'common.white' }}>Customer</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold', bgcolor: 'primary.main', color: 'common.white' }}>Est. Revenue</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold', bgcolor: 'primary.main', color: 'common.white' }}>High Conf. Quote</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold', bgcolor: 'primary.main', color: 'common.white' }}>Total Est.</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold', bgcolor: 'primary.main', color: 'common.white' }}>Act. Revenue</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((row, index) => (
                            <TableRow key={`${row.customerName}-${index}`} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell component="th" scope="row" sx={{ fontWeight: 500 }}>{row.customerName}</TableCell>
                                <TableCell align="right">{formatter.as_currency(row.estRevenue, false)}</TableCell>
                                <TableCell align="right">{row.highConfQuote ? formatter.as_currency(row.highConfQuote, false) : ''}</TableCell>
                                <TableCell align="right">{formatter.as_currency(row.totalEst, false)}</TableCell>
                                <TableCell align="right">{formatter.as_currency(row.actRevenue, false)}</TableCell>
                            </TableRow>
                        ))}
                         <TableRow sx={{ bgcolor: 'action.selected' }}>
                            <TableCell sx={{ fontWeight: 'bold' }}>Total</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold' }}>{formatter.as_currency(totals.estRevenue, false)}</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold' }}>{formatter.as_currency(totals.highConfQuote, false)}</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold' }}>{formatter.as_currency(totals.totalEst, false)}</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold' }}>{formatter.as_currency(totals.actRevenue, false)}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}
