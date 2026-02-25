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

export interface DetailGridData {
    id: string;
    quoteNo: string;
    status: string;
    salesperson: string;
    customer: string;
    date: string;
    line: number;
    billingDesc: string;
    measure: string;
    qty: number;
    rate: number;
    estimated: number;
    totalHrlyCost: number;
    expense: number;
    netProfit: number;
    margin: number;
}

interface DetailGridProps {
    data: DetailGridData[];
}

export default function DetailGrid({ data }: DetailGridProps) {
    // Calculate totals
    const totalRow = data.reduce((acc, curr) => ({
        estimated: acc.estimated + curr.estimated,
        totalHrlyCost: acc.totalHrlyCost + curr.totalHrlyCost,
        expense: acc.expense + curr.expense,
        netProfit: acc.netProfit + curr.netProfit,
        qty: acc.qty + curr.qty,
        rate: acc.rate + curr.rate
    }), { estimated: 0, totalHrlyCost: 0, expense: 0, netProfit: 0, qty: 0, rate: 0 });

    const totalMargin = totalRow.estimated ? (totalRow.netProfit / totalRow.estimated) * 100 : 0;

  return (
    <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
      <Table aria-label="detail table" size="small" stickyHeader>
        <TableHead>
          <TableRow> 
            <TableCell sx={{ fontWeight: 'bold', fontSize: '0.75rem', bgcolor: 'primary.main', color: 'common.white', whiteSpace: 'nowrap' }}>Quote No</TableCell>
            <TableCell sx={{ fontWeight: 'bold', fontSize: '0.75rem', bgcolor: 'primary.main', color: 'common.white' }}>Status</TableCell>
            <TableCell sx={{ fontWeight: 'bold', fontSize: '0.75rem', bgcolor: 'primary.main', color: 'common.white' }}>Salesperson</TableCell>
            <TableCell sx={{ fontWeight: 'bold', fontSize: '0.75rem', bgcolor: 'primary.main', color: 'common.white' }}>Customer</TableCell>
            <TableCell sx={{ fontWeight: 'bold', fontSize: '0.75rem', bgcolor: 'primary.main', color: 'common.white' }}>Date</TableCell>
            <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '0.75rem', bgcolor: 'primary.main', color: 'common.white' }}>Line</TableCell>
            <TableCell sx={{ fontWeight: 'bold', fontSize: '0.75rem', bgcolor: 'primary.main', color: 'common.white' }}>Billing Desc.</TableCell>
            <TableCell sx={{ fontWeight: 'bold', fontSize: '0.75rem', bgcolor: 'primary.main', color: 'common.white' }}>Measure</TableCell>
            <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '0.75rem', bgcolor: 'primary.main', color: 'common.white' }}>Qty</TableCell>
            <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '0.75rem', bgcolor: 'primary.main', color: 'common.white' }}>Rate</TableCell>
            <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '0.75rem', bgcolor: 'primary.main', color: 'common.white' }}>Estimated $</TableCell>
            <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '0.75rem', bgcolor: 'primary.main', color: 'common.white' }}>TotalHrlyCost</TableCell>
            <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '0.75rem', bgcolor: 'primary.main', color: 'common.white' }}>Expense $</TableCell>
            <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '0.75rem', bgcolor: 'primary.main', color: 'common.white' }}>Net Profit $</TableCell>
            <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '0.75rem', bgcolor: 'primary.main', color: 'common.white' }}>Margin %</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { bgcolor: 'action.hover' } }}>
               <TableCell sx={{ fontSize: '0.75rem' }}>{row.quoteNo}</TableCell>
               <TableCell sx={{ fontSize: '0.75rem' }}>{row.status}</TableCell>
               <TableCell sx={{ fontSize: '0.75rem' }}>{row.salesperson}</TableCell>
               <TableCell sx={{ fontSize: '0.75rem' }}>{row.customer}</TableCell>
               <TableCell sx={{ fontSize: '0.75rem' }}>{row.date}</TableCell>
               <TableCell align="right" sx={{ fontSize: '0.75rem' }}>{row.line}</TableCell>
               <TableCell sx={{ fontSize: '0.75rem' }}>{row.billingDesc}</TableCell>
               <TableCell sx={{ fontSize: '0.75rem' }}>{row.measure}</TableCell>
               <TableCell align="right" sx={{ fontSize: '0.75rem' }}>{row.qty}</TableCell>
               <TableCell align="right" sx={{ fontSize: '0.75rem' }}>{formatter.as_currency(row.rate, false)}</TableCell>
               <TableCell align="right" sx={{ fontSize: '0.75rem' }}>{formatter.as_currency(row.estimated, false)}</TableCell>
               <TableCell align="right" sx={{ fontSize: '0.75rem' }}>{formatter.as_currency(row.totalHrlyCost, false)}</TableCell>
               <TableCell align="right" sx={{ fontSize: '0.75rem' }}>{formatter.as_currency(row.expense, false)}</TableCell>
               <TableCell align="right" sx={{ fontSize: '0.75rem', color: 'primary.main', fontWeight: 'bold' }}>{formatter.as_currency(row.netProfit, false)}</TableCell>
               <TableCell 
                    align="right" 
                    sx={{ 
                        fontSize: '0.75rem',
                        color: row.margin < 0 ? 'error.main' : 'primary.main',
                        fontWeight: 'bold'
                    }}
                >
                    {formatter.as_percent(row.margin)}
                </TableCell>
            </TableRow>
          ))}
          {/* Total Row */}
           <TableRow sx={{ bgcolor: 'background.default' }}>
                <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}>Total</TableCell>
                <TableCell colSpan={7} />
                <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}>{totalRow.qty}</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}>{formatter.as_currency(totalRow.rate, false)}</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}>{formatter.as_currency(totalRow.estimated, false)}</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}>{formatter.as_currency(totalRow.totalHrlyCost, false)}</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}>{formatter.as_currency(totalRow.expense, false)}</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}>{formatter.as_currency(totalRow.netProfit, false)}</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}>
                    {formatter.as_percent(totalMargin)}
                </TableCell>
           </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}
