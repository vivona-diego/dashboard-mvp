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
} from '@mui/material';

export interface WOSummaryRow {
  month: string;
  totalWO: number;
  totalWOPY: number;
  totalAmount: number;
  totalAmountPY: number;
  closed: number;
  closedPY: number;
  open: number;
  openPY: number;
}

interface WOSummaryTableProps {
  data: WOSummaryRow[];
}

export default function WOSummaryTable({ data }: WOSummaryTableProps) {
  const totals = data.reduce((acc, row) => ({
    totalWO: acc.totalWO + row.totalWO,
    totalWOPY: acc.totalWOPY + row.totalWOPY,
    totalAmount: acc.totalAmount + row.totalAmount,
    totalAmountPY: acc.totalAmountPY + row.totalAmountPY,
    closed: acc.closed + row.closed,
    closedPY: acc.closedPY + row.closedPY,
    open: acc.open + row.open,
    openPY: acc.openPY + row.openPY
  }), { totalWO: 0, totalWOPY: 0, totalAmount: 0, totalAmountPY: 0, closed: 0, closedPY: 0, open: 0, openPY: 0 });
  return (
    <Box sx={{ width: '100%', bgcolor: 'background.paper', mt: 1 }}>
      <Box sx={{ 
        bgcolor: '#B2EBF2', 
        py: 0.5, 
        px: 2, 
        display: 'flex',
        justifyContent: 'center',
        borderBottom: '2px solid #00BCD4'
      }}>
        <Typography variant="caption" sx={{ color: '#006064', fontWeight: 'bold' }}>
          WO Volume Trend Current Year Vs. PY
        </Typography>
      </Box>

      <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 0 }}>
        <Table size="small" sx={{
           whiteSpace: 'nowrap',
           '& .MuiTableCell-root': { py: 0.5, px: 1.5, fontSize: '0.7rem', borderBottom: '1px solid #EEEEEE' },
           '& .MuiTableHead-root .MuiTableCell-root': { py: 0.5, fontWeight: 'bold', bgcolor: '#F5F5F5' }
        }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                 Month
                 <Box component="span" sx={{ fontSize: '0.6rem' }}>▲</Box>
              </TableCell>
              <TableCell align="right">Total WO</TableCell>
              <TableCell align="right">Total WO - PY</TableCell>
              <TableCell align="right">Total WO Amount</TableCell>
              <TableCell align="right">Total WO Amount - PY</TableCell>
              <TableCell align="right">Closed WO</TableCell>
              <TableCell align="right">Closed WO PY</TableCell>
              <TableCell align="right">Open WO</TableCell>
              <TableCell align="right">Open WO PY</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, idx) => (
              <TableRow key={idx} hover>
                <TableCell>{row.month}</TableCell>
                <TableCell align="right">{row.totalWO}</TableCell>
                <TableCell align="right">{row.totalWOPY}</TableCell>
                <TableCell align="right">${row.totalAmount.toLocaleString()}</TableCell>
                <TableCell align="right">${row.totalAmountPY.toLocaleString()}</TableCell>
                <TableCell align="right">{row.closed}</TableCell>
                <TableCell align="right">{row.closedPY}</TableCell>
                <TableCell align="right">{row.open}</TableCell>
                <TableCell align="right">{row.openPY}</TableCell>
              </TableRow>
            ))}
            <TableRow sx={{ '& td': { fontWeight: 'bold', bgcolor: '#F0F0F0' } }}>
              <TableCell>Total</TableCell>
              <TableCell align="right">{totals.totalWO}</TableCell>
              <TableCell align="right">{totals.totalWOPY}</TableCell>
              <TableCell align="right">${totals.totalAmount.toLocaleString()}</TableCell>
              <TableCell align="right">${totals.totalAmountPY.toLocaleString()}</TableCell>
              <TableCell align="right">{totals.closed}</TableCell>
              <TableCell align="right">{totals.closedPY}</TableCell>
              <TableCell align="right">{totals.open}</TableCell>
              <TableCell align="right">{totals.openPY}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
