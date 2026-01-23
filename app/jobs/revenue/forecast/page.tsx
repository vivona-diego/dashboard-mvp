'use client';

import { Box, Stack, Typography, Grid } from '@mui/material';
import KPIGrid from '../../../components/dashboard/KPIGrid';
import MultiMetricQueryChart from '../../../components/dashboard/charts/MultiMetricQueryChart';
import { useState } from 'react';

export default function CorporateRevenuePage() {
  const DATASET_NAME = 'Job_Revenue_Forecast'; // generic name, logic is mocked

  const theme = 'dark';

  // Colors based on user requirement: 
  // Left Chart: Est (Blue) vs Goal (Green)
  // Right Chart: Variance (Red for negative)
  
  const chartColors = theme === 'dark' ? {
      goal: '#4ADE80', // Green
      est: '#38BDF8',  // Cyan/Blue
      var: '#F87171'   // Red
  } : {
      goal: '#2e7d32', // Dark Green
      est: '#1a237e',  // Navy/Blue
      var: '#d32f2f'   // Dark Red
  };

  // 1. Generate Mock Chart Data (Monthly)
  // 1. Generate Mock Chart and KPI Data (Once)
  const [{ mockChartData, mockKpiData }] = useState(() => {
      const months = [
        'January', 'February', 'March', 'April', 'May', 'Jun', 
        'July', 'August', 'September', 'October', 'November', 'December'
      ];

      const chartData = months.map(month => {
          const revenueGoal = Math.floor(Math.random() * (1200000 - 900000 + 1)) + 900000; // 900k - 1.2M
          const estRevenue = Math.floor(Math.random() * (800000 - 500000 + 1)) + 500000;   // 500k - 800k
          const actRevenue = Math.floor(Math.random() * (900000 - 400000 + 1)) + 400000;
          const variance = estRevenue - revenueGoal; 
          
          return {
              Month: month,
              RevenueGoal: revenueGoal,
              EstimatedRevenue: estRevenue,
              ActualRevenue: actRevenue,
              Variance: variance
          };
      });

      // KPI Data
      const totalGoal = chartData.reduce((acc: number, curr: any) => acc + curr.RevenueGoal, 0);
      const totalEst = chartData.reduce((acc: number, curr: any) => acc + curr.EstimatedRevenue, 0);
      const totalAct = chartData.reduce((acc: number, curr: any) => acc + curr.ActualRevenue, 0);
      
      const totalVariance = totalEst - totalGoal; 
      const totalVariancePercent = (totalVariance / totalGoal) * 100;

      const kpiData = {
          RevenueGoal: totalGoal,
          EstimatedRevenue: totalEst,
          ActualRevenue: totalAct,
          Variance: totalVariance,
          VariancePercent: totalVariancePercent
      };

      return { mockChartData: chartData, mockKpiData: kpiData };
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

            {/* KPI Grid */}
            <Box>
                <KPIGrid 
                    datasetName={DATASET_NAME}
                    metrics={[
                        { metricName: 'RevenueGoal', label: 'Revenue Goal', format: 'currency' },
                        { metricName: 'EstimatedRevenue', label: 'Est. Revenue', format: 'currency' },
                        { metricName: 'ActualRevenue', label: 'Act. Revenue', format: 'currency' },
                        { metricName: 'Variance', label: 'Variance', format: 'currency', highlightNegative: true },
                        { metricName: 'VariancePercent', label: 'Variance %', format: 'percent', highlightNegative: true }
                    ]}
                    manualData={mockKpiData}
                    loading={false}
                    gridSize={{ xs: 12, sm: 6, md: 2.4 }} 
                />
            </Box>

            {/* Charts Grid */}
            <Grid container spacing={3}>
                {/* Left Chart: Est. Revenue vs. Revenue Goal */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <MultiMetricQueryChart 
                        title="Est. Revenue vs. Revenue Goal"
                        datasetName={DATASET_NAME}
                        groupBySegments={['Month']} 
                        metrics={[
                            { metricName: 'RevenueGoal', label: 'Revenue Goal', type: 'bar', color: chartColors.goal }, 
                            { metricName: 'EstimatedRevenue', label: 'Est. Revenue', type: 'bar', color: chartColors.est } 
                        ]}
                        orientation="horizontal"
                        manualData={mockChartData}
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
                        manualData={mockChartData}
                        loading={false}
                    />
                </Grid>
            </Grid>
        </Stack>
    </Box>
  );
}
