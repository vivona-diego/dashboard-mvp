'use client';

import MultiMetricQueryChart from '@/app/components/dashboard/charts/MultiMetricQueryChart';
import KPIGrid from '@/app/components/dashboard/KPIGrid';
import SalespersonTable, { SalespersonData, MonthlyData } from '@/app/components/dashboard/SalespersonTable';
import SegmentSelector from '@/app/components/dashboard/SegmentSelector';
import { Box, Stack, Typography, Grid } from '@mui/material';

import { useState, useMemo } from 'react';

export default function CorporateRevenueSegmentPage() {
  const datasetName = 'Corporate_Revenue_Segment_Forecast'; 
  const theme = 'dark';

  // Mock Props for Filters
  const [selectedYear, setSelectedYear] = useState<string | null>('2025');

  // Colors
  const chartColors = theme === 'dark' ? {
      target: '#4ADE80', // Green
      est: '#38BDF8',    // Blue
      act: '#fbbf24'     // Yellow/Gold
  } : {
      target: '#2e7d32', // Dark Green
      est: '#1a237e',    // Navy Blue
      act: '#fbc02d'     // Yellow
  };

  // Mock Salespeople
  const salespersonNames = ['Trever Weber', 'Matt McVittie', 'Brogan Roback', 'Chad McComas', 'Chris Kenyon', 'Jeff Lockwood'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  // Generate Mock Data
  const mockSalespeopleData: SalespersonData[] = useMemo(() => {
      return salespersonNames.map((name, index) => {
          // Randomized factors for variety
          const scale = 1 + (index * 0.2); // Each person has slightly different scale
          
          const monthlyData: MonthlyData[] = months.map(month => {
             return {
                 month,
                 target: Math.floor(Math.random() * (200000 * scale - 100000 * scale) + 100000 * scale),
                 estRevenue: Math.floor(Math.random() * (150000 * scale - 80000 * scale) + 80000 * scale),
                 actRevenue: Math.floor(Math.random() * (160000 * scale - 70000 * scale) + 70000 * scale),
                 newCustomers: Math.floor(Math.random() * 10),
                 newCustEstRev: Math.floor(Math.random() * 20000),
                 newCustActRev: Math.floor(Math.random() * 20000),
             };
          });

          // Sort months if needed, but array order is fine.
          // Sum up totals
          const totals = monthlyData.reduce((acc, curr) => ({
                target: acc.target + curr.target,
                estRevenue: acc.estRevenue + curr.estRevenue,
                actRevenue: acc.actRevenue + curr.actRevenue,
                newCustomers: acc.newCustomers + curr.newCustomers,
                newCustEstRev: acc.newCustEstRev + curr.newCustEstRev,
                newCustActRev: acc.newCustActRev + curr.newCustActRev
          }), { target: 0, estRevenue: 0, actRevenue: 0, newCustomers: 0, newCustEstRev: 0, newCustActRev: 0 });

          return {
              id: `sp-${index}`,
              name,
              ...totals,
              monthlyData
          };
      });
  }, []); // Run once

  // Aggregate for KPIs
  const totalTarget = mockSalespeopleData.reduce((acc, curr) => acc + curr.target, 0);
  const totalEst = mockSalespeopleData.reduce((acc, curr) => acc + curr.estRevenue, 0);
  const totalAct = mockSalespeopleData.reduce((acc, curr) => acc + curr.actRevenue, 0);
  const totalNewCustomers = mockSalespeopleData.reduce((acc, curr) => acc + curr.newCustomers, 0);
  
  // Variance
  const variance = totalEst - totalTarget;
  const variancePercent = totalTarget !== 0 ? (variance / totalTarget) * 100 : 0;

  const kpiData = {
      RevenueGoal: totalTarget,
      EstimatedRevenue: totalEst,
      ActualRevenue: totalAct,
      Variance: variance,
      VariancePercent: variancePercent,
      NewCustomers: totalNewCustomers
  };

  // Chart Data: Salesperson Totals
  const chartData = mockSalespeopleData.map(sp => ({
      Salesperson: sp.name,
      Target: sp.target,
      EstimatedRevenue: sp.estRevenue,
      ActualRevenue: sp.actRevenue
  }));

  return (
    <Box sx={{ minHeight: '100%', p: 3, bgcolor: 'background.default' }}>
        <Stack spacing={3}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                    <Typography variant="h5" fontWeight="bold" color="text.primary">
                        Jobs Revenue Forecast Report By Salesperson
                    </Typography>
                </Box>
                 <Box>
                    <Typography variant="caption" display="block" color="text.secondary" mb={0.5}>Year</Typography>
                     <SegmentSelector 
                        segments={['2025', '2024']} 
                        selectedSegment={selectedYear} 
                        onSelect={setSelectedYear}
                    />
                </Box>
            </Box>

            {/* KPI Grid */}
            <Box>
                <KPIGrid 
                    datasetName={datasetName} // mocked
                    metrics={[
                        { metricName: 'RevenueGoal', label: 'Revenue Goal', format: 'currency' },
                        { metricName: 'EstimatedRevenue', label: 'Est. Revenue', format: 'currency' },
                        { metricName: 'ActualRevenue', label: 'Act. Revenue', format: 'currency' },
                        { metricName: 'Variance', label: 'Variance', format: 'currency', highlightNegative: true },
                        { metricName: 'VariancePercent', label: 'Variance %', format: 'percent', highlightNegative: true },
                        { metricName: 'NewCustomers', label: 'New Customers', format: 'number' }
                    ]}
                    manualData={kpiData}
                    loading={false}
                    gridSize={{ xs: 6, md: 2 }} 
                />
            </Box>

            <Grid container spacing={2}>
                {/* Left Chart */}
                <Grid size={{ xs: 12, lg: 5 }}>
                    <MultiMetricQueryChart 
                        title="Est. Revenue vs. Revenue Goal"
                        datasetName={datasetName}
                        groupBySegments={['Salesperson']} 
                        metrics={[
                            { metricName: 'Target', label: 'Salesperson Target', type: 'bar', color: chartColors.target }, 
                            { metricName: 'EstimatedRevenue', label: 'Est. Revenue', type: 'bar', color: chartColors.est },
                            { metricName: 'ActualRevenue', label: 'Act. Revenue', type: 'bar', color: chartColors.act }
                        ]}
                        orientation="horizontal" // Matches previous page orientation for salesperson
                        manualData={chartData}
                        loading={false}
                        height={500}
                    />
                </Grid>

                {/* Right Table */}
                <Grid size={{ xs: 12, lg: 7 }}>
                    <SalespersonTable data={mockSalespeopleData} />
                </Grid>
            </Grid>
        </Stack>
    </Box>
  );
}
