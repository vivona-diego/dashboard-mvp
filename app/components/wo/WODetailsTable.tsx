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

interface WODetailRow {
  company: string;
  yard: string;
  wo: string;
  issueDate: string;
  status: string;
  employeeName: string;
  laborAmount: number;
}

interface WODetailsTableProps {
  data: WODetailRow[];
}

export default function WODetailsTable({ data }: WODetailsTableProps) {
  const totalLaborAmount = data.reduce((acc, curr) => acc + curr.laborAmount, 0);

  return (
    <Box sx={{ width: '100%', bgcolor: 'background.paper', borderRadius: 1, overflow: 'hidden', boxShadow: 1 }}>
      <Box sx={{ 
        bgcolor: '#E0F7FA', // Light cyan header
        py: 0.5, 
        px: 2, 
        display: 'flex',
        justifyContent: 'center',
        borderBottom: '2px solid #B2EBF2'
      }}>
        <Typography variant="body2" sx={{ color: '#006064', fontWeight: 'bold' }}>
          WO Details
        </Typography>
      </Box>

      <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 0, overflowX: 'auto', maxHeight: 350 }}>
        <Table stickyHeader size="small" sx={{
           whiteSpace: 'nowrap',
           '& .MuiTableCell-root': { py: 1, px: 2, fontSize: '0.8rem', borderBottom: '1px solid #EEEEEE' },
           '& .MuiTableHead-root .MuiTableCell-root': { py: 1, fontWeight: 'bold', bgcolor: '#F5F5F5' }
        }}>
          <TableHead>
            <TableRow>
              <TableCell>Company</TableCell>
              <TableCell>Yard</TableCell>
              <TableCell>WO</TableCell>
              <TableCell sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                 <Box component="span" sx={{ fontSize: '0.6rem' }}>▲</Box>
                 WO Issue Date
              </TableCell>
              <TableCell>WO Status</TableCell>
              <TableCell>EmployeeName</TableCell>
              <TableCell align="right">Labor Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, idx) => (
              <TableRow key={idx} hover sx={{ '&:nth-of-type(even)': { bgcolor: '#FAFAFA' } }}>
                <TableCell>{row.company}</TableCell>
                <TableCell>{row.yard}</TableCell>
                <TableCell>{row.wo}</TableCell>
                <TableCell>{row.issueDate}</TableCell>
                <TableCell>{row.status}</TableCell>
                <TableCell>{row.employeeName}</TableCell>
                <TableCell align="right">${row.laborAmount.toLocaleString()}</TableCell>
              </TableRow>
            ))}
            <TableRow sx={{ '& td': { fontWeight: 'bold', bgcolor: '#F0F0F0', borderBottom: 'none' } }}>
              <TableCell colSpan={6}>Total</TableCell>
              <TableCell align="right">${totalLaborAmount.toLocaleString()}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
