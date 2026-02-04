'use client';

import MultiMetricQueryChart from '@/app/components/dashboard/charts/MultiMetricQueryChart';
import KPIGrid from '@/app/components/dashboard/KPIGrid';
import SalespersonTable, { SalespersonData } from '@/app/components/dashboard/SalespersonTable';
import SegmentSelector from '@/app/components/dashboard/SegmentSelector';
import { Box, Stack, Typography, Grid } from '@mui/material';
import api from '@/app/api/axiosClient';

import { useState, useEffect } from 'react';

const DATASET_TARGETS = 'Job_Revenue_Forecast';
const DATASET_ACTUALS = 'jobs_profit_loss';

export default function CorporateRevenueSegmentPage() {
  const theme = 'dark';

  // Filters
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [yearOptions, setYearOptions] = useState<string[]>([]); 
  const [loadingFilters, setLoadingFilters] = useState(false);

  // States
  const [kpiData, setKpiData] = useState<Record<string, number>>({});
  const [salespersonData, setSalespersonData] = useState<SalespersonData[]>([]);
  const [loadingValues, setLoadingValues] = useState(false);
  const [/* chartData */, setChartData] = useState<any[]>([]);

    // Fetch filters (Year)
    useEffect(() => {
        const fetchYears = async () => {
            setLoadingFilters(true);
            try {
                 const res = await api.get('/bi/segment-values', {
                    params: {
                        datasetName: DATASET_ACTUALS, // Use actuals dataset for years as it's likely more comprehensive
                        segmentName: 'JobYear',
                        limit: 10
                    },
                });
                const values = res.data?.data?.values || res.data?.values || [];
                const years = values.map((v: any) => v.displayValue);
                if (years.length > 0) {
                    setYearOptions(years);
                    setSelectedYear(years[0]);
                }
            } catch (error) {
                console.error("Error fetching years:", error);
            } finally {
                setLoadingFilters(false);
            }
        }
        fetchYears();
    }, []);

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

    // Fetch Data
    useEffect(() => {
        const fetchData = async () => {
             // Removed early return to allow fetching without year if needed, or just to fix the logic flow
             // checks are handled below
             
             setLoadingValues(true);
             try {
/*                 const targetFilter = [
                    ...(selectedYear ? [{ segmentName: 'Year', operator: 'eq', value: selectedYear }] : [])
                ];
                const actualFilter = [
                    ...(selectedYear ? [{ segmentName: 'JobYear', operator: 'eq', value: selectedYear }] : [])
                ]; */

                // 1. Fetch Targets (Job_Revenue_Forecast)
                const targetRes = await api.post('/bi/query', {
                    datasetName: DATASET_TARGETS,
                    groupBySegments: ['SalesPerson', 'Month'],
                    metrics: [{ metricName: 'EstimatedRevenue' }],
                    /* filters: targetFilter, */ 
                    limit: 5000
                });

                // 2. Fetch Actuals (jobs_profit_loss)
                const actualRes = await api.post('/bi/query', {
                    datasetName: DATASET_ACTUALS,
                    groupBySegments: ['SalesPerson', 'JobMonth'],
                    metrics: [
                        { metricName: 'JobRevenue' },
                        { metricName: 'TotalExpenses' },
                        { metricName: 'Profit' }
                    ],
                    /* filters: actualFilter, */
                    limit: 5000
                });

                const targets = targetRes.data?.data?.data || [];
                const actuals = actualRes.data?.data?.data || [];

                processData(targets, actuals);

             } catch (err) {
                 console.error("Error fetching dashboard data", err);
             } finally {
                 setLoadingValues(false);
             }
        }

        fetchData();
    }, [selectedYear]);

    // Data Processing Helper
    const processData = (targets: any[], actuals: any[]) => {
         const map = new Map<string, SalespersonData>();
         
         const normalMonthOrder = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
         const shortMonthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

         const normalizeMonth = (m: string) => {
             if (!m) return '';
             if (normalMonthOrder.includes(m)) return m;
             const idx = shortMonthOrder.indexOf(m);
             if (idx !== -1) return normalMonthOrder[idx];
             return m; 
         };

         const getMonthIndex = (m: string) => {
             return normalMonthOrder.indexOf(m);
         };

         // Helper to get or create Salesperson entry
         const getSP = (name: string) => {
             const id = name || 'Unknown';
             if (!map.has(id)) {
                 map.set(id, {
                     id,
                     name,
                     target: 0,
                     estRevenue: 0,
                     actRevenue: 0,
                     newCustomers: 0,
                     newCustEstRev: 0,
                     newCustActRev: 0,
                     monthlyData: []
                 });
             }
             return map.get(id)!;
         };

         // Process Targets (Forecast)
         targets.forEach(row => {
             const sp = getSP(row['SalesPerson']);
             const month = normalizeMonth(row['Month']);
             const target = row['EstimatedRevenue'] || 0;

             // Map EstimatedRevenue to 'target' (Revenue Goal) and 'estRevenue' (Estimated Revenue)
             sp.target += target;
             sp.estRevenue += target; 
             
             // Find or create monthly entry
             let mData = sp.monthlyData.find(d => d.month === month);
             if (!mData) {
                 mData = { month, target: 0, estRevenue: 0, actRevenue: 0, newCustomers: 0, newCustEstRev: 0, newCustActRev: 0 };
                 sp.monthlyData.push(mData);
             }
             mData.target += target;
             mData.estRevenue += target;
         });

         // Process Actuals (Profit Loss)
         actuals.forEach(row => {
             const sp = getSP(row['SalesPerson']);
             const month = normalizeMonth(row['JobMonth']); // Mapping JobMonth to standardized Month
             const act = row['JobRevenue'] || 0;

             sp.actRevenue += act;

             let mData = sp.monthlyData.find(d => d.month === month);
             if (!mData) {
                 mData = { month, target: 0, estRevenue: 0, actRevenue: 0, newCustomers: 0, newCustEstRev: 0, newCustActRev: 0 };
                 sp.monthlyData.push(mData);
             }
             mData.actRevenue += act;
         });

         // Finalize and Sort
         const sortedSalespeople = Array.from(map.values()).sort((a, b) => b.estRevenue - a.estRevenue); // Sort by Est Revenue desc

         sortedSalespeople.forEach(sp => {
             sp.monthlyData.sort((a, b) => getMonthIndex(a.month) - getMonthIndex(b.month));
         });
         
         setSalespersonData(sortedSalespeople);

         // Calculate Aggregates for KPIs
         const totalTarget = sortedSalespeople.reduce((acc, curr) => acc + curr.target, 0);
         const totalEst = sortedSalespeople.reduce((acc, curr) => acc + curr.estRevenue, 0);
         const totalAct = sortedSalespeople.reduce((acc, curr) => acc + curr.actRevenue, 0);
         const variance = totalAct - totalTarget;
         const variancePercent = totalTarget !== 0 ? (variance / totalTarget) * 100 : 0;

         setKpiData({
            RevenueGoal: totalTarget,
            EstimatedRevenue: totalEst,
            ActualRevenue: totalAct,
            Variance: variance,
            VariancePercent: variancePercent,
            NewCustomers: 0 // Mocked for now
         });

         // Prepare Chart Data
         const cData = sortedSalespeople.map(sp => ({
             SalesPerson: sp.name,
             Target: sp.target,
             EstRevenue: sp.estRevenue,
             ActRevenue: sp.actRevenue
         }));
         setChartData(cData);
    };

    const manualKpiData = {
        RevenueGoal: kpiData.RevenueGoal || 0,
        EstimatedRevenue: kpiData.EstimatedRevenue || 0,
        ActualRevenue: kpiData.ActualRevenue || 0,
        Variance: kpiData.Variance || 0,
        VariancePercent: kpiData.VariancePercent || 0,
        NewCustomers: kpiData.NewCustomers || 0
    };

  return (
    <Box sx={{ flex:1 , p: 2, bgcolor: 'background.default' }}>
        <Stack spacing={3}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                    <Typography variant="h5" fontWeight="bold" color="text.primary">
                        Jobs Revenue Forecast Report By Salesperson
                    </Typography>
                </Box>
                 <Box>
                     <SegmentSelector 
                        label="Year"
                        segments={yearOptions} 
                        selectedSegment={selectedYear} 
                        onSelect={setSelectedYear}
                        loading={loadingFilters}
                    />
                </Box>
            </Box>

            {/* KPI Grid */}
            <Box>
                <KPIGrid 
                    datasetName={DATASET_TARGETS} 
                    manualData={manualKpiData} // Pass manual aggregated data
                    metrics={[
                        { metricName: 'RevenueGoal', label: 'Revenue Goal', format: 'currency_dense' },
                        { metricName: 'EstimatedRevenue', label: 'Est. Revenue', format: 'currency_dense' },
                        { metricName: 'ActualRevenue', label: 'Act. Revenue', format: 'currency_dense' },
                        { metricName: 'Variance', label: 'Variance', format: 'currency_dense', highlightNegative: true },
                        { metricName: 'VariancePercent', label: 'Variance %', format: 'percent', highlightNegative: true },
                        { metricName: 'NewCustomers', label: 'New Customers', format: 'number' }
                    ]}
                    loading={loadingValues}
                    gridSize={{ xs: 6, md: 2 }} 
                />
            </Box>

            <Grid container spacing={2}>
                {/* Left Chart */}
                <Grid size={{ xs: 12, lg: 5 }}>
                    <MultiMetricQueryChart 
                        title="Est. Revenue vs. Revenue Goal"
                        datasetName={DATASET_ACTUALS} // Placeholder
                        groupBySegments={['SalesPerson']} 
                        metrics={[
                            { metricName: 'Profit', label: 'Revenue Goal', type: 'bar', color: chartColors.target }, 
                            { metricName: 'JobRevenue', label: 'Est. Revenue', type: 'bar', color: chartColors.est },
                            { metricName: 'TotalExpenses', label: 'Act. Revenue', type: 'bar', color: chartColors.act }
                        ]}
                        orientation="horizontal" 
                        loading={loadingValues}
                        height={500}
                    />
                </Grid>

                {/* Right Table */}
                <Grid size={{ xs: 12, lg: 7 }}>
                    <SalespersonTable data={salespersonData} maxHeight="570px" />
                </Grid>
            </Grid>
        </Stack>
    </Box>
  );
}
