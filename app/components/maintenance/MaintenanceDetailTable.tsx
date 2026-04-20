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

interface DetailTableData {
  unitType: string;
  unitCode: string;
  cnt: number;
  activity: string;
  pastDue: number;
  pastDueDays: number | null;
  pastDueHours: number | null;
  dueLower: number | null;
  currentLower: number | null;
  dueUpper: number | null;
  currentUpper: number | null;
  comingDueDays: number | null;
  comingDueHours: number | null;
}

interface MaintenanceDetailTableProps {
  data: DetailTableData[];
}

export default function MaintenanceDetailTable({ data }: MaintenanceDetailTableProps) {
  const totals = data.reduce((acc, row) => {
      acc.cnt += row.cnt;
      acc.pastDue += row.pastDue;
      return acc;
  }, { cnt: 0, pastDue: 0 });
  return (
    <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
      <Box sx={{ 
        bgcolor: '#B0BEC5', 
        py: 0.5, 
        px: 2, 
        display: 'flex',
        justifyContent: 'center'
      }}>
        <Typography variant="body2" sx={{ color: '#37474F', fontWeight: 'bold' }}>
          Maintenance Due
        </Typography>
      </Box>

      <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 0, overflowX: 'auto', maxHeight: 'calc(100vh - 250px)' }}>
        <Table stickyHeader size="small" sx={{
           whiteSpace: 'nowrap',
           '& .MuiTableCell-root': { py: 0.8, px: 2, fontSize: '0.75rem', borderBottom: '1px solid #EEEEEE' },
           '& .MuiTableHead-root .MuiTableCell-root': { py: 1, fontWeight: 'bold' }
        }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: 'text.secondary' }}>Unit Type</TableCell>
              <TableCell sx={{ color: 'text.secondary' }}>Unit Code</TableCell>
              <TableCell sx={{ color: 'text.secondary' }}>Cnt</TableCell>
              <TableCell sx={{ color: 'text.secondary' }}>Activity</TableCell>
              <TableCell align="right" sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5, borderBottom: 'none' }}>
                 Past Due
                 <Box component="span" sx={{ fontSize: '0.6rem' }}>▼</Box>
              </TableCell>
              <TableCell align="right" sx={{ color: 'text.secondary' }}>Past Due Days</TableCell>
              <TableCell align="right" sx={{ color: 'text.secondary' }}>Past Due Hours</TableCell>
              <TableCell align="right" sx={{ color: 'text.secondary' }}>Due Lower</TableCell>
              <TableCell align="right" sx={{ color: 'text.secondary' }}>Current<br/>Lower</TableCell>
              <TableCell align="right" sx={{ color: 'text.secondary' }}>Due Upper</TableCell>
              <TableCell align="right" sx={{ color: 'text.secondary' }}>Current<br/>Upper</TableCell>
              <TableCell align="right" sx={{ color: 'text.secondary' }}>Coming Due<br/>Days</TableCell>
              <TableCell align="right" sx={{ color: 'text.secondary' }}>Coming Due<br/>Hours</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, idx) => (
              <TableRow key={idx} hover sx={{ '&:nth-of-type(even)': { bgcolor: '#F5F5F5' } }}>
                <TableCell>{row.unitType}</TableCell>
                <TableCell>{row.unitCode}</TableCell>
                <TableCell align="right">{row.cnt}</TableCell>
                <TableCell>{row.activity}</TableCell>
                <TableCell align="right">{row.pastDue}</TableCell>
                <TableCell align="right">{row.pastDueDays}</TableCell>
                <TableCell align="right">{row.pastDueHours}</TableCell>
                <TableCell align="right">{row.dueLower}</TableCell>
                <TableCell align="right">{row.currentLower}</TableCell>
                <TableCell align="right">{row.dueUpper === null ? '' : row.dueUpper.toFixed(2)}</TableCell>
                <TableCell align="right">{row.currentUpper}</TableCell>
                <TableCell align="right">{row.comingDueDays}</TableCell>
                <TableCell align="right">{row.comingDueHours}</TableCell>
              </TableRow>
            ))}
            <TableRow sx={{ '& td': { fontWeight: 'bold' } }}>
              <TableCell colSpan={2}>Total</TableCell>
              <TableCell align="right">{totals.cnt}</TableCell>
              <TableCell></TableCell>
              <TableCell align="right">{totals.pastDue}</TableCell>
              <TableCell align="right">85</TableCell>
              <TableCell align="right">139.25</TableCell>
              <TableCell align="right"></TableCell>
              <TableCell align="right"></TableCell>
              <TableCell align="right"></TableCell>
              <TableCell align="right"></TableCell>
              <TableCell align="right">140</TableCell>
              <TableCell align="right">190</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
