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
  Grid,
  CircularProgress,
  FormControl,
  Select,
  MenuItem
} from '@mui/material';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import formatter from '@/app/helpers/formatter';
import api from '@/app/lib/axiosClient';

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

export default function UtilizationSummaryPage() {
  const [mounted, setMounted] = useState(false);
  const [year, setYear] = useState('2022');
  const [companyData, setCompanyData] = useState<UtilizationData[]>([]);
  const [yardData, setYardData] = useState<UtilizationData[]>([]);
  const [loading, setLoading] = useState(false);

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
        bottom: '25%',
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
          label: { show: true, formatter: (params: any) => params.value > 0 ? Math.round(params.value) + '%' : '', color: '#fff', fontSize: 10 },
          emphasis: { focus: 'series' },
          data: data.map((d) => {
             // Mock idle computation based on target hours down percentage context
             // Down is actual hours vs target, so utilization + down % + idle % = 100%
             const downPercent = d.target > 0 ? (d.down / d.target) * 100 : 0;
             const idle = 100 - d.utilization - downPercent;
             return idle > 0 ? parseFloat(idle.toFixed(2)) : 0;
          }),
          itemStyle: { color: RED_COLOR },
        },
        {
          name: 'Down',
          type: 'bar',
          stack: 'total',
          label: { show: false },
          emphasis: { focus: 'series' },
          data: data.map((d) => {
              const downPercent = d.target > 0 ? (d.down / d.target) * 100 : 0;
              return parseFloat(downPercent.toFixed(2));
          }),
          itemStyle: { color: YELLOW_COLOR },
        },
      ],
    };
  };

  useEffect(() => {
    const fetchData = async () => {
        setLoading(true);
        try {
            const filters = [{ segmentName: 'Year', operator: 'eq', value: year }];
            const metrics = [
                { metricName: 'TargetHours' },
                { metricName: 'AvailableHours' },
                { metricName: 'DowntimeHours' },
                { metricName: 'AvgUtilization' }
            ];

            const [resCompany, resYard] = await Promise.all([
                api.post('/bi/query', {
                    datasetName: 'Equipment',
                    groupBySegments: ['Company'],
                    metrics,
                    filters,
                    pagination: { page: 1, pageSize: 50 }
                }).catch(() => null),
                api.post('/bi/query', {
                    datasetName: 'Equipment',
                    groupBySegments: ['Yard'],
                    metrics,
                    filters,
                    pagination: { page: 1, pageSize: 50 }
                }).catch(() => null)
            ]);

            const mapResponse = (res: any, nameField: string) => {
                if (res?.data?.success || (res?.data?.data && Array.isArray(res.data.data?.data))) {
                    const rows = res.data.data?.data || res.data.data || [];
                    return rows.map((r: any) => ({
                        name: r[nameField] || 'Unknown',
                        target: parseFloat(r.TargetHours || 0),
                        actual: parseFloat(r.AvailableHours || 0),
                        down: parseFloat(r.DowntimeHours || 0),
                        utilization: parseFloat(r.AvgUtilization || 0)
                    })).sort((a: any, b: any) => b.utilization - a.utilization);
                }
                return [];
            };

            setCompanyData(mapResponse(resCompany, 'Company'));
            setYardData(mapResponse(resYard, 'Yard'));

        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };
    fetchData();
  }, [year]);

  if (!mounted) return null;

  const calculateTotal = (data: UtilizationData[]) => {
      let target = 0, actual = 0, down = 0, utilSum = 0;
      data.forEach(d => {
          target += d.target;
          actual += d.actual;
          down += d.down;
          utilSum += d.utilization;
      });
      return { 
          target, actual, down, 
          // Average of Utilization percentages for simplicity
          utilization: data.length > 0 ? parseFloat((utilSum / data.length).toFixed(2)) : 0 
      };
  };

  const companyTotal = calculateTotal(companyData);
  const yardTotal = calculateTotal(yardData);

  return (
    <Box sx={{ p: 4, bgcolor: '#fff', minHeight: '100vh', position: 'relative' }}>
      {loading && (
          <Box sx={{ 
              position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, 
              display: 'flex', alignItems: 'center', justifyContent: 'center', 
              bgcolor: 'rgba(255,255,255,0.7)', zIndex: 10 
          }}>
              <CircularProgress />
          </Box>
      )}

      <Grid container spacing={4}>
        {/* Header Section */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="h4" sx={{ color: CYAN_COLOR, fontWeight: 'bold', mb: 4 }}>
            Equipment Utilization - Summary
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <Paper variant="outlined" sx={{ p: 2, bgcolor: '#f5f5f5', border: 'none', borderRadius: 0, minWidth: 200, display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography variant="caption" fontWeight="bold" sx={{ display: 'block' }}>
                Select Year
              </Typography>
              <FormControl size="small" fullWidth sx={{ bgcolor: 'white' }}>
                  <Select value={year} onChange={(e) => setYear(e.target.value)}>
                      {['2021', '2022', '2023', '2024', '2025', '2026'].map(y => (
                          <MenuItem key={y} value={y}>{y}</MenuItem>
                      ))}
                  </Select>
              </FormControl>
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
                  <TableCell align="right">Target Mnth Hours</TableCell>
                  <TableCell align="right">Actual Hours</TableCell>
                  <TableCell align="right">Down Hours</TableCell>
                  <TableCell align="right">Hours Util %</TableCell>
                </TableRow>
              </TableHead>
              <TableBody sx={{ '& td': { fontSize: '0.75rem' } }}>
                {companyData.length === 0 && (
                    <TableRow><TableCell colSpan={5} align="center">No data</TableCell></TableRow>
                )}
                {companyData.map((row) => (
                  <TableRow key={row.name}>
                    <TableCell sx={{ color: CYAN_COLOR }}>{row.name}</TableCell>
                    <TableCell align="right">{formatter.with_commas(row.target, 0)}</TableCell>
                    <TableCell align="right">{formatter.with_commas(row.actual, 0)}</TableCell>
                    <TableCell align="right">{formatter.with_commas(row.down, 0)}</TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
                        <Box sx={{ width: 60, height: 12, bgcolor: '#e0e0e0', position: 'relative' }}>
                          <Box sx={{ width: `${Math.min(row.utilization, 100)}%`, height: '100%', bgcolor: CYAN_COLOR }} />
                        </Box>
                        {row.utilization}%
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
                {companyData.length > 0 && (
                <TableRow sx={{ '& td': { fontWeight: 'bold' } }}>
                  <TableCell>Total</TableCell>
                  <TableCell align="right">{formatter.with_commas(companyTotal.target, 0)}</TableCell>
                  <TableCell align="right">{formatter.with_commas(companyTotal.actual, 0)}</TableCell>
                  <TableCell align="right">{formatter.with_commas(companyTotal.down, 0)}</TableCell>
                  <TableCell align="right">{companyTotal.utilization}%</TableCell>
                </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <ReactECharts option={getChartOptions(companyData)} style={{ height: companyData.length * 40 + 100 }} />
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
                  <TableCell align="right">Target Mnth Hours</TableCell>
                  <TableCell align="right">Actual Hours</TableCell>
                  <TableCell align="right">Down Hours</TableCell>
                  <TableCell align="right">Hours Util %</TableCell>
                </TableRow>
              </TableHead>
              <TableBody sx={{ '& td': { fontSize: '0.75rem' } }}>
                {yardData.length === 0 && (
                    <TableRow><TableCell colSpan={5} align="center">No data</TableCell></TableRow>
                )}
                {yardData.map((row) => (
                  <TableRow key={row.name}>
                    <TableCell>{row.name}</TableCell>
                    <TableCell align="right">{formatter.with_commas(row.target, 0)}</TableCell>
                    <TableCell align="right">{formatter.with_commas(row.actual, 0)}</TableCell>
                    <TableCell align="right">{formatter.with_commas(row.down, 0)}</TableCell>
                    <TableCell align="right">
                       <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
                        <Box sx={{ width: 60, height: 12, bgcolor: '#e0e0e0', position: 'relative' }}>
                          <Box sx={{ width: `${Math.min(row.utilization, 100)}%`, height: '100%', bgcolor: CYAN_COLOR }} />
                        </Box>
                        {row.utilization}%
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
                {yardData.length > 0 && (
                <TableRow sx={{ '& td': { fontWeight: 'bold' } }}>
                  <TableCell>Total</TableCell>
                  <TableCell align="right">{formatter.with_commas(yardTotal.target, 0)}</TableCell>
                  <TableCell align="right">{formatter.with_commas(yardTotal.actual, 0)}</TableCell>
                  <TableCell align="right">{formatter.with_commas(yardTotal.down, 0)}</TableCell>
                  <TableCell align="right">{yardTotal.utilization}%</TableCell>
                </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
           <Box sx={{ mt: 4 }}>
             <ReactECharts option={getChartOptions(yardData)} style={{ height: Math.max(yardData.length * 40 + 100, 250) }} />
           </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
