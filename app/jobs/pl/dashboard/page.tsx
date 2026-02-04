'use client';

import { Box, Card, CardContent, Grid, Skeleton, Stack, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import api from '../../../api/axiosClient';
import SegmentSelector from '../../../components/dashboard/SegmentSelector';
import MultiMetricQueryChart from '../../../components/dashboard/charts/MultiMetricQueryChart';
import QueryChart from '../../../components/dashboard/charts/QueryChart';
import TableTile from '../../../components/dashboard/charts/TableTile';
import DrilldownListModal from '@/app/components/ui/DrilldownListModal';
import JobDetailModal from '@/app/components/ui/JobDetailModal';

interface Yard {
  displayValue: string;
  value: string | null;
}

interface KPI {
  name: string;
  value: number;
  formatted: string;
}

const DATASET_NAME = 'jobs_profit_loss';
const KPI_METRICS = [
  { metricName: 'JobRevenue', label: 'Job Revenue', format: 'currency' as const },
  { metricName: 'TotalExpenses', label: 'Total Expenses', format: 'currency' as const },
  { metricName: 'Profit', label: 'Profit', format: 'currency' as const, highlightNegative: true },
  { metricName: 'LaborHours', label: 'Labor Hours', format: 'number' as const },
  { metricName: 'ProfitPercent', label: 'Profit %', format: 'percent' as const, highlightNegative: true },
];

export default function JobsPLDashboardPage() {
  const [yards, setYards] = useState<Yard[]>([]);
  const [selectedYard, setSelectedYard] = useState<string | null>(null);
  const [kpiData, setKpiData] = useState<KPI[]>([]);

  const [loadingSegments, setLoadingSegments] = useState(false);
  const [loadingKPIs, setLoadingKPIs] = useState(false);

  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  // Drilldown States
  const [drilldownType, setDrilldownType] = useState<'SalesPerson' | 'Customer' | null>(null);
  const [drilldownValue, setDrilldownValue] = useState<string | null>(null);
  const [isDrilldownOpen, setIsDrilldownOpen] = useState(false);

  const [selectedJobCode, setSelectedJobCode] = useState<string | null>(null);
  const [isJobDetailOpen, setIsJobDetailOpen] = useState(false);


  const FILTERS = [
    ...(startDate && endDate
      ? [{ segmentName: 'JobStartDate', operator: 'between', value: startDate, secondValue: endDate }]
      : []),
    ...(selectedYard ? [{ segmentName: 'Yard', operator: 'eq', value: selectedYard }] : []),
  ];

  const fetchYards = async () => {
    // ... existing fetchYards implementation ...
    setLoadingSegments(true);
    try {
      const res = await api.get('/bi/segment-values', {
        params: {
          datasetName: 'jobs_profit_loss',
          segmentName: 'Yard',
          limit: 100,
        },
      });

      const yardsList = res.data.data.values || [];

      setYards(yardsList);
    } catch (error) {
      console.error('Error fetching yards:', error);
    } finally{
      setLoadingSegments(false);
    }
  };

  const fetchKPIs = async () => {
     // ... existing fetchKPIs implementation ...
    setLoadingKPIs(true);
    try {
      const res = await api.post('/bi/kpis', {
        datasetName: DATASET_NAME,
        metrics: KPI_METRICS.filter((m) => m.metricName !== 'ProfitPercent'),
        filters: FILTERS,
      });

      const kpiData = res.data.data.kpis || [];
      setKpiData(kpiData);
    } catch (error) {
      console.error('Error fetching KPIs:', error);
    } finally {
      setLoadingKPIs(false);
    }
  };

  useEffect(() => {
    fetchYards();
  }, []);

  useEffect(() => {
    fetchKPIs();
  }, [selectedYard, startDate, endDate]);

  const YARD_LIST = yards?.map((yard) => yard.displayValue);

  const revenueKPI = kpiData.find((k) => k.name === 'JobRevenue');
  const profitKPI = kpiData.find((k) => k.name === 'Profit');
  const profitValue = profitKPI?.value || 0;
  const revenueValue = revenueKPI?.value || 0;
  const profitPercentValue = revenueValue !== 0 ? (profitValue / revenueValue) * 100 : 0;

  const ProfitPercent: KPI = {
    name: 'Profit %',
    value: profitPercentValue,
    formatted: `${profitPercentValue.toFixed(1)} %`,
  };

  const currentKpiData = [...kpiData, ProfitPercent];
  const displayKpiData = (loadingKPIs && kpiData.length === 0) 
    ? KPI_METRICS.map(m => ({ name: m.metricName, formatted: '', value: 0 } as KPI))
    : currentKpiData;

  const handleSalesPersonClick = (row: any) => {
    if (row && row.SalesPerson) {
      setDrilldownType('SalesPerson');
      setDrilldownValue(row.SalesPerson);
      setIsDrilldownOpen(true);
    }
  };

  const handleCustomerClick = (row: any) => {
    if (row && row.Customer) {
      setDrilldownType('Customer');
      setDrilldownValue(row.Customer);
      setIsDrilldownOpen(true);
    }
  };

  const handleJobClick = (jobCode: string) => {
    setSelectedJobCode(jobCode);
    setIsJobDetailOpen(true);
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, bgcolor: 'background.default', minHeight: '100vh' }}>
      {/* Header Container */}
      <Box
        sx={{
          bgcolor: 'background.paper',
          p: 2,
          borderRadius: 2,
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
          mb: 3,
        }}
      >
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', md: 'center' }}
          spacing={2}
        >
          <Typography variant="h5" fontWeight="bold" color="text.primary">
            Jobs P/L Dashboard
          </Typography>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'stretch', sm: 'center' }} width={{ xs: '100%', sm: 'auto' }}>
            {/* Yard Selector using Custom Component */}
            <Box sx={{ minWidth: { xs: '100%', sm: '200px' } }}>
              <SegmentSelector
                segments={YARD_LIST}
                selectedSegment={selectedYard}
                onSelect={setSelectedYard}
                loading={loadingSegments}
                label="Yard"
              />
            </Box>

            {/* Date Range Selectors */}
            <Stack direction="row" spacing={2} alignItems="center">
              <Typography
                variant="caption"
                color="text.secondary"
                fontWeight="bold"
                display={{ xs: 'none', sm: 'block' }} // Hide label on mobile if space is tight, or keep it
                sx={{ textTransform: 'uppercase', letterSpacing: 0.5, fontSize: '0.75rem' }}
              >
                Date Range
              </Typography>
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{
                  bgcolor: 'background.default',
                  p: 0.5,
                  borderRadius: 1.5,
                  border: '1px solid',
                  borderColor: 'divider',
                  width: { xs: '100%', sm: 'auto' },
                  justifyContent: 'space-between'
                }}
              >
                <TextField
                  type="date"
                  size="small"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                    '& .MuiInputBase-input': { py: 0.5, fontSize: '0.875rem' },
                    width: { xs: '130px', sm: 'auto' }
                  }}
                />
                <Typography variant="body2" color="text.secondary">
                  -
                </Typography>
                <TextField
                  type="date"
                  size="small"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                    '& .MuiInputBase-input': { py: 0.5, fontSize: '0.875rem' },
                    width: { xs: '130px', sm: 'auto' }
                  }}
                />
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      </Box>

      {/* KPI Cards */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
        {displayKpiData.map((metric, idx) => {
          const metricConfig = KPI_METRICS.find((m) => m.metricName === metric.name);
          const label = metricConfig ? metricConfig.label : metric.name;

          return (
            <Box
              key={idx}
              sx={{
                flex: { xs: '1 1 100%', sm: '1 1 45%', md: '1 1 18%' }, // Responsive width: 1 per row (xs), 2 per row (sm), 5 per row (md)
                minWidth: { xs: '100%', sm: '200px', md: '150px' },
              }}
            >
              <Card
                elevation={0}
                sx={{
                  bgcolor: 'background.paper',
                  height: '100%',
                  borderRadius: 2,
                  boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
                  minHeight: '100px', // Prevent collapse
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <CardContent sx={{ p: '16px !important', textAlign: 'center', width: '100%' }}>
                  {loadingKPIs ? (
                     <Stack alignItems="center" spacing={1}>
                       <Skeleton variant="text" width="60%" height={32} />
                       <Skeleton variant="text" width="40%" height={20} />
                     </Stack>
                  ) : (
                    <>
                      <Typography variant="h5" fontWeight="bold" sx={{ color: 'text.primary', fontSize: '1.5rem', wordBreak: 'break-word' }}>
                        {metric.formatted}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        {label}
                      </Typography>
                    </>
                  )}
                </CardContent>
              </Card>
            </Box>
          );
        })}
      </Box>

      <Grid container spacing={3} mb={3}>
        {/* Left: Monthly Trend (Revenue/Exp/Profit) */}
        <Grid size={{ xs: 12, md: 4, lg: 4 }}>
          {loadingKPIs ? ( <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} /> ) : (
            <MultiMetricQueryChart
              title="Revenue, Expenses & Profit by Month"
              datasetName={DATASET_NAME}
              groupBySegments={['JobYear', 'JobMonth']}
              metrics={[
                { metricName: 'JobRevenue', label: 'Revenue', type: 'bar', color: '#00bfa5' },
                { metricName: 'TotalExpenses', label: 'Expenses', type: 'bar', color: '#455a64' },
                { metricName: 'Profit', label: 'Profit', type: 'line', color: '#ffb300' },
              ]}
              filters={FILTERS}
              orderBy={[
                { field: 'JobYear', direction: 'ASC' },
                { field: 'JobMonth', direction: 'ASC' },
              ]}
              height={400}
            />
          )}
        </Grid>

        {/* Center: Donut Chart (Profit % by Salesperson) */}
        <Grid size={{ xs: 12, md: 3, lg: 3 }}>
           {loadingKPIs ? ( <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} /> ) : (
            <QueryChart
              title="Profit % by Salesperson"
              datasetName={DATASET_NAME}
              groupBySegments={['SalesPerson']}
              metricName="Profit"
              chartType="donut"
              filters={FILTERS}
              height={400}
            />
          )}
        </Grid>

        {/* Right: Salesperson Table */}
        <Grid size={{ xs: 12, md: 5, lg: 5 }}>
          {loadingKPIs ? ( <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} /> ) : (
            <TableTile
              title="Salesperson Performance"
              datasetName={DATASET_NAME}
              groupBySegments={['SalesPerson']}
              metrics={['JobRevenue', 'TotalExpenses', 'Profit']}
              filters={FILTERS}
              useDrilldown={false}
              height={400}
              onRowClick={handleSalesPersonClick}
            />
          )}
        </Grid>
      </Grid>

      {/* Row 2: Top Customers & Grid */}
      <Grid container spacing={3}>
        {/* Left: Top 10 Customers (Horizontal Bar) */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Box sx={{ height: '100%' }}>
            {loadingKPIs ? ( <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} /> ) : (
              <MultiMetricQueryChart
                title="Top 10 Customers by Profit"
                datasetName={DATASET_NAME}
                groupBySegments={['Customer']}
                metrics={[
                  { metricName: 'TotalExpenses', label: 'Expenses', type: 'bar', stack: 'total', color: '#00bfa5' }, // Cyan
                  { metricName: 'Profit', label: 'Profit', type: 'bar', stack: 'total', color: '#ff7043' }, // Orange
                ]}
                filters={FILTERS}
                orientation="horizontal"
                orderBy={[{ field: 'Profit', direction: 'DESC' }]}
                limit={10}
                height={400}
              />
            )}
          </Box>
        </Grid>

        {/* Right: Customer Table */}
        <Grid size={{ xs: 12, md: 6 }}>
           {loadingKPIs ? ( <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} /> ) : (
            <TableTile
              title="Customer Performance"
              datasetName={DATASET_NAME}
              groupBySegments={['Customer']}
              metrics={['JobRevenue', 'TotalExpenses', 'Profit']}
              filters={FILTERS}
              useDrilldown={false}
              height={400}
              onRowClick={handleCustomerClick}
            />
          )}
        </Grid>
      </Grid>

      {/* Drilldown Modals */}
      <DrilldownListModal 
        open={isDrilldownOpen}
        onClose={() => setIsDrilldownOpen(false)}
        type={drilldownType}
        value={drilldownValue}
        dateFilters={{ startDate, endDate }}
        onJobClick={handleJobClick}
      />
      
      <JobDetailModal
        open={isJobDetailOpen}
        onClose={() => setIsJobDetailOpen(false)}
        jobCode={selectedJobCode}
      />
    </Box>
  );
}
