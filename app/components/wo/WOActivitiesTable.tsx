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

interface WOActivityRow {
  wo: string;
  unit: string;
  activityCode: string;
  activity: string;
  comments: string;
  billable: string;
  prevMaint: string;
  price: number | null;
  partsAmount: number | null;
  laborAmount: number;
  totalAmount: number;
}

interface WOActivitiesTableProps {
  data: WOActivityRow[];
}

export default function WOActivitiesTable({ data }: WOActivitiesTableProps) {
  const totals = data.reduce((acc, curr) => ({
      parts: acc.parts + (curr.partsAmount || 0),
      labor: acc.labor + (curr.laborAmount || 0),
      total: acc.total + (curr.totalAmount || 0)
  }), { parts: 0, labor: 0, total: 0 });

  return (
    <Box sx={{ width: '100%', bgcolor: 'background.paper', borderRadius: 1, overflow: 'hidden', boxShadow: 1, mt: 3 }}>
      <Box sx={{ 
        bgcolor: '#E0F7FA', // Light cyan header
        py: 0.5, 
        px: 2, 
        display: 'flex',
        justifyContent: 'center',
        borderBottom: '2px solid #B2EBF2'
      }}>
        <Typography variant="body2" sx={{ color: '#006064', fontWeight: 'bold' }}>
          WO Activities
        </Typography>
      </Box>

      <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 0, overflowX: 'auto', maxHeight: 400 }}>
        <Table stickyHeader size="small" sx={{
           whiteSpace: 'nowrap',
           '& .MuiTableCell-root': { py: 1, px: 2, fontSize: '0.8rem', borderBottom: '1px solid #EEEEEE' },
           '& .MuiTableHead-root .MuiTableCell-root': { py: 1, fontWeight: 'bold', bgcolor: '#F5F5F5' }
        }}>
          <TableHead>
            <TableRow>
              <TableCell>WO</TableCell>
              <TableCell>Unit</TableCell>
              <TableCell>Activity Code</TableCell>
              <TableCell>Activity</TableCell>
              <TableCell>Comments</TableCell>
              <TableCell>Billable</TableCell>
              <TableCell>PrevMaint</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="right">Parts Amount</TableCell>
              <TableCell align="right">Labor Amount</TableCell>
              <TableCell align="right">Total WO Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, idx) => (
              <TableRow key={idx} hover sx={{ '&:nth-of-type(even)': { bgcolor: '#FAFAFA' } }}>
                <TableCell>{row.wo}</TableCell>
                <TableCell>{row.unit}</TableCell>
                <TableCell>{row.activityCode}</TableCell>
                <TableCell>{row.activity}</TableCell>
                <TableCell>{row.comments}</TableCell>
                <TableCell>{row.billable}</TableCell>
                <TableCell>{row.prevMaint}</TableCell>
                <TableCell align="right">{row.price ? row.price : ''}</TableCell>
                <TableCell align="right">{row.partsAmount ? row.partsAmount.toLocaleString(undefined, {minimumFractionDigits: 2}) : ''}</TableCell>
                <TableCell align="right">${row.laborAmount.toLocaleString()}</TableCell>
                <TableCell align="right">${row.totalAmount.toLocaleString()}</TableCell>
              </TableRow>
            ))}
            <TableRow sx={{ '& td': { fontWeight: 'bold', bgcolor: '#F0F0F0', borderBottom: 'none' } }}>
              <TableCell colSpan={8}>Total</TableCell>
              <TableCell align="right">{totals.parts.toLocaleString(undefined, {minimumFractionDigits: 2})}</TableCell>
              <TableCell align="right">${totals.labor.toLocaleString()}</TableCell>
              <TableCell align="right">${totals.total.toLocaleString()}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
