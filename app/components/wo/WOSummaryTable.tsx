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

const MOCK_DATA = [
  { month: 'Jan', totalWO: 23, totalWOPY: 26, totalAmount: 22301, totalAmountPY: 36372, closed: 13, closedPY: 26, open: 10, openPY: 10 },
];

export default function WOSummaryTable() {
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
            {MOCK_DATA.map((row, idx) => (
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
              <TableCell align="right">23</TableCell>
              <TableCell align="right">26</TableCell>
              <TableCell align="right">$22,301</TableCell>
              <TableCell align="right">$36,372</TableCell>
              <TableCell align="right">13</TableCell>
              <TableCell align="right">26</TableCell>
              <TableCell align="right">10</TableCell>
              <TableCell align="right">10</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
