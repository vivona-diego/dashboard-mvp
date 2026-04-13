'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  useTheme,
  alpha,
} from '@mui/material';
import formatter from '@/app/helpers/formatter';

interface DownUnitRow {
  unitCode: string;
  startDt: string;
  endDt: string;
  daysDown: number;
  downHours: number;
  reason: string; // "Down" based on screenshot
  comments: string;
}

interface DownUnitTableProps {
  data: DownUnitRow[];
}

export default function DownUnitTable({ data }: DownUnitTableProps) {
  const theme = useTheme();

  const totals = data.reduce(
    (acc, curr) => ({
      daysDown: acc.daysDown + curr.daysDown,
      downHours: acc.downHours + curr.downHours,
    }),
    { daysDown: 0, downHours: 0 },
  );

  return (
    <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 1.5, overflow: 'hidden' }}>
      <Table
        stickyHeader
        size="small"
        sx={{
          minWidth: 800,
          '& .MuiTableCell-root': {
            py: 1.2,
            px: 2,
            borderBottom: '1px solid',
            borderColor: 'divider',
            fontSize: '0.8rem',
          },
        }}
      >
        <TableHead>
          <TableRow>
            <TableCell
              sx={{ fontWeight: 'bold', color: theme.palette.text.primary, borderBottom: `2px solid #00BCD4` }}
            >
              Unit Code
            </TableCell>
            <TableCell
              sx={{ fontWeight: 'bold', color: theme.palette.text.primary, borderBottom: `2px solid #00BCD4` }}
            >
              Start Dt
            </TableCell>
            <TableCell
              sx={{ fontWeight: 'bold', color: theme.palette.text.primary, borderBottom: `2px solid #00BCD4` }}
            >
              End Dt
            </TableCell>
            <TableCell
              align="right"
              sx={{ fontWeight: 'bold', color: theme.palette.text.primary, borderBottom: `2px solid #00BCD4` }}
            >
              Days Down
            </TableCell>
            <TableCell
              align="right"
              sx={{ fontWeight: 'bold', color: theme.palette.text.primary, borderBottom: `2px solid #00BCD4` }}
            >
              Down Hours
            </TableCell>
            <TableCell
              sx={{ fontWeight: 'bold', color: theme.palette.text.primary, borderBottom: `2px solid #00BCD4` }}
            >
              Reason
            </TableCell>
            <TableCell
              sx={{ fontWeight: 'bold', color: theme.palette.text.primary, borderBottom: `2px solid #00BCD4` }}
            >
              Comments
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, idx) => (
            <TableRow key={idx} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell sx={{ fontWeight: 500, color: 'text.primary' }}>{row.unitCode}</TableCell>
              <TableCell color="text.secondary">{row.startDt}</TableCell>
              <TableCell color="text.secondary">{row.endDt}</TableCell>
              <TableCell align="right">{row.daysDown}</TableCell>
              <TableCell align="right">{formatter.with_commas(row.downHours, 2)}</TableCell>
              <TableCell>{row.reason}</TableCell>
              <TableCell sx={{ whiteSpace: 'pre-line', maxWidth: 400 }}>{row.comments}</TableCell>
            </TableRow>
          ))}
          {/* Totals Row */}
          <TableRow
            sx={{
              bgcolor: alpha(theme.palette.primary.main, 0.03),
              '& td': { fontWeight: 'bold', color: theme.palette.text.primary },
            }}
          >
            <TableCell>Total</TableCell>
            <TableCell colSpan={2} />
            <TableCell align="right">{totals.daysDown}</TableCell>
            <TableCell align="right">{formatter.with_commas(totals.downHours, 2)}</TableCell>
            <TableCell colSpan={2} />
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}
