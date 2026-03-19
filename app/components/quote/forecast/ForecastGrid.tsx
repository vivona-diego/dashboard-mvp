'use client';

import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Box,
    Typography,
    Collapse,
    IconButton
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { useState } from 'react';
import formatter from '@/app/helpers/formatter';

export interface GridData {
    id: string;
    salesperson: string;
    qty: number;
    rate: number;
    measure: string;
    estimated: number;
    directExpense: number;
    grossProfit: number;
    indirectExp: number;
    expense: number;
    netProfit: number;
    margin: number;
    children?: GridData[];
}

interface ForecastGridProps {
    data: GridData[];
}

function Row({ row, level = 0 }: { row: GridData; level?: number }) {
    const [open, setOpen] = useState(true); // Default open as per screenshot
    const hasChildren = row.children && row.children.length > 0;

    return (
        <>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' }, bgcolor: level === 0 ? 'background.default' : 'inherit' }}>
                <TableCell component="th" scope="row" sx={{ pl: 2 + level * 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                         {hasChildren && (
                            <IconButton
                                aria-label="expand row"
                                size="small"
                                onClick={() => setOpen(!open)}
                                sx={{ mr: 1, p: 0 }}
                            >
                                {open ? <KeyboardArrowDownIcon fontSize='small' /> : <KeyboardArrowRightIcon fontSize='small' />}
                            </IconButton>
                        )}
                        {!hasChildren && <Box sx={{ width: 24, mr: 1 }} />}
                        <Typography variant="body2" fontWeight={level === 0 ? 'bold' : 'normal'}>
                             {row.salesperson}
                        </Typography>
                    </Box>
                </TableCell>
                <TableCell align="right">{row.qty > 0 ? row.qty : ''}</TableCell>
                <TableCell align="right">{row.rate > 0 ? row.rate : ''}</TableCell>
                <TableCell align="left">{row.measure}</TableCell>
                <TableCell align="right">{formatter.as_currency(row.estimated, false)}</TableCell>
                <TableCell align="right">{formatter.as_currency(row.directExpense, false)}</TableCell>
                <TableCell align="right" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                    {formatter.as_currency(row.grossProfit, false)}
                </TableCell>
                <TableCell align="right">{formatter.as_currency(row.indirectExp, false)}</TableCell>
                <TableCell align="right">{formatter.as_currency(row.expense, false)}</TableCell>
                <TableCell align="right" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                    {formatter.as_currency(row.netProfit, false)}
                </TableCell>
                <TableCell 
                    align="right" 
                    sx={{ 
                        bgcolor: row.margin < 0 ? '#ffcccc' : '#ccffcc', 
                        color: row.margin < 0 ? 'error.main' : 'success.dark',
                        fontWeight: 'bold'
                    }}
                >
                    {formatter.as_percent(row.margin)}
                </TableCell>
            </TableRow>
            {hasChildren && (
                <TableRow>
                     <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={11}>
                        <Collapse in={open} timeout="auto" unmountOnExit>
                            <Table size="small" aria-label="purchases">
                                <TableBody>
                                    {row.children?.map((child) => (
                                        <Row key={child.id} row={child} level={level + 1} />
                                    ))}
                                </TableBody>
                            </Table>
                        </Collapse>
                    </TableCell>
                </TableRow>
            )}
        </>
    );
}

export default function ForecastGrid({ data }: ForecastGridProps) {
    // Calculate totals
    const totalRow = data.reduce((acc, curr) => ({
        id: 'total',
        salesperson: 'Total',
        qty: acc.qty + curr.qty,
        rate: acc.rate + curr.rate, // Logical? Maybe not for rate, but let's sum it for now or keep generic
        measure: 'CASE',
        estimated: acc.estimated + curr.estimated,
        directExpense: acc.directExpense + curr.directExpense,
        grossProfit: acc.grossProfit + curr.grossProfit,
        indirectExp: acc.indirectExp + curr.indirectExp,
        expense: acc.expense + curr.expense,
        netProfit: acc.netProfit + curr.netProfit,
        margin: 0, // Recalculate below
    }), {
        id: 'total',
        salesperson: 'Total',
        qty: 0, rate: 0, measure: '', estimated: 0, directExpense: 0, grossProfit: 0,
        indirectExp: 0, expense: 0, netProfit: 0, margin: 0
    });

    totalRow.margin = totalRow.estimated ? (totalRow.netProfit / totalRow.estimated) * 100 : 0;


  return (
    <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
      <Table aria-label="collapsible table" size="small">
        <TableHead>
          <TableRow> 
            <TableCell sx={{ fontWeight: 'bold', fontSize: '0.75rem', bgcolor: 'primary.main', color: 'common.white' }}>Salesperson</TableCell>
            <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '0.75rem', bgcolor: 'primary.main', color: 'common.white' }}>Qty</TableCell>
            <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '0.75rem', bgcolor: 'primary.main', color: 'common.white' }}>Rate $</TableCell>
            <TableCell align="left" sx={{ fontWeight: 'bold', fontSize: '0.75rem', bgcolor: 'primary.main', color: 'common.white' }}>Measure</TableCell>
            <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '0.75rem', bgcolor: 'primary.main', color: 'common.white' }}>Estimated $</TableCell>
            <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '0.75rem', bgcolor: 'primary.main', color: 'common.white' }}>Direct Expense $</TableCell>
            <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '0.75rem', bgcolor: 'primary.main', color: 'common.white' }}>Gross Profit $</TableCell>
            <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '0.75rem', bgcolor: 'primary.main', color: 'common.white' }}>Indirect Exp $</TableCell>
            <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '0.75rem', bgcolor: 'primary.main', color: 'common.white' }}>Expense $</TableCell>
            <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '0.75rem', bgcolor: 'primary.main', color: 'common.white' }}>Net Profit $</TableCell>
            <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '0.75rem', bgcolor: 'primary.main', color: 'common.white' }}>Margin %</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <Row key={row.id} row={row} />
          ))}
          {/* Total Row */}
           <TableRow sx={{ bgcolor: 'action.hover' }}>
                <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>Total</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>{totalRow.qty}</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>{totalRow.rate}</TableCell>
                <TableCell align="left" sx={{ fontWeight: 'bold' }}>{totalRow.measure}</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>{formatter.as_currency(totalRow.estimated, false)}</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>{formatter.as_currency(totalRow.directExpense, false)}</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>{formatter.as_currency(totalRow.grossProfit, false)}</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>{formatter.as_currency(totalRow.indirectExp, false)}</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>{formatter.as_currency(totalRow.expense, false)}</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>{formatter.as_currency(totalRow.netProfit, false)}</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold', bgcolor: '#00cbb5', color: 'white' }}>
                    {formatter.as_percent(totalRow.margin)}
                </TableCell>
           </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}
