'use client';

import { Box, Stack, Typography, Grid, Card, CardContent, Skeleton } from '@mui/material';
import formatter from '@/app/helpers/formatter';
import api from '../../../api/axiosClient';
import MultiMetricQueryChart from '../../../components/dashboard/charts/MultiMetricQueryChart';
import { useState, useEffect } from 'react';

interface KPI {
    name: string;
    value: number;
    formatted: string;
}

const DATASET_NAME = 'Job_Revenue_Forecast';

const KPI_METRICS = [
    { metricName: 'EstimatedRevenue', label: 'Revenue Goal', format: 'currency' as const },
    { metricName: 'AvgEstimatedRevenue', label: 'Est. Revenue', format: 'currency' as const },
    { metricName: 'ActualRevenue', label: 'Act. Revenue', format: 'currency' as const },
    { metricName: 'Variance', label: 'Variance', format: 'currency' as const, highlightNegative: true },
    { metricName: 'VariancePercent', label: 'Variance %', format: 'percent' as const, highlightNegative: true }
];

export default function CorporateRevenuePage() {
  const theme = 'dark';

  // Colors based on user requirement: 
  const chartColors = theme === 'dark' ? {
      goal: '#4ADE80', // Green
      est: '#38BDF8',  // Cyan/Blue
      var: '#F87171'   // Red
  } : {
      goal: '#2e7d32', // Dark Green
      est: '#1a237e',  // Navy/Blue
      var: '#d32f2f'   // Dark Red
  };

  // KPI State
  const [kpiData, setKpiData] = useState<KPI[]>([]);
  const [loadingKpis, setLoadingKpis] = useState(true);

  // Fetch KPI Data
  const fetchKPIs = async () => {
    try {
        setLoadingKpis(true);        
        const requestBody = {
            datasetName: DATASET_NAME,
            metrics: KPI_METRICS.map(m => ({ metricName: m.metricName })),
            filters: [] 
        };

        const res = await api.post('/bi/kpis', requestBody);

        const fetchedKpis = res.data?.data?.kpis || [];
        setKpiData(fetchedKpis);

    } catch (error) {
        console.error("Error fetching KPIs:", error);
    } finally {
        setLoadingKpis(false);
    }
  };

  useEffect(() => {
      fetchKPIs();
  }, []);

  // Calculate Derived Metrics (Variance)
  const revenueGoalKPI = kpiData.find(k => k.name === 'RevenueGoal');
  const estRevenueKPI = kpiData.find(k => k.name === 'EstimatedRevenue');

  const revenueGoal = revenueGoalKPI?.value || 0;
  const estRevenue = estRevenueKPI?.value || 0;

  const varianceValue = estRevenue - revenueGoal;
  const variancePercentValue = revenueGoal !== 0 ? (varianceValue / revenueGoal) * 100 : 0;

  const VarianceKPI: KPI = {
      name: 'Variance',
      value: varianceValue,
      formatted: formatter.as_currency(varianceValue, false)
  };

  const VariancePercentKPI: KPI = {
      name: 'VariancePercent',
      value: variancePercentValue,
      formatted: `${variancePercentValue.toFixed(1)} %`
  };

  const currentKpiData = [...kpiData, VarianceKPI, VariancePercentKPI];

  // Map to full list to ensure order and placeholders if loading
  const displayKpiData = (loadingKpis && kpiData.length === 0)
    ? KPI_METRICS.map(m => ({ name: m.metricName, formatted: '', value: 0 } as KPI))
    : KPI_METRICS.map(metricConfig => {
        const found = currentKpiData.find(d => d.name === metricConfig.metricName);
        return found || { name: metricConfig.metricName, value: 0, formatted: '-' };
    });

  return (
    <Box sx={{ minHeight: '100%', p: 3, bgcolor: 'background.default' }}>
        <Stack spacing={3}>
            {/* Header */}
            <Box>
                <Typography variant="h5" fontWeight="bold" color="text.primary">
                    2025 - Jobs Revenue Forecast Report - Corporate Revenue Goal vs. Estimated Revenue
                </Typography>
            </Box>

            {/* KPI Cards */}
            <Grid container spacing={3}>
                {displayKpiData.map((metric) => {
                    const metricConfig = KPI_METRICS.find(m => m.metricName === metric.name);
                    const label = metricConfig ? metricConfig.label : metric.name;
                    
                    const isNegative = metric.value < 0;
                    const highlight = metricConfig?.highlightNegative;
                    const color = highlight && isNegative ? 'error.main' : 'text.primary';

                    return (
                        <Grid key={label} size={{ xs: 12, sm: 6, md: 2.4 }}>
                            <Card elevation={0} sx={{ bgcolor: 'background.paper', height: '100%', borderRadius: 2, boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)' }}>
                                <CardContent sx={{ p: '16px !important', textAlign: 'center' }}>
                                    {loadingKpis && kpiData.length === 0 ? (
                                        <Stack alignItems="center" spacing={1}>
                                            <Skeleton variant="text" width="60%" height={32} />
                                            <Skeleton variant="text" width="40%" height={20} />
                                        </Stack>
                                    ) : (
                                        <>
                                            <Typography variant="h5" fontWeight="bold" sx={{ color: color, fontSize: '1.5rem' }}>
                                                {highlight && isNegative && '('}
                                                {metric.formatted.replace('-', '')} 
                                                {highlight && isNegative && ')'}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                                {label}
                                            </Typography>
                                        </>
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>
                    );
                })}
            </Grid>

            {/* Charts Grid */}
            <Grid container spacing={3}>
                {/* Left Chart: Est. Revenue vs. Revenue Goal */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <MultiMetricQueryChart 
                        title="Est. Revenue vs. Revenue Goal"
                        datasetName={DATASET_NAME}
                        groupBySegments={['Month']} 
                        metrics={[
                            { metricName: 'AvgEstimatedRevenue', label: 'Revenue Goal', type: 'bar', color: chartColors.goal }, 
                            { metricName: 'ActualRevenue', label: 'Est. Revenue', type: 'bar', color: chartColors.est } 
                        ]}
                        orientation="horizontal"
                        loading={false}
                    />
                </Grid>

                {/* Right Chart: Variance $ */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <MultiMetricQueryChart 
                        title="Variance $"
                        datasetName={DATASET_NAME}
                        groupBySegments={['Month']}
                        metrics={[
                            { metricName: 'Variance', label: 'Variance', type: 'bar', color: chartColors.var }
                        ]}
                        orientation="horizontal"
                        loading={false}
                    />
                </Grid>
            </Grid>
        </Stack>
    </Box>
  );
}
