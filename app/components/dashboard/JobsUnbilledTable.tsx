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
        <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', height: '100%' }}>
            <Table stickyHeader size="small" aria-label="jobs unbilled table">
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', whiteSpace: 'nowrap', bgcolor: 'primary.main', color: 'common.white' }}>Job No</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', whiteSpace: 'nowrap', bgcolor: 'primary.main', color: 'common.white' }}>Job Status</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', bgcolor: 'primary.main', color: 'common.white' }}>Customer</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', whiteSpace: 'nowrap', bgcolor: 'primary.main', color: 'common.white' }}>Job Start</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', whiteSpace: 'nowrap', bgcolor: 'primary.main', color: 'common.white' }}>Job End</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', bgcolor: 'primary.main', color: 'common.white' }}>Salesperson</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', whiteSpace: 'nowrap', bgcolor: 'primary.main', color: 'common.white' }}>Last Inv. Date</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold', whiteSpace: 'nowrap', bgcolor: 'primary.main', color: 'common.white' }}>Total To Be Billed</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold', whiteSpace: 'nowrap', bgcolor: 'primary.main', color: 'common.white' }}>Billed Till Now</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold', whiteSpace: 'nowrap', bgcolor: 'primary.main', color: 'common.white' }}>Rem. to Billed</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((row, index) => (
                        <TableRow 
                            key={`${row.jobNo}-${index}`} 
                            hover
                            sx={{ '&:last-child td, &:last-child th': { border: 0 }, '& td': { fontSize: '0.875rem' } }}
                        >
                            <TableCell>{row.jobNo}</TableCell>
                            <TableCell>{row.jobStatus}</TableCell>
                            <TableCell>{row.customer}</TableCell>
                            <TableCell>{row.jobStart}</TableCell>
                            <TableCell>{row.jobEnd}</TableCell>
                            <TableCell>{row.salesperson}</TableCell>
                            <TableCell>{row.lastInvDate}</TableCell>
                            <TableCell align="right">{formatter.as_currency(row.totalToBeBilled, false)}</TableCell>
                            <TableCell align="right">{formatter.as_currency(row.billedTillNow, false)}</TableCell>
                            <TableCell align="right" sx={{ color: row.remToBilled < 0 ? 'error.main' : 'inherit' }}>
                                {formatter.as_currency(row.remToBilled, false)}
                            </TableCell>
                        </TableRow>
                    ))}
                    <TableRow sx={{ position: 'sticky', bottom: 0, bgcolor: (theme) => theme.palette.mode === 'dark' ? 'grey.900' : 'grey.100', zIndex: 5 }}>
                        <TableCell colSpan={7} sx={{ fontWeight: 'bold' }}>Total</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>{formatter.as_currency(totals.totalToBeBilled, false)}</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>{formatter.as_currency(totals.billedTillNow, false)}</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold', color: totals.remToBilled < 0 ? 'error.main' : 'inherit' }}>
                             {formatter.as_currency(totals.remToBilled, false)}
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    );
}
