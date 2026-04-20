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
  Card,
  CardContent,
  useTheme,
  Skeleton,
  CircularProgress,
} from '@mui/material';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import api from '@/app/lib/axiosClient';
import formatter from '@/app/helpers/formatter';
import SegmentSelector from '@/app/components/dashboard/SegmentSelector';

// Dynamically import ReactECharts with ssr: false to prevent hydration/layout effect errors
const ReactECharts = dynamic(() => import('echarts-for-react'), {
  ssr: false,
  loading: () => <Skeleton variant="rectangular" width="100%" height="100%" sx={{ borderRadius: 1 }} />,
});

const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function EquipmentSummaryPage() {
  const theme = useTheme();
  const DATASET_NAME = 'Equipment';

  const [unitType, setUnitType] = useState<string | null>(null);
  const [unitCode, setUnitCode] = useState<string | null>(null);
  const [year, setYear] = useState('2022');
  const [mounted, setMounted] = useState(false);

  // Segments
  const [unitTypes, setUnitTypes] = useState<string[]>([]);
  const [unitCodes, setUnitCodes] = useState<string[]>([]);
  const [loadingFilters, setLoadingFilters] = useState(false);

  // Data
  const [loading, setLoading] = useState(false);
  const [kpiData, setKpiData] = useState({ profitPercent: 0, revenue: 0, expenses: 0, profitDol: 0 });
  const [pieData, setPieData] = useState({ labor: 0, materials: 0, overhead: 0 });
  const [ytdData, setYtdData] = useState({
    revenue: Array(12).fill(0),
    expenses: Array(12).fill(0),
    profit: Array(12).fill(0),
  });

  useEffect(() => {
    setMounted(true);
    const loadFilters = async () => {
      setLoadingFilters(true);
      try {
        const [typeRes, codeRes] = await Promise.all([
          api
            .get('/bi/segment-values', { params: { datasetName: DATASET_NAME, segmentName: 'UnitType', limit: 100 } })
            .catch(() => null),
          api
            .get('/bi/segment-values', { params: { datasetName: DATASET_NAME, segmentName: 'UnitCode', limit: 100 } })
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
        const filters = [
          { segmentName: 'Year', operator: 'eq', value: year },
          ...(unitType && unitType !== 'All' ? [{ segmentName: 'UnitType', operator: 'eq', value: unitType }] : []),
          ...(unitCode && unitCode !== 'All' ? [{ segmentName: 'UnitCode', operator: 'eq', value: unitCode }] : []),
        ];

        // 1. KPI Aggregates (No Grouping except limits to calculate totals? Actually can group by Year)
        const aggRes = await api
          .post('/bi/query', {
            datasetName: DATASET_NAME,
            groupBySegments: ['Year'],
            metrics: [
              { metricName: 'TotalRevenue' },
              { metricName: 'TotalExpenses' },
              { metricName: 'TotalProfit' },
              { metricName: 'AvgProfitPercent' },
              { metricName: 'LaborExpenses' },
              { metricName: 'MaterialExpenses' },
              { metricName: 'OverheadExpenses' },
            ],
            ...(filters.length > 0 && { filters }),
            pagination: { page: 1, pageSize: 1 },
          })
          .catch(() => null);

        // 2. YTD Monthly Series
        const ytdRes = await api
          .post('/bi/query', {
            datasetName: DATASET_NAME,
            groupBySegments: ['Month'],
            metrics: [{ metricName: 'TotalRevenue' }, { metricName: 'TotalExpenses' }, { metricName: 'TotalProfit' }],
            ...(filters.length > 0 && { filters }),
            pagination: { page: 1, pageSize: 20 },
          })
          .catch(() => null);

        // Map KPI
        if (aggRes?.data?.success || aggRes?.data?.data) {
          const row = (aggRes.data.data?.data || aggRes.data.data || [])[0] || {};
          setKpiData({
            revenue: parseFloat(row.TotalRevenue || 0),
            expenses: parseFloat(row.TotalExpenses || 0),
            profitDol: parseFloat(row.TotalProfit || 0),
            profitPercent: parseFloat(row.AvgProfitPercent || 0),
          });
          setPieData({
            labor: parseFloat(row.LaborExpenses || 0),
            materials: parseFloat(row.MaterialExpenses || 0),
            overhead: parseFloat(row.OverheadExpenses || 0),
          });
        } else {
          setKpiData({ profitPercent: 0, revenue: 0, expenses: 0, profitDol: 0 });
          setPieData({ labor: 0, materials: 0, overhead: 0 });
        }

        // Map YTD
        const revSeries = Array(12).fill(0);
        const expSeries = Array(12).fill(0);
        const profSeries = Array(12).fill(0);

        if (ytdRes?.data?.success || ytdRes?.data?.data) {
          const rows = ytdRes.data.data?.data || ytdRes.data.data || [];
          rows.forEach((r: any) => {
            const mIdx = parseInt(r.Month) - 1;
            if (mIdx >= 0 && mIdx < 12) {
              revSeries[mIdx] = parseFloat(r.TotalRevenue || 0) / 1000000; // in Millions
              expSeries[mIdx] = parseFloat(r.TotalExpenses || 0) / 1000000;
              profSeries[mIdx] = parseFloat(r.TotalProfit || 0) / 1000000;
            }
          });
        }

        setYtdData({ revenue: revSeries, expenses: expSeries, profit: profSeries });
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [year, unitType, unitCode]);

  const commonChartOptions = {
    tooltip: { trigger: 'item' },
    backgroundColor: 'transparent',
  };

  // 1. Profit % Gauge
  const profitGaugeOptions = {
    ...commonChartOptions,
    series: [
      {
        type: 'pie',
        radius: ['60%', '80%'],
        center: ['50%', '75%'],
        startAngle: 180,
        label: { show: false },
        data: [
          { value: Math.max(0, kpiData.profitPercent), name: 'Profit %', itemStyle: { color: '#00BCD4' } },
          { value: Math.max(0, 100 - kpiData.profitPercent), name: '', itemStyle: { color: '#E0E0E0' } },
          { value: 100, name: '', itemStyle: { color: 'none' } },
        ],
      },
    ],
  };

  // 2. Equipment Expenses (Pie)
  const equipmentExpensesOptions = {
    ...commonChartOptions,
    tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
    legend: { orient: 'vertical', right: '5%', top: 'center', textStyle: { color: theme.palette.text.primary } },
    series: [
      {
        name: 'Equipment Expenses',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['35%', '50%'],
        data: [
          { value: pieData.overhead, name: 'Overhead', itemStyle: { color: '#F27127' } },
          { value: pieData.materials, name: 'Materials', itemStyle: { color: '#002E8A' } },
          { value: pieData.labor, name: 'Labor', itemStyle: { color: '#2C9CF2' } },
        ],
        label: {
          formatter: '${c}\n({d}%)',
          color: theme.palette.text.secondary,
        },
      },
    ],
  };

  // 5. YTD Revenue Area Chart
  const ytdOptions = {
    ...commonChartOptions,
    tooltip: { trigger: 'axis' },
    legend: {
      data: ['Revenue', 'Expenses', 'Profit'],
      top: 10,
      left: 'center',
      textStyle: { color: theme.palette.text.primary },
    },
    grid: { left: '8%', right: '5%', bottom: '15%', top: '20%', containLabel: true },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: MONTHS_SHORT,
      axisLabel: { color: theme.palette.text.secondary },
      axisLine: { lineStyle: { color: theme.palette.divider } },
    },
    yAxis: {
      type: 'value',
      axisLabel: { formatter: '${value}M', color: theme.palette.text.secondary },
      splitLine: { lineStyle: { color: theme.palette.divider, type: 'dashed' } },
    },
    series: [
      {
        name: 'Revenue',
        type: 'line',
        areaStyle: { opacity: 0.2 },
        data: ytdData.revenue,
        itemStyle: { color: '#2C9CF2' },
        symbol: 'circle',
      },
      {
        name: 'Expenses',
        type: 'line',
        areaStyle: { opacity: 0.2 },
        data: ytdData.expenses,
        itemStyle: { color: '#002E8A' },
        symbol: 'circle',
      },
      {
        name: 'Profit',
        type: 'line',
        areaStyle: { opacity: 0.2 },
        data: ytdData.profit,
        itemStyle: { color: '#F27127' },
        symbol: 'circle',
      },
    ],
  };

  if (!mounted) {
    return <Box sx={{ p: 4, minHeight: '100vh', bgcolor: 'background.default' }} />;
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, bgcolor: 'background.default', minHeight: '100vh', position: 'relative' }}>
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

      {/* Header Content */}
      <Paper elevation={0} sx={{ p: 2, mb: 3, bgcolor: 'background.paper', borderRadius: 2 }}>
        <Typography variant="h5" fontWeight="bold" sx={{ color: 'text.primary' }}>
          Equipment P/L Dashboard
        </Typography>
      </Paper>

      <Grid container spacing={3}>
        {/* Left Side Filters */}
        <Grid size={{ xs: 12, md: 2 }}>
          <Stack spacing={3}>
            <Box>
              <SegmentSelector
                label="Unit Type"
                segments={unitTypes}
                selectedSegment={unitType}
                onSelect={setUnitType}
                loading={loadingFilters}
              />
            </Box>
            <Box>
              <SegmentSelector
                label="Unit Code"
                segments={unitCodes}
                selectedSegment={unitCode}
                onSelect={setUnitCode}
                loading={loadingFilters}
              />
            </Box>
            <Box>
              <Typography
                variant="caption"
                sx={{ fontWeight: 'bold', mb: 0.5, display: 'block', color: 'text.secondary' }}
              >
                Year
              </Typography>
              <FormControl fullWidth size="small" sx={{ bgcolor: 'white' }}>
                <Select value={year} onChange={(e) => setYear(e.target.value)}>
                  <MenuItem value="2021">2021</MenuItem>
                  <MenuItem value="2022">2022</MenuItem>
                  <MenuItem value="2023">2023</MenuItem>
                  <MenuItem value="2024">2024</MenuItem>
                  <MenuItem value="2025">2025</MenuItem>
                  <MenuItem value="2026">2026</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Stack>
        </Grid>

        {/* Right Side Main Content */}
        <Grid size={{ xs: 12, md: 10 }}>
          <Stack spacing={3}>
            {/* KPI Row */}
            <Grid container spacing={2}>
              {/* Gauge Profit % */}
              <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                <Card
                  elevation={0}
                  sx={{ height: 120, borderRadius: 2, display: 'flex', flexDirection: 'column', position: 'relative' }}
                >
                  <CardContent
                    sx={{ p: 2, pb: 0, flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                  >
                    <Typography variant="caption" color="text.secondary" fontWeight="bold">
                      Avg Profit %
                    </Typography>
                    <Box sx={{ width: '100%', height: 100, position: 'absolute', top: 20 }}>
                      <ReactECharts option={profitGaugeOptions} style={{ height: '100%', width: '100%' }} />
                      <Typography
                        variant="h6"
                        fontWeight="bold"
                        sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -10%)' }}
                      >
                        {kpiData.profitPercent.toFixed(2)}%
                      </Typography>
                    </Box>
                  </CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 2, pb: 1, zIndex: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                      0.00%
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      100.00%
                    </Typography>
                  </Box>
                </Card>
              </Grid>

              {/* Equipment Revenue */}
              <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                <Card
                  elevation={0}
                  sx={{ height: 120, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" fontWeight="bold" color="text.primary">
                      {formatter.as_currency(kpiData.revenue, true).replace('.00', '')}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#2C9CF2', mt: 1 }}>
                      Equipment Revenue
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              {/* Equipment Expenses */}
              <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                <Card
                  elevation={0}
                  sx={{ height: 120, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" fontWeight="bold" color="text.primary">
                      {kpiData.expenses < 0
                        ? `(${formatter.as_currency(Math.abs(kpiData.expenses), true).replace('.00', '')})`
                        : formatter.as_currency(kpiData.expenses, true).replace('.00', '')}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#2C9CF2', mt: 1 }}>
                      Equipment Expenses
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              {/* Profit $ & % */}
              <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                <Grid container spacing={2}>
                  <Grid size={6}>
                    <Card
                      elevation={0}
                      sx={{
                        height: 120,
                        borderRadius: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <CardContent sx={{ textAlign: 'center', p: 1 }}>
                        <Typography variant="h5" fontWeight="bold" color="text.primary">
                          {formatter.as_currency(kpiData.profitDol, true).replace('.00', '')}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#2C9CF2' }}>
                          Profit $
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid size={6}>
                    <Card
                      elevation={0}
                      sx={{
                        height: 120,
                        borderRadius: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <CardContent sx={{ textAlign: 'center', p: 1 }}>
                        <Typography variant="h5" fontWeight="bold" color="text.primary">
                          {kpiData.profitPercent.toFixed(2)}%
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#2C9CF2' }}>
                          Profit %
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            {/* Top Charts Row */}
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Card elevation={0} sx={{ borderRadius: 2, height: 350, display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ p: 1.5, borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
                    <Typography variant="subtitle2" fontWeight="bold" align="center">
                      Equipment Expenses
                    </Typography>
                  </Box>
                  <CardContent sx={{ p: 0, flexGrow: 1 }}>
                    {pieData.labor === 0 && pieData.materials === 0 && pieData.overhead === 0 ? (
                      <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                          No expense data
                        </Typography>
                      </Box>
                    ) : (
                      <ReactECharts option={equipmentExpensesOptions} style={{ height: '100%', width: '100%' }} />
                    )}
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Card elevation={0} sx={{ borderRadius: 2, height: 350, display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ p: 1.5, borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
                    <Typography variant="subtitle2" fontWeight="bold" align="center">
                      YTD Revenue, Expenses and Profit by Month
                    </Typography>
                  </Box>
                  <CardContent sx={{ p: 1, flexGrow: 1 }}>
                    <ReactECharts option={ytdOptions} style={{ height: '100%', width: '100%' }} />
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}
