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
  Typography
} from '@mui/material';
import formatter from '@/app/helpers/formatter';

export interface ForecastDetailRow {
  month: string;
  year: number;
  customer: string;
  jobCode: string;
  startDate: string;
  endDate: string;
  jobSite: string;
  salesperson: string;
  estRevenue: number;
  actRevenue: number;
  lastModifiedBy: string;
  modifiedDate: string;
}

interface ForecastDetailsTableProps {
  data: ForecastDetailRow[];
}

export default function ForecastDetailsTable({ data }: ForecastDetailsTableProps) {
  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', height: '100%' }}>
        <Table stickyHeader size="small" aria-label="forecast details table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', whiteSpace: 'nowrap', bgcolor: 'primary.main', color: 'common.white' }}>Month</TableCell>
              <TableCell sx={{ fontWeight: 'bold', whiteSpace: 'nowrap', bgcolor: 'primary.main', color: 'common.white' }}>Year</TableCell>
              <TableCell sx={{ fontWeight: 'bold', bgcolor: 'primary.main', color: 'common.white' }}>Customer</TableCell>
              <TableCell sx={{ fontWeight: 'bold', whiteSpace: 'nowrap', bgcolor: 'primary.main', color: 'common.white' }}>JobCode</TableCell>
              <TableCell sx={{ fontWeight: 'bold', whiteSpace: 'nowrap', bgcolor: 'primary.main', color: 'common.white' }}>Start Dt</TableCell>
              <TableCell sx={{ fontWeight: 'bold', whiteSpace: 'nowrap', bgcolor: 'primary.main', color: 'common.white' }}>End Dt</TableCell>
              <TableCell sx={{ fontWeight: 'bold', bgcolor: 'primary.main', color: 'common.white' }}>JobSite</TableCell>
              <TableCell sx={{ fontWeight: 'bold', bgcolor: 'primary.main', color: 'common.white' }}>Salesperson</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold', whiteSpace: 'nowrap', bgcolor: 'primary.main', color: 'common.white' }}>Est. Revenue</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold', whiteSpace: 'nowrap', bgcolor: 'primary.main', color: 'common.white' }}>Act. Revenue</TableCell>
              <TableCell sx={{ fontWeight: 'bold', bgcolor: 'primary.main', color: 'common.white' }}>LastModifiedBy</TableCell>
              <TableCell sx={{ fontWeight: 'bold', whiteSpace: 'nowrap', bgcolor: 'primary.main', color: 'common.white' }}>ModifiedDate</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, index) => (
              <TableRow 
                key={`${row.jobCode}-${index}`}
                hover 
                sx={{ '&:last-child td, &:last-child th': { border: 0 }, '& td': { fontSize: '0.875rem' } }}
              >
                <TableCell>{row.month}</TableCell>
                <TableCell>{row.year}</TableCell>
                <TableCell>{row.customer}</TableCell>
                <TableCell>{row.jobCode}</TableCell>
                <TableCell>{row.startDate}</TableCell>
                <TableCell>{row.endDate}</TableCell>
                <TableCell>{row.jobSite}</TableCell>
                <TableCell>{row.salesperson}</TableCell>
                <TableCell align="right">{formatter.as_currency(row.estRevenue, false)}</TableCell>
                <TableCell align="right">{formatter.as_currency(row.actRevenue, false)}</TableCell>
                <TableCell>{row.lastModifiedBy}</TableCell>
                <TableCell>{row.modifiedDate}</TableCell>
              </TableRow>
            ))}
            {data.length === 0 && (
                <TableRow>
                    <TableCell colSpan={12} align="center" sx={{ py: 3 }}>
                        <Typography variant="body2" color="text.secondary">
                            No data available
                        </Typography>
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
