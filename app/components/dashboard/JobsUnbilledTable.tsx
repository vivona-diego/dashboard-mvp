'use client';

import { 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow, 
    Paper, 
} from '@mui/material';
import formatter from '@/app/helpers/formatter';

export interface JobsUnbilledData {
    jobNo: string;
    jobStatus: string;
    customer: string;
    jobStart: string;
    jobEnd: string;
    salesperson: string;
    lastInvDate: string;
    totalToBeBilled: number;
    billedTillNow: number;
    remToBilled: number;
}

interface JobsUnbilledTableProps {
    data: JobsUnbilledData[];
}

export default function JobsUnbilledTable({ data }: JobsUnbilledTableProps) {
    // Calculate totals
    const totals = data.reduce((acc, curr) => ({
        totalToBeBilled: acc.totalToBeBilled + curr.totalToBeBilled,
        billedTillNow: acc.billedTillNow + curr.billedTillNow,
        remToBilled: acc.remToBilled + curr.remToBilled,
    }), {
        totalToBeBilled: 0,
        billedTillNow: 0,
        remToBilled: 0,
    });

    return (
        <TableContainer component={Paper} elevation={0} sx={{ height: '100%', borderRadius: 2, boxShadow: '0 1px 3px 0 rgba(0,0,0,0.1)' }}>
            <Table stickyHeader size="small" aria-label="jobs unbilled table">
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ bgcolor: (theme) => theme.palette.mode === 'dark' ? 'grey.800' : 'grey.100', fontWeight: 'bold', fontSize: '0.75rem', color: 'text.secondary' }}>Job No</TableCell>
                        <TableCell sx={{ bgcolor: (theme) => theme.palette.mode === 'dark' ? 'grey.800' : 'grey.100', fontWeight: 'bold', fontSize: '0.75rem', color: 'text.secondary' }}>Job Status</TableCell>
                        <TableCell sx={{ bgcolor: (theme) => theme.palette.mode === 'dark' ? 'grey.800' : 'grey.100', fontWeight: 'bold', fontSize: '0.75rem', color: 'text.secondary' }}>Customer</TableCell>
                        <TableCell sx={{ bgcolor: (theme) => theme.palette.mode === 'dark' ? 'grey.800' : 'grey.100', fontWeight: 'bold', fontSize: '0.75rem', color: 'text.secondary' }}>Job Start</TableCell>
                        <TableCell sx={{ bgcolor: (theme) => theme.palette.mode === 'dark' ? 'grey.800' : 'grey.100', fontWeight: 'bold', fontSize: '0.75rem', color: 'text.secondary' }}>Job End</TableCell>
                        <TableCell sx={{ bgcolor: (theme) => theme.palette.mode === 'dark' ? 'grey.800' : 'grey.100', fontWeight: 'bold', fontSize: '0.75rem', color: 'text.secondary' }}>Salesperson</TableCell>
                        <TableCell sx={{ bgcolor: (theme) => theme.palette.mode === 'dark' ? 'grey.800' : 'grey.100', fontWeight: 'bold', fontSize: '0.75rem', color: 'text.secondary' }}>Last Inv. Date</TableCell>
                        <TableCell align="right" sx={{ bgcolor: (theme) => theme.palette.mode === 'dark' ? 'grey.800' : 'grey.100', fontWeight: 'bold', fontSize: '0.75rem', color: 'text.secondary' }}>Total To Be Billed</TableCell>
                        <TableCell align="right" sx={{ bgcolor: (theme) => theme.palette.mode === 'dark' ? 'grey.800' : 'grey.100', fontWeight: 'bold', fontSize: '0.75rem', color: 'text.secondary' }}>Billed Till Now</TableCell>
                        <TableCell align="right" sx={{ bgcolor: (theme) => theme.palette.mode === 'dark' ? 'grey.800' : 'grey.100', fontWeight: 'bold', fontSize: '0.75rem', color: 'text.secondary' }}>Rem. to Billed</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((row) => (
                        <TableRow key={row.jobNo} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            <TableCell sx={{ fontSize: '0.875rem' }}>{row.jobNo}</TableCell>
                            <TableCell sx={{ fontSize: '0.875rem' }}>{row.jobStatus}</TableCell>
                            <TableCell sx={{ fontSize: '0.875rem' }}>{row.customer}</TableCell>
                            <TableCell sx={{ fontSize: '0.875rem' }}>{row.jobStart}</TableCell>
                            <TableCell sx={{ fontSize: '0.875rem' }}>{row.jobEnd}</TableCell>
                            <TableCell sx={{ fontSize: '0.875rem' }}>{row.salesperson}</TableCell>
                            <TableCell sx={{ fontSize: '0.875rem' }}>{row.lastInvDate}</TableCell>
                            <TableCell align="right" sx={{ fontSize: '0.875rem' }}>{formatter.as_currency(row.totalToBeBilled, false)}</TableCell>
                            <TableCell align="right" sx={{ fontSize: '0.875rem' }}>{formatter.as_currency(row.billedTillNow, false)}</TableCell>
                            {/* Highlight negative values in Rem. to Billed? Image shows parenthesis for negative like (24,552.64) */}
                            <TableCell align="right" sx={{ fontSize: '0.875rem', color: row.remToBilled < 0 ? 'error.main' : 'inherit' }}>
                                {row.remToBilled < 0 ? `(${formatter.as_currency(Math.abs(row.remToBilled), false)})` : formatter.as_currency(row.remToBilled, false)}
                            </TableCell>
                        </TableRow>
                    ))}
                    <TableRow sx={{ position: 'sticky', bottom: 0, bgcolor: (theme) => theme.palette.mode === 'dark' ? 'grey.900' : 'grey.200', zIndex: 5 }}>
                        <TableCell colSpan={7} sx={{ fontWeight: 'bold' }}>Total</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>{formatter.as_currency(totals.totalToBeBilled, false)}</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>{formatter.as_currency(totals.billedTillNow, false)}</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold', color: totals.remToBilled < 0 ? 'error.main' : 'inherit' }}>
                             {totals.remToBilled < 0 ? `(${formatter.as_currency(Math.abs(totals.remToBilled), false)})` : formatter.as_currency(totals.remToBilled, false)}
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    );
}
