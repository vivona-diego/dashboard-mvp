'use client';

import {
  Box,
  Typography,
  Paper,
  FormControl,
  Select,
  MenuItem,
  Stack,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
  alpha,
  Skeleton,
  CircularProgress,
} from '@mui/material';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import formatter from '@/app/helpers/formatter';
import api from '@/app/lib/axiosClient';
import React from 'react';

// Dynamically import ReactECharts with ssr: false
const ReactECharts = dynamic(() => import('echarts-for-react'), {
  ssr: false,
  loading: () => <Skeleton variant="rectangular" width="100%" height={300} sx={{ borderRadius: 2 }} />,
});

const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

interface MonthlyData {
  month: string;
  billed: number;
  hoursUtil: number;
  targetHours: number;
}

interface UnitTypeUtilization {
  unitType: string;
  months: Record<string, MonthlyData>;
}

export default function EquipmentUtilizationPage() {
  const theme = useTheme();
  const [year, setYear] = useState('2022');
  const [mounted, setMounted] = useState(false);
  const [data, setData] = useState<UnitTypeUtilization[]>([]);
  const [loading, setLoading] = useState(false);

  // Chart series data
  const [utilSeries, setUtilSeries] = useState<number[]>(Array(12).fill(0));
  const [billedSeries, setBilledSeries] = useState<number[]>(Array(12).fill(0));
  const [rateSeries, setRateSeries] = useState<number[]>(Array(12).fill(0));

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const filters = [{ segmentName: 'Year', operator: 'eq', value: year }];

        // We need Utilization metrics and Revenue metrics to match the mock UI
        const [resUtil, resProfit] = await Promise.all([
          api
            .post('/bi/query', {
              datasetName: 'Equipment_Utilization',
              groupBySegments: ['UnitType', 'Month'],
              metrics: [{ metricName: 'AvgUtilization' }, { metricName: 'TotalTargetHours' }],
              filters,
              pagination: { page: 1, pageSize: 2000 },
            })
            .catch(() => null),
          api
            .post('/bi/query', {
              datasetName: 'Equipment',
              groupBySegments: ['UnitType', 'Month'],
              metrics: [{ metricName: 'TotalRevenue' }],
              filters,
              pagination: { page: 1, pageSize: 2000 },
            })
            .catch(() => null),
        ]);

        // Map of UnitType -> MonthIdx -> Data
        const mappedObj: Record<string, Record<number, MonthlyData>> = {};
        const utilResRows =
          resUtil?.data?.success || resUtil?.data?.data ? resUtil.data.data?.data || resUtil.data.data || [] : [];
        const profitResRows =
          resProfit?.data?.success || resProfit?.data?.data
            ? resProfit.data.data?.data || resProfit.data.data || []
            : [];

        // Process utilization
        utilResRows.forEach((r: any) => {
          const unit = r.UnitType || 'Unknown';
          const mIdx = parseInt(r.Month) - 1;
          if (mIdx >= 0 && mIdx < 12) {
            if (!mappedObj[unit]) mappedObj[unit] = {};
            if (!mappedObj[unit][mIdx])
              mappedObj[unit][mIdx] = { month: MONTHS_SHORT[mIdx], billed: 0, hoursUtil: 0, targetHours: 0 };
            mappedObj[unit][mIdx].hoursUtil = parseFloat(r.AvgUtilization || 0);
            mappedObj[unit][mIdx].targetHours = parseFloat(r.TotalTargetHours || 0);
          }
        });

        // Process profit for "Billed $"
        profitResRows.forEach((r: any) => {
          const unit = r.UnitType || 'Unknown';
          const mIdx = parseInt(r.Month) - 1;
          if (mIdx >= 0 && mIdx < 12) {
            if (!mappedObj[unit]) mappedObj[unit] = {};
            if (!mappedObj[unit][mIdx])
              mappedObj[unit][mIdx] = { month: MONTHS_SHORT[mIdx], billed: 0, hoursUtil: 0, targetHours: 0 };
            mappedObj[unit][mIdx].billed = parseFloat(r.TotalRevenue || 0);
          }
        });

        const formattedData = Object.keys(mappedObj).map((unitType) => {
          const monthsRecord: Record<string, MonthlyData> = {};
          MONTHS_SHORT.forEach((m, idx) => {
            monthsRecord[m] = mappedObj[unitType][idx] || { month: m, billed: 0, hoursUtil: 0, targetHours: 0 };
          });
          return { unitType, months: monthsRecord };
        });

        setData(formattedData);

        // Compute Chart Totals/Averages
        const chartUtil = Array(12).fill(0);
        const chartBilled = Array(12).fill(0);
        const chartRate = Array(12).fill(0); // Billed / TargetHours roughly

        const monthlySums = Array(12)
          .fill(null)
          .map(() => ({ utilSum: 0, count: 0, billedSum: 0, targetSum: 0 }));

        formattedData.forEach((row) => {
          MONTHS_SHORT.forEach((m, idx) => {
            const d = row.months[m];
            if (d.hoursUtil > 0 || d.billed > 0) {
              monthlySums[idx].utilSum += d.hoursUtil;
              monthlySums[idx].billedSum += d.billed;
              monthlySums[idx].targetSum += d.targetHours;
              monthlySums[idx].count += 1;
            }
          });
        });

        monthlySums.forEach((sum, idx) => {
          chartUtil[idx] = sum.count > 0 ? parseFloat((sum.utilSum / sum.count).toFixed(2)) : 0;
          chartBilled[idx] = sum.billedSum > 0 ? parseFloat((sum.billedSum / 1000000).toFixed(2)) : 0; // millions
          chartRate[idx] = sum.targetSum > 0 ? parseFloat((sum.billedSum / sum.targetSum).toFixed(2)) : 0;
        });

        setUtilSeries(chartUtil);
        setBilledSeries(chartBilled);
        setRateSeries(chartRate);
      } catch (error) {
        console.error('Error fetching util data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [year]);

  const getUtilizationColor = (percent: number) => {
    if (percent >= 65) return '#00bfa5'; // Greenish Cyan
    if (percent >= 50) return '#ffb300'; // Amber/Yellow
    if (percent > 0) return '#ff5252'; // Red
    return 'transparent';
  };

  // Chart Options
  const utilizationLineOptions = {
    title: {
      text: 'Avg Hours Utilization % By Month',
      left: 'center',
      textStyle: { fontSize: 13, color: theme.palette.text.secondary },
    },
    tooltip: { trigger: 'axis' },
    grid: { left: '12%', right: '10%', bottom: '15%', top: '25%' },
    xAxis: { type: 'category', data: MONTHS_SHORT, axisLabel: { color: theme.palette.text.secondary } },
    yAxis: { type: 'value', axisLabel: { formatter: '{value}%', color: theme.palette.text.secondary } },
    series: [
      {
        data: utilSeries,
        type: 'line',
        smooth: true,
        symbolSize: 8,
        itemStyle: { color: '#00bfa5' },
        lineStyle: { width: 3 },
        label: { show: true, position: 'top', formatter: '{c}%' },
      },
    ],
  };

  const billedLineOptions = {
    title: {
      text: 'Billed $ By Month (M)',
      left: 'center',
      textStyle: { fontSize: 13, color: theme.palette.text.secondary },
    },
    tooltip: { trigger: 'axis' },
    grid: { left: '15%', right: '5%', bottom: '15%', top: '25%' },
    xAxis: { type: 'category', data: MONTHS_SHORT, axisLabel: { color: theme.palette.text.secondary } },
    yAxis: { type: 'value', axisLabel: { formatter: '${value}M', color: theme.palette.text.secondary } },
    series: [
      {
        data: billedSeries,
        type: 'line',
        smooth: true,
        symbolSize: 8,
        itemStyle: { color: '#00bfa5' },
        lineStyle: { width: 3 },
        label: { show: true, position: 'top', formatter: '${c}M' },
      },
    ],
  };

  const rateLineOptions = {
    title: {
      text: 'Avg Hrly Rate $ By Month',
      left: 'center',
      textStyle: { fontSize: 13, color: theme.palette.text.secondary },
    },
    tooltip: { trigger: 'axis' },
    grid: { left: '15%', right: '5%', bottom: '15%', top: '25%' },
    xAxis: { type: 'category', data: MONTHS_SHORT, axisLabel: { color: theme.palette.text.secondary } },
    yAxis: { type: 'value', axisLabel: { formatter: '${value}', color: theme.palette.text.secondary } },
    series: [
      {
        data: rateSeries,
        type: 'line',
        smooth: true,
        symbolSize: 8,
        itemStyle: { color: '#00bfa5' },
        lineStyle: { width: 3 },
        label: { show: true, position: 'top', formatter: '${c}' },
      },
    ],
  };

  if (!mounted) return null;

  return (
    <Box sx={{ p: 3, bgcolor: 'background.default', minHeight: '100vh', position: 'relative' }}>
      {loading && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'rgba(255,255,255,0.7)',
            zIndex: 10,
          }}
        >
          <CircularProgress />
        </Box>
      )}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight="bold" color="primary">
          Yearly Utilization By Unit Type
        </Typography>

        <Stack direction="row" spacing={4} alignItems="center">
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography variant="caption" fontWeight="bold" color="text.secondary">
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

          <Box sx={{ minWidth: 150 }}>
            <Typography variant="caption" sx={{ fontWeight: 'bold', mb: 0.5, display: 'block' }}>
              Select a year
            </Typography>
            <FormControl fullWidth size="small" sx={{ bgcolor: 'white' }}>
              <Select value={year} onChange={(e) => setYear(e.target.value)}>
                {['2022', '2023', '2024', '2025', '2026'].map((y) => (
                  <MenuItem key={y} value={y}>
                    {y}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Stack>
      </Stack>

      <TableContainer
        component={Paper}
        elevation={0}
        sx={{ mb: 4, borderRadius: 2, border: '1px solid', borderColor: 'divider', overflowX: 'auto' }}
      >
        <Table size="small" sx={{ minWidth: 1200 }}>
          <TableHead>
            <TableRow sx={{ bgcolor: alpha(theme.palette.action.hover, 0.5) }}>
              <TableCell rowSpan={2} sx={{ fontWeight: 'bold', borderRight: '1px solid', borderColor: 'divider' }}>
                Unit Type
              </TableCell>
              {MONTHS_SHORT.map((m) => (
                <TableCell
                  key={m}
                  colSpan={3}
                  align="center"
                  sx={{ fontWeight: 'bold', borderRight: '1px solid', borderColor: 'divider' }}
                >
                  {m}
                </TableCell>
              ))}
            </TableRow>
            <TableRow sx={{ bgcolor: alpha(theme.palette.action.hover, 0.3) }}>
              {MONTHS_SHORT.map((m) => (
                <React.Fragment key={`${m}-sub`}>
                  <TableCell align="right" sx={{ fontSize: '0.7rem' }}>
                    Billed $
                  </TableCell>
                  <TableCell align="right" sx={{ fontSize: '0.7rem' }}>
                    Hours Util %
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ fontSize: '0.7rem', borderRight: '1px solid', borderColor: 'divider' }}
                  >
                    Avg Hr Rate
                  </TableCell>
                </React.Fragment>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length === 0 && !loading && (
              <TableRow>
                <TableCell colSpan={1 + MONTHS_SHORT.length * 3} align="center">
                  No Data
                </TableCell>
              </TableRow>
            )}
            {data.map((row, idx) => (
              <TableRow key={idx} hover>
                <TableCell sx={{ fontWeight: 'medium', borderRight: '1px solid', borderColor: 'divider' }}>
                  {row.unitType}
                </TableCell>
                {MONTHS_SHORT.map((m) => {
                  const mData = row.months[m];
                  const avgRate = mData && mData.targetHours > 0 ? mData.billed / mData.targetHours : 0;
                  return (
                    <React.Fragment key={`${m}-data`}>
                      <TableCell align="right">
                        {mData && mData.billed > 0 ? formatter.as_currency(mData.billed, true) : '-'}
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          bgcolor: mData && mData.hoursUtil > 0 ? getUtilizationColor(mData.hoursUtil) : 'transparent',
                          color: mData && mData.hoursUtil > 0 ? 'white' : 'inherit',
                          fontWeight: 'bold',
                        }}
                      >
                        {mData && mData.hoursUtil > 0 ? `${mData.hoursUtil}%` : '-'}
                      </TableCell>
                      <TableCell align="right" sx={{ borderRight: '1px solid', borderColor: 'divider' }}>
                        {avgRate > 0 ? `$${Math.round(avgRate)}` : '-'}
                      </TableCell>
                    </React.Fragment>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper elevation={0} sx={{ p: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
            <ReactECharts option={utilizationLineOptions} style={{ height: 300 }} />
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper elevation={0} sx={{ p: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
            <ReactECharts option={billedLineOptions} style={{ height: 300 }} />
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper elevation={0} sx={{ p: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
            <ReactECharts option={rateLineOptions} style={{ height: 300 }} />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
