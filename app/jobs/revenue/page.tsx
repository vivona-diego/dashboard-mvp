'use client';

import { Box, Stack, Typography, Grid, Card, CardContent, Skeleton } from '@mui/material';
import { useState, useEffect } from 'react';
import api from '../../api/axiosClient';
import SegmentSelector from '../../components/dashboard/SegmentSelector';
import MultiMetricQueryChart from '../../components/dashboard/charts/MultiMetricQueryChart';
import DetailedMonthlyTable, { MonthlyDetailedData } from '../../components/dashboard/DetailedMonthlyTable';
import CustomerRevenueTable, { CustomerRevenueData } from '../../components/dashboard/CustomerRevenueTable';

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
    { metricName: 'JobCount', label: 'Total Jobs', format: 'number' as const },
    // { metricName: 'HighConfQuote', label: 'High Conf Quote', format: 'currency' },
    // { metricName: 'TotalEst', label: 'Total Est.', format: 'currency' },
    // { metricName: 'TotalCustomers', label: 'Total Customers', format: 'number' },
];

export default function JobsRevenueForecastReportPage() {

    // Filter States
    const [company, setCompany] = useState<string | null>(null);
    const [yard, setYard] = useState<string | null>(null);
    const [year, setYear] = useState<string | null>(null);

    // Filter Options
    const [companyOptions, setCompanyOptions] = useState<string[]>([]);
    const [yardOptions, setYardOptions] = useState<string[]>([]);
    const [yearOptions, setYearOptions] = useState<string[]>([]);
    
    // Loading States
    const [loadingFilters, setLoadingFilters] = useState(false);

    const theme = 'dark';

    const chartColors = theme === 'dark' ? {
        est: '#38BDF8', // Cyan
        act: '#4ADE80', // Green
        goal: '#A3E635', // Lime
        var: '#F87171'  // Red
    } : {
        est: '#1a237e', // Navy
        act: '#fbc02d', // Yellow/Gold from image
        goal: '#4caf50', // Green from image
        var: '#d32f2f'
    };
    
    // Helpers to fetch filters
    const fetchFilterData = async (segmentName: string, setter: (data: string[]) => void) => {
        try {
            const res = await api.get('/bi/segment-values', {
                params: {
                    datasetName: DATASET_NAME,
                    segmentName: segmentName,
                    limit: 100,
                },
            });
            const values = res.data?.data?.values || res.data?.values || [];
            setter(values.map((v: any) => v.displayValue));
        } catch (error) {
            console.error(`Error fetching ${segmentName}:`, error);
        }
    };

    const loadFilters = async () => {
        setLoadingFilters(true);
        await Promise.all([
             fetchFilterData('Company', setCompanyOptions), 
             fetchFilterData('Yard', setYardOptions),
             fetchFilterData('Year', setYearOptions)
        ]);
        setLoadingFilters(false);
    };

    useEffect(() => {
        loadFilters();
    }, []);

    // Filter Logic
    const FILTERS = [
        ...(company && company !== 'All' ? [{ segmentName: 'Company', operator: 'eq', value: company }] : []),
        ...(yard && yard !== 'All' ? [{ segmentName: 'Yard', operator: 'eq', value: yard }] : []),
        ...(year ? [{ segmentName: 'JobYear', operator: 'eq', value: year }] : [])
    ];

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
              filters: FILTERS
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

    // Map to full list to ensure order and placeholders if loading
    const displayKpiData = (loadingKpis && kpiData.length === 0)
      ? KPI_METRICS.map(m => ({ name: m.metricName, formatted: '', value: 0 } as KPI))
      : KPI_METRICS.map(metricConfig => {
          const found = kpiData.find(d => d.name === metricConfig.metricName);
          return found || { name: metricConfig.metricName, value: 0, formatted: '-' };
      });

    // Table Data State
    const [monthlyData, setMonthlyData] = useState<MonthlyDetailedData[]>([]);
    const [customerData, setCustomerData] = useState<CustomerRevenueData[]>([]);
    const [loadingTables, setLoadingTables] = useState(false);

    // Fetch Monthly Data
    const fetchMonthlyData = async () => {
        try {
            const res = await api.post('/bi/query', {
                datasetName: DATASET_NAME,
                groupBySegments: ['Month'],
                metrics: [
                    { metricName: 'EstimatedRevenue' },  // Goal
                    { metricName: 'AvgEstimatedRevenue' }, // Est
                    { metricName: 'ActualRevenue' }, // Act
                    { metricName: 'JobCount' } 
                ],
                filters: FILTERS,
                orderBy: [{ field: 'Month', direction: 'ASC' }] 
            });

            if (res.data?.success && res.data?.data?.data) {
                const rawData = res.data.data.data;
                // Client-side cumulative calculation
                let cumulativeTotEst = 0;
                let cumulativeAct = 0;
                
                // Sort months properly if returned as strings
                const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                const sortedData = rawData.sort((a: any, b: any) => {
                    return monthOrder.indexOf(a.Month) - monthOrder.indexOf(b.Month);
                });

                const processed = sortedData.map((row: any) => {
                    // Mapping matches KPI config
                    const estRevenue = row['AvgEstimatedRevenue'] || 0; 
                    const actRevenue = row['ActualRevenue'] || 0;
                    
                    cumulativeTotEst += estRevenue;
                    cumulativeAct += actRevenue;

                    return {
                        month: row['Month'],
                        revenueGoal: row['EstimatedRevenue'] || 0,
                        estRevenue: estRevenue,
                        highConfQuote: 0, // Not available in basic metrics yet
                        totalEst: estRevenue, // Using Est Revenue as Total Est for now
                        actRevenue: actRevenue,
                        cumulativeTotEst,
                        cumulativeAct
                    };
                });
                setMonthlyData(processed);
            }
        } catch (error) {
            console.error("Error fetching monthly data:", error);
        }
    };

    // Fetch Customer Data
    const fetchCustomerData = async () => {
        try {
            const res = await api.post('/bi/query', {
                datasetName: DATASET_NAME,
                groupBySegments: ['Customer'],
                metrics: [
                    { metricName: 'AvgEstimatedRevenue' }, 
                    { metricName: 'ActualRevenue' }
                ],
                filters: FILTERS,
                orderBy: [{ field: 'ActualRevenue', direction: 'DESC' }],
                pagination: { page: 1, pageSize: 20 }
            });

            if (res.data?.success && res.data?.data?.data) {
                 const processed = res.data.data.data.map((row: any) => ({
                    customerName: row['Customer'],
                    estRevenue: row['AvgEstimatedRevenue'] || 0,
                    highConfQuote: 0,
                    totalEst: row['AvgEstimatedRevenue'] || 0,
                    actRevenue: row['ActualRevenue'] || 0
                 }));
                 setCustomerData(processed);
            }
        } catch (error) {
            console.error("Error fetching customer data:", error);
        }
    };

    const refreshData = async () => {
        setLoadingTables(true);
        await Promise.all([
            fetchKPIs(), // Re-fetch KPIs with filters
            fetchMonthlyData(),
            fetchCustomerData()
        ]);
        setLoadingTables(false);
    };

    useEffect(() => {
        refreshData();
    }, [year, company, yard]); // Trigger on filter change

    return (
        <Box sx={{ minHeight: '100%', p: 3, bgcolor: 'background.default' }}>
            <Stack spacing={3}>
                {/* Header & Filters */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
                    <Box>
                        <Typography variant="h5" fontWeight="bold" color="text.primary">
                            Jobs Revenue Forecast Report
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                        <Box>
                            <Typography variant="caption" display="block" color="text.secondary" mb={0.5}>Select a Company</Typography>
                            <SegmentSelector 
                                segments={companyOptions} 
                                selectedSegment={company} 
                                onSelect={setCompany}
                                loading={loadingFilters}
                                label=''
                            />
                        </Box>
                        <Box>
                            <Typography variant="caption" display="block" color="text.secondary" mb={0.5}>Select a Yard</Typography>
                            <SegmentSelector 
                                segments={yardOptions} 
                                selectedSegment={yard} 
                                onSelect={setYard}
                                loading={loadingFilters}
                                label=''
                            />
                        </Box>
                        <Box>
                             <Typography variant="caption" display="block" color="text.secondary" mb={0.5}>Year</Typography>
                             <SegmentSelector 
                                segments={yearOptions} 
                                selectedSegment={year} 
                                onSelect={setYear}
                                loading={loadingFilters}
                                label=''
                            />
                        </Box>
                    </Box>
                </Box>

                {/* KPI Cards */}
                <Grid container spacing={3}>
                    {displayKpiData.map((metric) => {
                        const metricConfig = KPI_METRICS.find(m => m.metricName === metric.name);
                        const label = metricConfig ? metricConfig.label : metric.name;
                        
                        return (
                            <Grid key={label} size={{ xs: 12, sm: 6, md: 3 }}>
                                <Card elevation={0} sx={{ bgcolor: 'background.paper', height: '100%', borderRadius: 2, boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)' }}>
                                    <CardContent sx={{ p: '16px !important', textAlign: 'center' }}>
                                        {loadingKpis && kpiData.length === 0 ? (
                                            <Stack alignItems="center" spacing={1}>
                                                <Skeleton variant="text" width="60%" height={32} />
                                                <Skeleton variant="text" width="40%" height={20} />
                                            </Stack>
                                        ) : (
                                            <>
                                                <Typography variant="h5" fontWeight="bold" sx={{ color: 'text.primary', fontSize: '1.5rem' }}>
                                                    {metric.formatted.replace('-', '')} 
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

                {/* Charts Row */}
                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, lg: 6 }}>
                        <MultiMetricQueryChart 
                            title="Revenue Goal, Est. Revenue and Act. Revenue by Date"
                            datasetName={DATASET_NAME}
                            groupBySegments={['Month']} 
                            metrics={[
                                { metricName: 'EstimatedRevenue', label: 'Revenue Goal', type: 'bar', color: chartColors.goal }, 
                                { metricName: 'AvgEstimatedRevenue', label: 'Est. Revenue', type: 'bar', color: chartColors.est }, 
                                { metricName: 'ActualRevenue', label: 'Act. Revenue', type: 'bar', color: chartColors.act } 
                            ]}
                            filters={FILTERS}
                            orientation="vertical"
                        />
                    </Grid>
                    <Grid size={{ xs: 12, lg: 6 }}>
                        <MultiMetricQueryChart 
                            title="Salesperson - Revenue Goal, Est. Revenue and Act. Revenue by Salesperson"
                            datasetName={DATASET_NAME}
                            groupBySegments={['SalesPerson']}
                            metrics={[
                                { metricName: 'EstimatedRevenue', label: 'Revenue Goal', type: 'bar', color: chartColors.goal }, 
                                { metricName: 'AvgEstimatedRevenue', label: 'Est. Revenue', type: 'bar', color: chartColors.est }, 
                                { metricName: 'ActualRevenue', label: 'Act. Revenue', type: 'bar', color: chartColors.act } 
                            ]}
                            filters={FILTERS}
                            orientation="vertical"
                        />
                    </Grid>
                </Grid>

                {/* Tables Row */}
                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, lg: 7 }}>
                         {loadingTables ? (
                             <Card sx={{ p: 2, height: '100%', minHeight: 400 }}>
                                 <Skeleton variant="rectangular" height={350} />
                             </Card>
                         ) : (
                            <DetailedMonthlyTable data={monthlyData} /> 
                         )}
                    </Grid>
                    <Grid size={{ xs: 12, lg: 5 }}>
                         {loadingTables ? (
                             <Card sx={{ p: 2, height: '100%', minHeight: 400 }}>
                                 <Skeleton variant="rectangular" height={350} />
                             </Card>
                         ) : (
                            <CustomerRevenueTable data={customerData} />
                         )}
                    </Grid>
                </Grid>
            </Stack>
        </Box>
    );
}
