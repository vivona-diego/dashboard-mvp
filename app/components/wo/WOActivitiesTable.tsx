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
  { wo: '7240', unit: 'T12', activityCode: '3002', activity: 'Air System Repair / Replace', comments: 'Replaced broken air line', billable: 'False', prevMaint: 'False', price: null, partsAmount: 238.87, laborAmount: 861, totalAmount: 1100 },
  { wo: '7241', unit: 'CP52', activityCode: '2000', activity: 'Annual Crane Inspection', comments: 'Performed annual', billable: 'False', prevMaint: 'True', price: null, partsAmount: null, laborAmount: 807, totalAmount: 807 },
  { wo: '7246', unit: 'TC115-01', activityCode: '3008', activity: 'Cab (Internal) Repair / Replace', comments: '', billable: 'True', prevMaint: 'False', price: null, partsAmount: 344.48, laborAmount: 386, totalAmount: 731 },
  { wo: '7247', unit: 'TRL39', activityCode: 'ANNUAL VEHICLE', activity: 'Annual Vehicle Inspection Report', comments: 'Inspected unit', billable: 'False', prevMaint: 'True', price: null, partsAmount: 20.27, laborAmount: 199, totalAmount: 220 },
  { wo: '7248', unit: 'RT70-01', activityCode: '3007', activity: 'Brake System Repair / Replace', comments: 'Repaired parking brake', billable: 'False', prevMaint: 'False', price: null, partsAmount: null, laborAmount: 1115, totalAmount: 1115 },
  { wo: '7248', unit: 'RT70-01', activityCode: '3008', activity: 'Cab (Internal) Repair / Replace', comments: '', billable: 'False', prevMaint: 'False', price: null, partsAmount: null, laborAmount: 1115, totalAmount: 1115 },
  { wo: '7249', unit: 'ML2', activityCode: '3030', activity: 'Hydraulic System Repair / Replace', comments: '', billable: 'False', prevMaint: 'False', price: null, partsAmount: null, laborAmount: 950, totalAmount: 950 },
  { wo: '7250', unit: 'C11', activityCode: '3021', activity: 'Engine Repair / Replace', comments: 'Replaced gasket and bypass hose', billable: 'False', prevMaint: 'False', price: null, partsAmount: 19.97, laborAmount: 1127, totalAmount: 1147 },
  { wo: '7251', unit: 'AT15', activityCode: '2000', activity: 'Annual Crane Inspection', comments: '', billable: 'True', prevMaint: 'True', price: null, partsAmount: null, laborAmount: 807, totalAmount: 807 },
  { wo: '7251', unit: 'AT15', activityCode: '3001', activity: 'A/C, Heater, Ventilation System Repair / Replace', comments: '', billable: 'True', prevMaint: 'False', price: null, partsAmount: null, laborAmount: 807, totalAmount: 807 },
];

export default function WOActivitiesTable() {
  const totals = {
      parts: 7120.91,
      labor: 15180,
      total: 22301
  }; // Using explicit mock totals from the image instead of pure reduce due to hidden rows in mock

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
            {MOCK_DATA.map((row, idx) => (
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
