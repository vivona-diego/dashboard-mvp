'use client';

import {
  Box,
  Typography,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Skeleton,
  TextField,
  Slider,
  Grid,
} from '@mui/material';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import formatter from '@/app/helpers/formatter';

// Dynamically import ReactECharts with ssr: false
const ReactECharts = dynamic(() => import('echarts-for-react'), {
  ssr: false,
  loading: () => <Skeleton variant="rectangular" width="100%" height={200} sx={{ borderRadius: 2 }} />,
});

const CYAN_COLOR = '#00bfa5';
const RED_COLOR = '#ba4141';
const YELLOW_COLOR = '#fbc02d';

interface UtilizationData {
  name: string;
  target: number;
  actual: number;
  down: number;
  utilization: number;
}

const COMPANY_DATA: UtilizationData[] = [
  { name: 'J. J. Curran Crane Company', target: 6888, actual: 2147, down: 153, utilization: 31.1 },
];

const YARD_DATA: UtilizationData[] = [
  { name: 'Detroit', target: 6552, actual: 2147, down: 153, utilization: 33 },
  { name: 'RE-Rent', target: 336, actual: 0, down: 0, utilization: 0 },
];

export default function UtilizationSummaryPage() {
  const [mounted, setMounted] = useState(false);
  const [dateRange, setDateRange] = useState<number[]>([0, 100]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getChartOptions = (data: UtilizationData[]) => {
    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
      },
      legend: {
        data: ['Hours Utilization', 'Idle %', 'Down'],
        bottom: 'bottom',
        left: 'left',
        icon: 'circle',
        textStyle: { fontSize: 10 },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '15%',
        top: '10%',
        containLabel: true,
      },
      xAxis: {
        type: 'value',
        max: 100,
        axisLabel: { formatter: '{value}%' },
      },
      yAxis: {
        type: 'category',
        data: data.map((d) => d.name),
        axisLabel: { fontSize: 10 },
      },
      series: [
        {
          name: 'Hours Utilization',
          type: 'bar',
          stack: 'total',
          label: { show: true, formatter: '{c}%', color: '#fff', fontSize: 10 },
          emphasis: { focus: 'series' },
          data: data.map((d) => d.utilization),
          itemStyle: { color: CYAN_COLOR },
        },
        {
          name: 'Idle %',
          type: 'bar',
          stack: 'total',
          label: { show: true, formatter: (params: any) => params.value > 0 ? params.value + '%' : '', color: '#fff', fontSize: 10 },
          emphasis: { focus: 'series' },
          data: data.map((d) => {
             const idle = 100 - d.utilization - 2; // Assuming 2% down for mock
             return idle > 0 ? Math.round(idle) : 0;
          }),
          itemStyle: { color: RED_COLOR },
        },
        {
          name: 'Down',
          type: 'bar',
          stack: 'total',
          label: { show: false },
          emphasis: { focus: 'series' },
          data: data.map((d) => d.down > 0 ? 2 : 0),
          itemStyle: { color: YELLOW_COLOR },
        },
      ],
    };
  };

  if (!mounted) return null;

  const companyTotal = COMPANY_DATA.reduce(
    (acc, curr) => ({
      target: acc.target + curr.target,
      actual: acc.actual + curr.actual,
      down: acc.down + curr.down,
      utilization: 31, // Calculated total
    }),
    { target: 0, actual: 0, down: 0, utilization: 0 }
  );

  const yardTotal = YARD_DATA.reduce(
    (acc, curr) => ({
      target: acc.target + curr.target,
      actual: acc.actual + curr.actual,
      down: acc.down + curr.down,
      utilization: 31, // Calculated total
    }),
    { target: 0, actual: 0, down: 0, utilization: 0 }
  );

  return (
    <Box sx={{ p: 4, bgcolor: '#fff', minHeight: '100vh' }}>
      <Grid container spacing={4}>
        {/* Header Section */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="h4" sx={{ color: CYAN_COLOR, fontWeight: 'bold', mb: 4 }}>
            Equipment Utilization - Summary
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <Paper variant="outlined" sx={{ p: 2, bgcolor: '#f5f5f5', border: 'none', borderRadius: 0, minWidth: 300 }}>
              <Typography variant="caption" fontWeight="bold" sx={{ mb: 1, display: 'block' }}>
                Select a Date Range
              </Typography>
              <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                <TextField size="small" value="01/01/2026" sx={{ bgcolor: 'white' }} />
                <TextField size="small" value="31/01/2026" sx={{ bgcolor: 'white' }} />
              </Stack>
              <Slider
                value={dateRange}
                onChange={(_, newValue) => setDateRange(newValue as number[])}
                sx={{ color: '#9e9e9e' }}
              />
            </Paper>
          </Box>
        </Grid>

        {/* First Row: Company */}
        <Grid size={{ xs: 12, md: 6 }}>
          <TableContainer component={Paper} elevation={0}>
            <Box sx={{ bgcolor: '#bdbdbd', p: 0.5, textAlign: 'center' }}>
              <Typography variant="subtitle2" fontWeight="bold">Utilization by Company</Typography>
            </Box>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ '& th': { fontSize: '0.75rem', fontWeight: 'bold', color: '#616161' } }}>
                  <TableCell>Name</TableCell>
                  <TableCell align="right">Target Month Hours</TableCell>
                  <TableCell align="right">Actual Hours</TableCell>
                  <TableCell align="right">Down Hours</TableCell>
                  <TableCell align="right">Hours Utilization</TableCell>
                </TableRow>
              </TableHead>
              <TableBody sx={{ '& td': { fontSize: '0.75rem' } }}>
                {COMPANY_DATA.map((row) => (
                  <TableRow key={row.name}>
                    <TableCell sx={{ color: CYAN_COLOR }}>{row.name}</TableCell>
                    <TableCell align="right">{formatter.with_commas(row.target, 0)}</TableCell>
                    <TableCell align="right">{formatter.with_commas(row.actual, 0)}</TableCell>
                    <TableCell align="right">{formatter.with_commas(row.down, 0)}</TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
                        <Box sx={{ width: 60, height: 12, bgcolor: '#e0e0e0', position: 'relative' }}>
                          <Box sx={{ width: `${row.utilization}%`, height: '100%', bgcolor: CYAN_COLOR }} />
                        </Box>
                        {row.utilization}%
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow sx={{ '& td': { fontWeight: 'bold' } }}>
                  <TableCell>Total</TableCell>
                  <TableCell align="right">{formatter.with_commas(companyTotal.target, 0)}</TableCell>
                  <TableCell align="right">{formatter.with_commas(companyTotal.actual, 0)}</TableCell>
                  <TableCell align="right">{formatter.with_commas(companyTotal.down, 0)}</TableCell>
                  <TableCell align="right">{companyTotal.utilization}%</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <ReactECharts option={getChartOptions(COMPANY_DATA)} style={{ height: 200 }} />
        </Grid>

        {/* Second Row: Yard */}
        <Grid size={{ xs: 12, md: 6 }}>
          <TableContainer component={Paper} elevation={0} sx={{ mt: 4 }}>
            <Box sx={{ bgcolor: '#bdbdbd', p: 0.5, textAlign: 'center' }}>
              <Typography variant="subtitle2" fontWeight="bold">Utilization By Yard</Typography>
            </Box>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ '& th': { fontSize: '0.75rem', fontWeight: 'bold', color: '#616161' } }}>
                  <TableCell>YardName</TableCell>
                  <TableCell align="right">Target Month Hours</TableCell>
                  <TableCell align="right">Actual Hours</TableCell>
                  <TableCell align="right">Down Hours</TableCell>
                  <TableCell align="right">Hours Utilization</TableCell>
                </TableRow>
              </TableHead>
              <TableBody sx={{ '& td': { fontSize: '0.75rem' } }}>
                {YARD_DATA.map((row) => (
                  <TableRow key={row.name} sx={{ bgcolor: row.name === 'Detroit' ? '#e1f5fe' : 'transparent' }}>
                    <TableCell>{row.name}</TableCell>
                    <TableCell align="right">{formatter.with_commas(row.target, 0)}</TableCell>
                    <TableCell align="right">{formatter.with_commas(row.actual, 0)}</TableCell>
                    <TableCell align="right">{formatter.with_commas(row.down, 0)}</TableCell>
                    <TableCell align="right">
                       <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
                        <Box sx={{ width: 60, height: 12, bgcolor: '#e0e0e0', position: 'relative' }}>
                          <Box sx={{ width: `${row.utilization}%`, height: '100%', bgcolor: CYAN_COLOR }} />
                        </Box>
                        {row.utilization}%
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow sx={{ '& td': { fontWeight: 'bold' } }}>
                  <TableCell>Total</TableCell>
                  <TableCell align="right">{formatter.with_commas(yardTotal.target, 0)}</TableCell>
                  <TableCell align="right">{formatter.with_commas(yardTotal.actual, 0)}</TableCell>
                  <TableCell align="right">{formatter.with_commas(yardTotal.down, 0)}</TableCell>
                  <TableCell align="right">{yardTotal.utilization}%</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
           <Box sx={{ mt: 4 }}>
             <ReactECharts option={getChartOptions([...YARD_DATA, { name: 'Sold/Inact', target: 0, actual: 0, down: 0, utilization: 0 }])} style={{ height: 250 }} />
           </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
