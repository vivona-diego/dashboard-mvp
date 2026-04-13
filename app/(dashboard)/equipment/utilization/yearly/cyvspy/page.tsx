'use client';

import {
  Box,
  Typography,
  Paper,
  FormControl,
  Select,
  MenuItem,
  Stack,
  Grid as Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
  alpha,
  Skeleton,
} from '@mui/material';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import formatter from '@/app/helpers/formatter';

// Dynamically import ReactECharts with ssr: false
const ReactECharts = dynamic(() => import('echarts-for-react'), {
  ssr: false,
  loading: () => <Skeleton variant="rectangular" width="100%" height={300} sx={{ borderRadius: 2 }} />,
});

interface UtilizationSummaryData {
  month: string;
  billedHours: number;
  billedHoursSPLY: number;
  billedDol: number;
  billedDolSPLY: number;
  hoursUtil: number;
  avgHrlyRate: number;
  avgHrlyRateSPLY: number;
  noOfUnits: number;
}

const MONTHS_FULL = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const MOCK_SUMMARY_DATA: UtilizationSummaryData[] = [
  {
    month: 'Jan',
    billedHours: 2480,
    billedHoursSPLY: 2716,
    billedDol: 638738,
    billedDolSPLY: 509258,
    hoursUtil: 64,
    avgHrlyRate: 258,
    avgHrlyRateSPLY: 188,
    noOfUnits: 30,
  },
  {
    month: 'Feb',
    billedHours: 2426,
    billedHoursSPLY: 2007,
    billedDol: 523437,
    billedDolSPLY: 360788,
    hoursUtil: 63,
    avgHrlyRate: 216,
    avgHrlyRateSPLY: 180,
    noOfUnits: 30,
  },
  {
    month: 'Mar',
    billedHours: 2536,
    billedHoursSPLY: 2513,
    billedDol: 643831,
    billedDolSPLY: 520744,
    hoursUtil: 66,
    avgHrlyRate: 254,
    avgHrlyRateSPLY: 207,
    noOfUnits: 30,
  },
  {
    month: 'Apr',
    billedHours: 2113,
    billedHoursSPLY: 2265,
    billedDol: 502181,
    billedDolSPLY: 514907,
    hoursUtil: 55,
    avgHrlyRate: 238,
    avgHrlyRateSPLY: 227,
    noOfUnits: 30,
  },
  {
    month: 'May',
    billedHours: 2256,
    billedHoursSPLY: 1935,
    billedDol: 543602,
    billedDolSPLY: 438092,
    hoursUtil: 58,
    avgHrlyRate: 241,
    avgHrlyRateSPLY: 226,
    noOfUnits: 30,
  },
  {
    month: 'Jun',
    billedHours: 2184,
    billedHoursSPLY: 2586,
    billedDol: 444811,
    billedDolSPLY: 586443,
    hoursUtil: 57,
    avgHrlyRate: 204,
    avgHrlyRateSPLY: 227,
    noOfUnits: 30,
  },
  {
    month: 'Jul',
    billedHours: 2541,
    billedHoursSPLY: 2619,
    billedDol: 432754,
    billedDolSPLY: 651400,
    hoursUtil: 66,
    avgHrlyRate: 170,
    avgHrlyRateSPLY: 249,
    noOfUnits: 30,
  },
  {
    month: 'Aug',
    billedHours: 3023,
    billedHoursSPLY: 2045,
    billedDol: 857647,
    billedDolSPLY: 457743,
    hoursUtil: 78,
    avgHrlyRate: 284,
    avgHrlyRateSPLY: 224,
    noOfUnits: 30,
  },
  {
    month: 'Sep',
    billedHours: 2868,
    billedHoursSPLY: 2102,
    billedDol: 602618,
    billedDolSPLY: 506887,
    hoursUtil: 74,
    avgHrlyRate: 210,
    avgHrlyRateSPLY: 241,
    noOfUnits: 30,
  },
  {
    month: 'Oct',
    billedHours: 2456,
    billedHoursSPLY: 3004,
    billedDol: 500612,
    billedDolSPLY: 734697,
    hoursUtil: 64,
    avgHrlyRate: 204,
    avgHrlyRateSPLY: 245,
    noOfUnits: 30,
  },
  {
    month: 'Nov',
    billedHours: 2137,
    billedHoursSPLY: 2946,
    billedDol: 435053,
    billedDolSPLY: 802505,
    hoursUtil: 53,
    avgHrlyRate: 204,
    avgHrlyRateSPLY: 272,
    noOfUnits: 30,
  },
  {
    month: 'Dec',
    billedHours: 2548,
    billedHoursSPLY: 1723,
    billedDol: 452525,
    billedDolSPLY: 346561,
    hoursUtil: 63,
    avgHrlyRate: 178,
    avgHrlyRateSPLY: 201,
    noOfUnits: 30,
  },
];

