'use client';

import { 
    Box, 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow, 
    Paper, 
    IconButton, 
    Collapse, 
    Typography 
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useState } from 'react';
import formatter from '@/app/helpers/formatter';

// Define interfaces for data structure
export interface MonthlyData {
    month: string;
    target: number;
    estRevenue: number;
    actRevenue: number;
    newCustomers: number;
    newCustEstRev: number;
    newCustActRev: number;
}

export interface SalespersonData {
    id: string;
    name: string;
    target: number;
    estRevenue: number;
    actRevenue: number;
    newCustomers: number;
    newCustEstRev: number;
    newCustActRev: number;
    monthlyData: MonthlyData[];
}

interface SalespersonTableProps {
    data: SalespersonData[];
}

function Row({ row }: { row: SalespersonData }) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell component="th" scope="row" sx={{ fontWeight: 500 }}>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                        sx={{ mr: 1 }}
                    >
                        {open ? <KeyboardArrowUpIcon fontSize="small" /> : <KeyboardArrowDownIcon fontSize="small" />}
                    </IconButton>
                    {row.name}
                </TableCell>
                <TableCell align="right">{formatter.as_currency(row.target, false)}</TableCell>
                <TableCell align="right">{formatter.as_currency(row.estRevenue, false)}</TableCell>
                <TableCell align="right">{formatter.as_currency(row.actRevenue, false)}</TableCell>
                <TableCell align="right">{row.newCustomers}</TableCell>
                <TableCell align="right">{formatter.as_currency(row.newCustEstRev, false)}</TableCell>
                <TableCell align="right">{formatter.as_currency(row.newCustActRev, false)}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1, my: 2 }}>
                            <Typography variant="subtitle2" gutterBottom component="div" sx={{ fontWeight: 'bold' }}>
                                Monthly Breakdown - {row.name}
                            </Typography>
                            <Table size="small" aria-label="purchases">
                                <TableHead>
                                    <TableRow sx={{ bgcolor: 'action.hover' }}>
                                        <TableCell sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: 'text.secondary' }}>MONTH</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: 'text.secondary' }}>TARGET</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: 'text.secondary' }}>EST. REVENUE</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: 'text.secondary' }}>ACT. REVENUE</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: 'text.secondary' }}>NEW CUSTOMERS</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: 'text.secondary' }}>NEW CUST EST REV</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: 'text.secondary' }}>NEW CUST ACT REV</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {row.monthlyData.map((historyRow) => (
                                        <TableRow key={historyRow.month}>
                                            <TableCell component="th" scope="row" sx={{ color: 'text.secondary', fontWeight: 500 }}>{historyRow.month}</TableCell>
                                            <TableCell align="right" sx={{ color: 'text.secondary' }}>{formatter.as_currency(historyRow.target, false)}</TableCell>
                                            <TableCell align="right" sx={{ color: 'text.secondary' }}>{formatter.as_currency(historyRow.estRevenue, false)}</TableCell>
                                            <TableCell align="right" sx={{ color: 'text.secondary' }}>{formatter.as_currency(historyRow.actRevenue, false)}</TableCell>
                                            <TableCell align="right" sx={{ color: 'text.secondary' }}>{historyRow.newCustomers}</TableCell>
                                            <TableCell align="right" sx={{ color: 'text.secondary' }}>{formatter.as_currency(historyRow.newCustEstRev, false)}</TableCell>
                                            <TableCell align="right" sx={{ color: 'text.secondary' }}>{formatter.as_currency(historyRow.newCustActRev, false)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
}

export default function SalespersonTable({ data }: SalespersonTableProps) {
    return (
        <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2, boxShadow: '0 1px 3px 0 rgba(0,0,0,0.1)' }}>
            <Table aria-label="collapsible table" size="small">
                <TableHead>
                    <TableRow sx={{ bgcolor: 'action.hover' }}>
                        <TableCell sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: 'text.secondary' }}>SALESPERSON</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: 'text.secondary' }}>SALESPERSON TARGET</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: 'text.secondary' }}>EST. REVENUE</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: 'text.secondary' }}>ACT. REVENUE</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: 'text.secondary' }}>NEW CUSTOMERS</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: 'text.secondary' }}>NEW CUST EST REV</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: 'text.secondary' }}>NEW CUST ACT REV</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((row) => (
                        <Row key={row.id} row={row} />
                    ))}
                    {/* Total Row */}
                     <TableRow sx={{ bgcolor: 'action.selected' }}>
                        <TableCell sx={{ fontWeight: 'bold', fontSize: '0.875rem' }}>Total</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '0.875rem' }}>
                            {formatter.as_currency(data.reduce((acc, curr) => acc + curr.target, 0), false)}
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '0.875rem' }}>
                            {formatter.as_currency(data.reduce((acc, curr) => acc + curr.estRevenue, 0), false)}
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '0.875rem' }}>
                            {formatter.as_currency(data.reduce((acc, curr) => acc + curr.actRevenue, 0), false)}
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '0.875rem' }}>
                            {data.reduce((acc, curr) => acc + curr.newCustomers, 0)}
                        </TableCell>
                         <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                             {formatter.as_currency(data.reduce((acc, curr) => acc + curr.newCustEstRev, 0), false)}
                         </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                            {formatter.as_currency(data.reduce((acc, curr) => acc + curr.newCustActRev, 0), false)}
                        </TableCell>
                     </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    );
}
