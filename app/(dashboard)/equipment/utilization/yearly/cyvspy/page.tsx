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
  CircularProgress,
} from '@mui/material';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import formatter from '@/app/helpers/formatter';
import api from '@/app/lib/axiosClient';
import SegmentSelector from '@/app/components/dashboard/SegmentSelector';

// Dynamically import ReactECharts with ssr: false
const ReactECharts = dynamic(() => import('echarts-for-react'), {
  ssr: false,
  loading: () => <Skeleton variant="rectangular" width="100%" height={300} sx={{ borderRadius: 2 }} />,
});

const MONTHS_FULL = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

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

export default function YearlyUtilizationPage() {
  const theme = useTheme();
  const DATASET_UTIL = 'Equipment';
  const DATASET_PL = 'Equipment';

  const [unitType, setUnitType] = useState<string | null>(null);
  const [unitCode, setUnitCode] = useState<string | null>(null);
  const [year, setYear] = useState('2022');
  const [mounted, setMounted] = useState(false);

  // Filters State
  const [unitTypes, setUnitTypes] = useState<string[]>([]);
  const [unitCodes, setUnitCodes] = useState<string[]>([]);
  const [loadingFilters, setLoadingFilters] = useState(false);

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<UtilizationSummaryData[]>([]);

  useEffect(() => {
    setMounted(true);
    const loadFilters = async () => {
      setLoadingFilters(true);
      try {
        const [typeRes, codeRes] = await Promise.all([
          api
            .get('/bi/segment-values', { params: { datasetName: DATASET_UTIL, segmentName: 'UnitType', limit: 100 } })
            .catch(() => null),
          api
            .get('/bi/segment-values', { params: { datasetName: DATASET_UTIL, segmentName: 'UnitCode', limit: 100 } })
            .catch(() => null),
        ]);
        const types = typeRes?.data?.data?.values || typeRes?.data?.values || [];
        const codes = codeRes?.data?.data?.values || codeRes?.data?.values || [];
        setUnitTypes(types.map((v: any) => v.displayValue));
        setUnitCodes(codes.map((v: any) => v.displayValue));
      } finally {
        setLoadingFilters(false);
      }
    };
    loadFilters();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const baseFilters = [
          ...(unitType && unitType !== 'All' ? [{ segmentName: 'UnitType', operator: 'eq', value: unitType }] : []),
          ...(unitCode && unitCode !== 'All' ? [{ segmentName: 'UnitCode', operator: 'eq', value: unitCode }] : []),
        ];

        const splyYear = (parseInt(year) - 1).toString();

        const filterCY = [...baseFilters, { segmentName: 'Year', operator: 'eq', value: year }];
        const filterSPLY = [...baseFilters, { segmentName: 'Year', operator: 'eq', value: splyYear }];

        const [utilCY, utilSPLY] = await Promise.all([
          api
            .post('/bi/query', {
              datasetName: DATASET_UTIL,
              groupBySegments: ['Month'],
              metrics: [
                { metricName: 'AvailableHours' }, // Mapping as approx Billed Hours
                { metricName: 'AvgUtilization' },
                { metricName: 'UnitCount' },
              ],
              ...(filterCY.length > 0 && { filters: filterCY }),
              pagination: { page: 1, pageSize: 20 },
            })
            .catch(() => null),
          api
            .post('/bi/query', {
              datasetName: DATASET_UTIL,
              groupBySegments: ['Month'],
              metrics: [{ metricName: 'AvailableHours' }],
              ...(filterSPLY.length > 0 && { filters: filterSPLY }),
              pagination: { page: 1, pageSize: 20 },
            })
            .catch(() => null),
        ]);

        const mergedData: UtilizationSummaryData[] = Array(12)
          .fill(null)
          .map((_, idx) => ({
            month: MONTHS_FULL[idx],
            billedHours: 0,
            billedHoursSPLY: 0,
            billedDol: 0,
            billedDolSPLY: 0,
            hoursUtil: 0,
            avgHrlyRate: 0,
            avgHrlyRateSPLY: 0,
            noOfUnits: 0,
          }));

        const processRes = (res: any, mapFn: (row: any, dataRow: UtilizationSummaryData) => void) => {
          if (res?.data?.success || res?.data?.data) {
            const rows = res.data.data?.data || res.data.data || [];
            rows.forEach((r: any) => {
              const mIdx = parseInt(r.Month) - 1;
              if (mIdx >= 0 && mIdx < 12) {
                mapFn(r, mergedData[mIdx]);
              }
            });
          }
        };

        processRes(utilCY, (r, dataRow) => {
          dataRow.billedHours = parseFloat(r.AvailableHours || 0);
          dataRow.hoursUtil = parseFloat(r.AvgUtilization || 0);
          dataRow.noOfUnits = parseFloat(r.UnitCount || 0);
        });
        processRes(utilSPLY, (r, dataRow) => {
          dataRow.billedHoursSPLY = parseFloat(r.AvailableHours || 0);
        });

        // Calculate derived metrics
        mergedData.forEach((row) => {
          row.avgHrlyRate = row.billedHours > 0 ? parseFloat((row.billedDol / row.billedHours).toFixed(2)) : 0;
          row.avgHrlyRateSPLY =
            row.billedHoursSPLY > 0 ? parseFloat((row.billedDolSPLY / row.billedHoursSPLY).toFixed(2)) : 0;
        });

        setData(mergedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [unitType, unitCode, year]);

  const getUtilColor = (percent: number) => {
    if (percent >= 65) return '#00bfa5';
    if (percent >= 50) return '#ffb300';
    if (percent > 0) return '#ff5252';
    return 'transparent';
  };

  const commonLineOptions = {
    tooltip: { trigger: 'axis' },
    legend: { top: 0, left: 'left', textStyle: { fontSize: 10, color: theme.palette.text.secondary } },
    grid: { left: '8%', right: '5%', bottom: '10%', top: '15%', containLabel: true },
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
        data: data.map((d) => d.hoursUtil),
        itemStyle: { color: '#00bfa5' },
        symbolSize: 8,
        label: { show: true, formatter: '{c}%' },
      },
      // Missing SPLY hoursUtil from API, so keeping it generic
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
        data: data.map((d) => Math.round(d.avgHrlyRate)),
        itemStyle: { color: '#00bfa5' },
        symbolSize: 8,
        label: { show: true, formatter: '${c}' },
      },
      {
        name: 'Avg Hrly Rate - SPLY',
        type: 'line',
        data: data.map((d) => Math.round(d.avgHrlyRateSPLY)),
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
        data: data.map((d) => parseFloat((d.billedDol / 1000000).toFixed(2))),
        itemStyle: { color: '#00bfa5' },
        symbolSize: 8,
        label: { show: true, formatter: '${c}M' },
      },
      {
        name: 'Billed $ - SPLY',
        type: 'line',
        data: data.map((d) => parseFloat((d.billedDolSPLY / 1000000).toFixed(2))),
        itemStyle: { color: '#455a64' },
        symbolSize: 8,
        label: { show: true, formatter: '${c}M' },
      },
    ],
  };

  if (!mounted) return null;

  const totals = data.reduce(
    (acc, row) => ({
      billedHours: acc.billedHours + row.billedHours,
      billedHoursSPLY: acc.billedHoursSPLY + row.billedHoursSPLY,
      billedDol: acc.billedDol + row.billedDol,
      billedDolSPLY: acc.billedDolSPLY + row.billedDolSPLY,
      utilSum: acc.utilSum + row.hoursUtil,
      count: acc.count + (row.hoursUtil > 0 ? 1 : 0),
      noOfUnits: Math.max(acc.noOfUnits, row.noOfUnits),
    }),
    { billedHours: 0, billedHoursSPLY: 0, billedDol: 0, billedDolSPLY: 0, utilSum: 0, count: 0, noOfUnits: 0 },
  );

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

      <Paper elevation={0} sx={{ p: 2, mb: 3, bgcolor: 'background.paper', borderRadius: 2 }}>
        <Typography variant="h6" fontWeight="bold" color="primary">
          Yearly / CY vs PY Utilization
        </Typography>
      </Paper>

      {/* Filters and Legend Row */}
      <Stack direction="row" justifyContent="space-between" alignItems="flex-end" sx={{ mb: 3 }}>
        <Grid container spacing={2} sx={{ maxWidth: 800 }}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <SegmentSelector
              label="Unit Type"
              segments={unitTypes}
              selectedSegment={unitType}
              onSelect={setUnitType}
              loading={loadingFilters}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <SegmentSelector
              label="Unit Code"
              segments={unitCodes}
              selectedSegment={unitCode}
              onSelect={setUnitCode}
              loading={loadingFilters}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Typography
              variant="caption"
              sx={{ fontWeight: 'bold', mb: 0.5, display: 'block', color: 'text.secondary' }}
            >
              Select a Year
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
                {data.map((row) => (
                  <TableRow key={row.month} hover>
                    <TableCell sx={{ fontSize: '0.75rem' }}>{row.month}</TableCell>
                    <TableCell align="right" sx={{ fontSize: '0.75rem' }}>
                      {row.billedHours > 0 ? formatter.with_commas(row.billedHours, 0) : '-'}
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{ fontSize: '0.75rem', bgcolor: alpha(theme.palette.action.hover, 0.2) }}
                    >
                      {row.billedHoursSPLY > 0 ? formatter.with_commas(row.billedHoursSPLY, 0) : '-'}
                    </TableCell>
                    <TableCell align="right" sx={{ fontSize: '0.75rem' }}>
                      {row.billedDol > 0 ? formatter.as_currency(row.billedDol, true) : '-'}
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{ fontSize: '0.75rem', bgcolor: alpha(theme.palette.action.hover, 0.2) }}
                    >
                      {row.billedDolSPLY > 0 ? formatter.as_currency(row.billedDolSPLY, true) : '-'}
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        fontSize: '0.75rem',
                        bgcolor: row.hoursUtil > 0 ? getUtilColor(row.hoursUtil) : 'transparent',
                        color: row.hoursUtil > 0 ? 'white' : 'inherit',
                        fontWeight: 'bold',
                      }}
                    >
                      {row.hoursUtil > 0 ? `${row.hoursUtil}%` : '-'}
                    </TableCell>
                    <TableCell align="right" sx={{ fontSize: '0.75rem' }}>
                      {row.avgHrlyRate > 0 ? `$${row.avgHrlyRate}` : '-'}
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{ fontSize: '0.75rem', bgcolor: alpha(theme.palette.action.hover, 0.2) }}
                    >
                      {row.avgHrlyRateSPLY > 0 ? `$${row.avgHrlyRateSPLY}` : '-'}
                    </TableCell>
                    <TableCell align="right" sx={{ fontSize: '0.75rem' }}>
                      {row.noOfUnits > 0 ? row.noOfUnits : '-'}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}>Total</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}>
                    {formatter.with_commas(totals.billedHours, 0)}
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}>
                    {formatter.with_commas(totals.billedHoursSPLY, 0)}
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}>
                    {formatter.as_currency(totals.billedDol, true)}
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}>
                    {formatter.as_currency(totals.billedDolSPLY, true)}
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      fontWeight: 'bold',
                      fontSize: '0.75rem',
                      bgcolor: getUtilColor(totals.count > 0 ? totals.utilSum / totals.count : 0),
                      color: 'white',
                    }}
                  >
                    {totals.count > 0 ? Math.round(totals.utilSum / totals.count) : 0}%
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}>
                    ${totals.billedHours > 0 ? Math.round(totals.billedDol / totals.billedHours) : 0}
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}>
                    ${totals.billedHoursSPLY > 0 ? Math.round(totals.billedDolSPLY / totals.billedHoursSPLY) : 0}
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}>
                    {totals.noOfUnits}
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