export default function YearlyUtilizationPage() {
  const theme = useTheme();
  const [unitType, setUnitType] = useState('All');
  const [unitCode, setUnitCode] = useState('All');
  const [year, setYear] = useState('2022');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getUtilColor = (percent: number) => {
    if (percent >= 65) return '#00bfa5';
    if (percent >= 50) return '#ffb300';
    return '#ff5252';
  };

  const commonLineOptions = {
    tooltip: { trigger: 'axis' },
    legend: { top: 0, left: 'left', textStyle: { fontSize: 10, color: theme.palette.text.secondary } },
    grid: { left: '5%', right: '5%', bottom: '10%', top: '15%', containLabel: true },
    xAxis: { type: 'category', data: MONTHS_FULL, axisLabel: { color: theme.palette.text.secondary } },
    yAxis: {
      type: 'value',
      axisLabel: { color: theme.palette.text.secondary },
      splitLine: { lineStyle: { type: 'dashed' } },
    },
  };

  const utilChartOptions = {
    ...commonLineOptions,
    title: {
      text: 'Hours Utilization % By Month',
      left: 'center',
      top: 20,
      textStyle: { fontSize: 13, color: theme.palette.text.primary },
    },
    series: [
      {
        name: 'Hours Utilization',
        type: 'line',
        data: [52, 51, 48, 43, 41, 40, 47, 56, 54, 57, 37, 45],
        itemStyle: { color: '#00bfa5' },
        symbolSize: 8,
        label: { show: true, formatter: '{c}%' },
      },
      {
        name: 'Hours Utilization % - SPLY',
        type: 'line',
        data: [53, 41, 53, 54, 43, 57, 60, 49, 51, 63, 69, 37],
        itemStyle: { color: '#455a64' },
        symbolSize: 8,
        label: { show: true, formatter: '{c}%' },
      },
    ],
  };

  const rateChartOptions = {
    ...commonLineOptions,
    title: {
      text: 'Avg. Hourly Rate $ By Month',
      left: 'center',
      top: 20,
      textStyle: { fontSize: 13, color: theme.palette.text.primary },
    },
    series: [
      {
        name: 'Avg Hrly Rate',
        type: 'line',
        data: [239, 193, 249, 219, 244, 211, 205, 275, 205, 178, 221, 188],
        itemStyle: { color: '#00bfa5' },
        symbolSize: 8,
        label: { show: true, formatter: '${c}' },
      },
      {
        name: 'Avg Hrly Rate - SPLY',
        type: 'line',
        data: [198, 173, 189, 184, 183, 192, 211, 190, 215, 245, 248, 194],
        itemStyle: { color: '#455a64' },
        symbolSize: 8,
        label: { show: true, formatter: '${c}' },
      },
    ],
  };

  const billedChartOptions = {
    ...commonLineOptions,
    title: {
      text: 'Billed $ By Month',
      left: 'center',
      top: 20,
      textStyle: { fontSize: 13, color: theme.palette.text.primary },
    },
    series: [
      {
        name: 'Billed $',
        type: 'line',
        data: [0.68, 0.54, 0.66, 0.52, 0.55, 0.46, 0.44, 0.84, 0.61, 0.52, 0.51, 0.48],
        itemStyle: { color: '#00bfa5' },
        symbolSize: 8,
        label: { show: true, formatter: '${c}M' },
      },
      {
        name: 'Billed $ - SPLY',
        type: 'line',
        data: [0.51, 0.37, 0.53, 0.52, 0.44, 0.59, 0.66, 0.47, 0.51, 0.74, 0.84, 0.37],
        itemStyle: { color: '#455a64' },
        symbolSize: 8,
        label: { show: true, formatter: '${c}M' },
      },
    ],
  };

  if (!mounted) return null;

  return (
    <Box sx={{ p: 3, bgcolor: 'background.default', minHeight: '100vh' }}>
      <Paper elevation={0} sx={{ p: 2, mb: 3, bgcolor: 'background.paper', borderRadius: 2 }}>
        <Typography variant="h6" fontWeight="bold" color="primary">
          Yearly / CY vs PY Utilization
        </Typography>
      </Paper>

      {/* Filters and Legend Row */}
      <Stack direction="row" justifyContent="space-between" alignItems="flex-end" sx={{ mb: 3 }}>
        <Grid container spacing={2} sx={{ maxWidth: 800 }}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Typography variant="caption" sx={{ fontWeight: 'bold', mb: 0.5, display: 'block' }}>
              Select a Unit Type
            </Typography>
            <FormControl fullWidth size="small">
              <Select value={unitType} onChange={(e) => setUnitType(e.target.value)}>
                <MenuItem value="All">All</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Typography variant="caption" sx={{ fontWeight: 'bold', mb: 0.5, display: 'block' }}>
              Select a Unit Code
            </Typography>
            <FormControl fullWidth size="small">
              <Select value={unitCode} onChange={(e) => setUnitCode(e.target.value)}>
                <MenuItem value="All">All</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Typography variant="caption" sx={{ fontWeight: 'bold', mb: 0.5, display: 'block' }}>
              Select a Year
            </Typography>
            <FormControl fullWidth size="small">
              <Select value={year} onChange={(e) => setYear(e.target.value)}>
                <MenuItem value="2022">2022</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Stack direction="row" spacing={3} alignItems="center">
          <Typography variant="caption" fontWeight="bold">
            Hours Util %
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            <Box sx={{ width: 30, height: 15, bgcolor: '#00bfa5' }} />
            <Typography variant="caption">65% Above</Typography>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <Box sx={{ width: 30, height: 15, bgcolor: '#ffb300' }} />
            <Typography variant="caption">{'>=50% and <65%'}</Typography>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <Box sx={{ width: 30, height: 15, bgcolor: '#ff5252' }} />
            <Typography variant="caption">{'< 50%'}</Typography>
          </Stack>
        </Stack>
      </Stack>

      <Grid container spacing={3}>
        {/* Top Charts */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper elevation={0} sx={{ p: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
            <ReactECharts option={utilChartOptions} style={{ height: 350 }} />
          </Paper>
        </Grid>
        {/* Summary Table */}
        <Grid size={{ xs: 12, md: 6 }}>
          <TableContainer
            component={Paper}
            elevation={0}
            sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider', maxHeight: 385 }}
          >
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '0.7rem' }}>Month</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '0.7rem' }}>
                    Billed Hours
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ fontWeight: 'bold', fontSize: '0.7rem', bgcolor: alpha(theme.palette.action.hover, 0.5) }}
                  >
                    Billed Hours - SPLY
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '0.7rem' }}>
                    Billed $
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ fontWeight: 'bold', fontSize: '0.7rem', bgcolor: alpha(theme.palette.action.hover, 0.5) }}
                  >
                    Billed $ - SPLY
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '0.7rem' }}>
                    Hours Util %
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '0.7rem' }}>
                    Avg Hrly Rate
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ fontWeight: 'bold', fontSize: '0.7rem', bgcolor: alpha(theme.palette.action.hover, 0.5) }}
                  >
                    Avg Hrly Rate - SPLY
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '0.7rem' }}>
                    No of Units
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {MOCK_SUMMARY_DATA.map((row) => (
                  <TableRow key={row.month} hover>
                    <TableCell sx={{ fontSize: '0.75rem' }}>{row.month}</TableCell>
                    <TableCell align="right" sx={{ fontSize: '0.75rem' }}>
                      {formatter.with_commas(row.billedHours, 0)}
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{ fontSize: '0.75rem', bgcolor: alpha(theme.palette.action.hover, 0.2) }}
                    >
                      {formatter.with_commas(row.billedHoursSPLY, 0)}
                    </TableCell>
                    <TableCell align="right" sx={{ fontSize: '0.75rem' }}>
                      {formatter.as_currency(row.billedDol, true)}
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{ fontSize: '0.75rem', bgcolor: alpha(theme.palette.action.hover, 0.2) }}
                    >
                      {formatter.as_currency(row.billedDolSPLY, true)}
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        fontSize: '0.75rem',
                        bgcolor: getUtilColor(row.hoursUtil),
                        color: 'white',
                        fontWeight: 'bold',
                      }}
                    >
                      {row.hoursUtil}%
                    </TableCell>
                    <TableCell align="right" sx={{ fontSize: '0.75rem' }}>
                      ${row.avgHrlyRate}
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{ fontSize: '0.75rem', bgcolor: alpha(theme.palette.action.hover, 0.2) }}
                    >
                      ${row.avgHrlyRateSPLY}
                    </TableCell>
                    <TableCell align="right" sx={{ fontSize: '0.75rem' }}>
                      {row.noOfUnits}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}>Total</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}>
                    29,566
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}>
                    28,459
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}>
                    $6,577,810
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}>
                    $6,430,025
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ fontWeight: 'bold', fontSize: '0.75rem', bgcolor: '#ffb300', color: 'white' }}
                  >
                    63%
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}>
                    $222
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}>
                    $226
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}>
                    30
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        {/* Bottom Charts */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper elevation={0} sx={{ p: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
            <ReactECharts option={rateChartOptions} style={{ height: 350 }} />
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper elevation={0} sx={{ p: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
            <ReactECharts option={billedChartOptions} style={{ height: 350 }} />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
