'use client';

import { Box, Typography, Paper, FormControl, Select, MenuItem, Grid, Button, ButtonGroup } from '@mui/material';
import { useState } from 'react';
import DownUnitChart from '@/app/components/equipment/DownUnitChart';
import DownUnitTable from '@/app/components/equipment/DownUnitTable';
import { SelectChangeEvent } from '@mui/material';

const MOCK_CHART_DATA = {
  months: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ],
  currentYear: [168, 193, 115, 184, 92, 61, 23, 92, 206, 168, 99, 75],
  lastYear: [16, 143, 84, 8, 16, 75, 23, 66, 179, 72, 15, 15],
};

const MOCK_TABLE_DATA = [
  {
    unitCode: 'AT15',
    startDt: '02/15/22',
    endDt: '02/17/2022',
    daysDown: 3,
    downHours: 25.2,
    reason: 'Down',
    comments: 'walter payton going to be doing repairs to suspension, heaters, steering,',
  },
  {
    unitCode: 'AT15',
    startDt: '11/03/22',
    endDt: '11/08/2022',
    daysDown: 4,
    downHours: 30.55,
    reason: 'Down',
    comments:
      'walter payton coming to resolve issues\naux heater not working in upper\nif outrigger leaking\nhoist switch not working\npassenger side marker light on cab not working\nfuel gauge on upper not working',
  },
  {
    unitCode: 'AT155-2',
    startDt: '12/27/22',
    endDt: '12/28/2022',
    daysDown: 2,
    downHours: 15.27,
    reason: 'Down',
    comments: 'service and install camera',
  },
  {
    unitCode: 'BT26-01',
    startDt: '04/28/22',
    endDt: '05/04/2022',
    daysDown: 5,
    downHours: 38.91,
    reason: 'Down',
    comments:
      'crane has error for can bus J1939 and computeris locked up and not seeing load charts, walter payton is goin',
  },
  {
    unitCode: 'BT26-01',
    startDt: '05/10/22',
    endDt: '05/10/2022',
    daysDown: 1,
    downHours: 7.64,
    reason: 'Down',
    comments: 'taking to reefer peterbuilt to have dash checked out, fuel gauge',
  },
  {
    unitCode: 'BT26-01',
    startDt: '05/13/22',
    endDt: '05/13/2022',
    daysDown: 1,
    downHours: 7.64,
    reason: 'Down',
    comments: 'taking to cummins to have them install new DEF gauge, pump',
  },
  {
    unitCode: 'BT26-01',
    startDt: '05/20/22',
    endDt: '05/23/2022',
    daysDown: 2,
    downHours: 15.27,
    reason: 'Down',
    comments: 'ATB solinoid melted, have to order new part and walter payton is coming monday 5-23-22',
  },
  {
    unitCode: 'BT26-01',
    startDt: '09/12/22',
    endDt: '09/12/2022',
    daysDown: 1,
    downHours: 7.64,
    reason: 'Down',
    comments: 'peterbuilt looking at truck today, gauges not working intermittinly',
  },
  {
    unitCode: 'BT26-01',
    startDt: '09/19/22',
    endDt: '09/19/2022',
    daysDown: 1,
    downHours: 7.64,
    reason: 'Down',
    comments: 'Add Cameras',
  },
  {
    unitCode: 'BT26-01',
    startDt: '12/06/22',
    endDt: '12/07/2022',
    daysDown: 2,
    downHours: 15.27,
    reason: 'Down',
    comments: 'replacing engine breather',
  },
  {
    unitCode: 'TOTAL_REMAINDER', // For mock totals to match exactly
    startDt: '',
    endDt: '',
    daysDown: 245,
    downHours: 1168.69,
    reason: 'N/A',
    comments: 'Other miscellaneous unit downs',
  },
];

export default function DownUnitReportPage() {
  const [selectedYear, setSelectedYear] = useState('2022');
  const [unitType, setUnitType] = useState('All');
  const [unitCode, setUnitCode] = useState('All');

  const handleUnitTypeChange = (event: SelectChangeEvent) => {
    setUnitType(event.target.value);
  };

  const handleUnitCodeChange = (event: SelectChangeEvent) => {
    setUnitCode(event.target.value);
  };

  const years = ['2022', '2023', '2024', '2025', '2026'];

  return (
    <Box
      sx={{ p: 4, bgcolor: 'background.default', minHeight: '100vh', display: 'flex', flexDirection: 'column', gap: 4 }}
    >
      {/* Top Row: Title and Year Filter */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" fontWeight="bold" sx={{ color: '#00BCD4' }}>
          Down Unit - Report
        </Typography>
        <ButtonGroup size="small" variant="outlined" sx={{ '& .MuiButton-root': { py: 0.5, px: 2 } }}>
          {years.map((year) => (
            <Button
              key={year}
              onClick={() => setSelectedYear(year)}
              sx={{
                color: selectedYear === year ? 'white' : 'text.secondary',
                bgcolor: selectedYear === year ? '#424242' : 'transparent',
                borderColor: 'divider',
                '&:hover': {
                  bgcolor: selectedYear === year ? '#424242' : 'action.hover',
                  borderColor: 'divider',
                },
              }}
            >
              {year}
            </Button>
          ))}
        </ButtonGroup>
      </Box>

      {/* Middle Section: Dropdown Filters and Chart */}
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1, color: 'text.primary' }}>
                Select a Unit Type
              </Typography>
              <FormControl fullWidth size="small">
                <Select value={unitType} onChange={handleUnitTypeChange} sx={{ bgcolor: 'white' }}>
                  <MenuItem value="All">All</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1, color: 'text.primary' }}>
                Select a Unit Code
              </Typography>
              <FormControl fullWidth size="small">
                <Select value={unitCode} onChange={handleUnitCodeChange} sx={{ bgcolor: 'white' }}>
                  <MenuItem value="All">All</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
        </Grid>
        <Grid size={{ xs: 12, md: 9 }}>
          <Paper elevation={0} sx={{ p: 0, borderRadius: 2, overflow: 'hidden' }}>
            <DownUnitChart data={MOCK_CHART_DATA} />
          </Paper>
        </Grid>
      </Grid>

      {/* Bottom Section: Table */}
      <Box sx={{ flexGrow: 1 }}>
        <DownUnitTable data={MOCK_TABLE_DATA} />
      </Box>
    </Box>
  );
}
