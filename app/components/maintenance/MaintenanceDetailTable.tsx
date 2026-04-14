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
  { unitType: '350 Ton AT Class', unitCode: 'AT15', cnt: 1, activity: '300 Hr. Service - Upper', pastDue: 0, pastDueDays: null, pastDueHours: null, dueLower: 960, currentLower: 2331, dueUpper: null, currentUpper: 6635, comingDueDays: null, comingDueHours: 103 },
  { unitType: '350 Ton AT Class', unitCode: 'AT15', cnt: 1, activity: 'Annual Crane Inspection', pastDue: 0, pastDueDays: null, pastDueHours: null, dueLower: null, currentLower: 2331, dueUpper: null, currentUpper: 6635, comingDueDays: 296, comingDueHours: null },
  { unitType: '350 Ton AT Class', unitCode: 'AT15', cnt: 1, activity: 'Fire Extinguisher Inspection', pastDue: 0, pastDueDays: null, pastDueHours: null, dueLower: null, currentLower: 2331, dueUpper: null, currentUpper: 6635, comingDueDays: 65, comingDueHours: null },
  { unitType: '155 Ton AT Class', unitCode: 'AT155-2', cnt: 1, activity: '300 Hr. Service - Lower', pastDue: 0, pastDueDays: null, pastDueHours: null, dueLower: 1830, currentLower: 1810, dueUpper: null, currentUpper: 6786, comingDueDays: null, comingDueHours: 20 },
  { unitType: '155 Ton AT Class', unitCode: 'AT155-2', cnt: 1, activity: '300 Hr. Service - Upper', pastDue: 0, pastDueDays: null, pastDueHours: null, dueLower: null, currentLower: 1810, dueUpper: null, currentUpper: 6786, comingDueDays: null, comingDueHours: 239 },
  { unitType: '155 Ton AT Class', unitCode: 'AT155-2', cnt: 1, activity: 'Annual Crane Inspection', pastDue: 0, pastDueDays: null, pastDueHours: null, dueLower: 54, currentLower: 1810, dueUpper: null, currentUpper: 6786, comingDueDays: 201, comingDueHours: null },
  { unitType: '155 Ton AT Class', unitCode: 'AT155-2', cnt: 1, activity: 'Fire Extinguisher Inspection', pastDue: 0, pastDueDays: null, pastDueHours: null, dueLower: null, currentLower: 1810, dueUpper: null, currentUpper: 6786, comingDueDays: 65, comingDueHours: null },
  { unitType: '175 Ton AT Class', unitCode: 'AT175-01', cnt: 1, activity: '300 Hr. Service - Lower', pastDue: 0, pastDueDays: null, pastDueHours: null, dueLower: 1832, currentLower: 1405, dueUpper: null, currentUpper: 1253, comingDueDays: null, comingDueHours: 427 },
  { unitType: '175 Ton AT Class', unitCode: 'AT175-01', cnt: 1, activity: 'Annual Crane Inspection', pastDue: 0, pastDueDays: null, pastDueHours: null, dueLower: null, currentLower: 1405, dueUpper: null, currentUpper: 1253, comingDueDays: 148, comingDueHours: null },
  { unitType: '175 Ton AT Class', unitCode: 'AT175-01', cnt: 1, activity: 'Fire Extinguisher Inspection', pastDue: 0, pastDueDays: null, pastDueHours: null, dueLower: null, currentLower: 1405, dueUpper: null, currentUpper: 1253, comingDueDays: null, comingDueHours: null },
  { unitType: '80 Ton AT Class', unitCode: 'AT80-01', cnt: 1, activity: '300 Hr. Service - Upper', pastDue: 0, pastDueDays: null, pastDueHours: null, dueLower: null, currentLower: 1682, dueUpper: null, currentUpper: 1936, comingDueDays: null, comingDueHours: null },
  { unitType: '80 Ton AT Class', unitCode: 'AT80-01', cnt: 1, activity: 'Annual Crane Inspection', pastDue: 0, pastDueDays: null, pastDueHours: null, dueLower: null, currentLower: 1682, dueUpper: null, currentUpper: 1936, comingDueDays: 143, comingDueHours: null },
  { unitType: '80 Ton AT Class', unitCode: 'AT80-01', cnt: 1, activity: 'Fire Extinguisher Inspection', pastDue: 0, pastDueDays: null, pastDueHours: null, dueLower: null, currentLower: 1682, dueUpper: null, currentUpper: 1936, comingDueDays: 59, comingDueHours: null },
  { unitType: '80 Ton AT Class', unitCode: 'AT80-01', cnt: 1, activity: 'Maintenance Service', pastDue: 0, pastDueDays: null, pastDueHours: null, dueLower: null, currentLower: 1682, dueUpper: null, currentUpper: 1936, comingDueDays: null, comingDueHours: null },
  { unitType: '26 Ton Boom Truck', unitCode: 'BT26-01', cnt: 1, activity: '300 Hr. Service - Lower', pastDue: 0, pastDueDays: null, pastDueHours: null, dueLower: 4855, currentLower: 4569, dueUpper: null, currentUpper: 0, comingDueDays: null, comingDueHours: 286 },
  { unitType: '26 Ton Boom Truck', unitCode: 'BT26-01', cnt: 1, activity: 'Annual Crane Inspection', pastDue: 0, pastDueDays: null, pastDueHours: null, dueLower: 1759, currentLower: 4569, dueUpper: 28836.00, currentUpper: 0, comingDueDays: 319, comingDueHours: null },
  { unitType: '26 Ton Boom Truck', unitCode: 'BT26-01', cnt: 1, activity: 'Annual Vehicle Inspection Report', pastDue: 0, pastDueDays: null, pastDueHours: null, dueLower: 1759, currentLower: 4569, dueUpper: 28836.00, currentUpper: 0, comingDueDays: 318, comingDueHours: null },
];

export default function MaintenanceDetailTable() {
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
            {MOCK_DATA.map((row, idx) => (
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
              <TableCell align="right">151</TableCell>
              <TableCell></TableCell>
              <TableCell align="right">0</TableCell>
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
