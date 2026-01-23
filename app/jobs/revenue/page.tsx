'use client';

import { Box, Stack, Typography, Grid } from '@mui/material';
import { useState } from 'react';
import KPIGrid from '../../components/dashboard/KPIGrid';
import SegmentSelector from '../../components/dashboard/SegmentSelector';
import MultiMetricQueryChart from '../../components/dashboard/charts/MultiMetricQueryChart';
import DetailedMonthlyTable, { MonthlyDetailedData } from '../../components/dashboard/DetailedMonthlyTable';
import CustomerRevenueTable, { CustomerRevenueData } from '../../components/dashboard/CustomerRevenueTable';

const DATASET_NAME = 'Job_Revenue_Forecast';

export default function JobsRevenueForecastReportPage() {

    // Filter States
    const [company, setCompany] = useState<string | null>('J. J. Curran Crane Company');
    const [yard, setYard] = useState<string | null>('All');
    const [year, setYear] = useState<string | null>('2025');

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

    // Manual Data - MOCK to match image
    const kpiData = {
        'RevenueGoal': 13000000,
        'EstRevenue': 8000000,
        'ActRevenue': 9000000,
        'HighConfQuote': 19000,
        'TotalEst': 8000000,
        'TotalCustomers': 232,
        'TotalJobs': 868
    };

    const monthlyData: MonthlyDetailedData[] = [
        { month: 'Jan', revenueGoal: 900000, estRevenue: 515181, highConfQuote: 0, totalEst: 515181, actRevenue: 577121, cumulativeTotEst: 515181, cumulativeAct: 577121 },
        { month: 'Feb', revenueGoal: 1000000, estRevenue: 641958, highConfQuote: 0, totalEst: 641958, actRevenue: 784844, cumulativeTotEst: 1157139, cumulativeAct: 1361964 },
        { month: 'Mar', revenueGoal: 1000000, estRevenue: 790300, highConfQuote: 18753, totalEst: 809053, actRevenue: 915811, cumulativeTotEst: 1966192, cumulativeAct: 2277775 },
        { month: 'Apr', revenueGoal: 1100000, estRevenue: 708667, highConfQuote: 0, totalEst: 708667, actRevenue: 910329, cumulativeTotEst: 2674859, cumulativeAct: 3188104 },
        { month: 'May', revenueGoal: 1200000, estRevenue: 525593, highConfQuote: 0, totalEst: 525593, actRevenue: 744447, cumulativeTotEst: 3200452, cumulativeAct: 3932551 },
        { month: 'Jun', revenueGoal: 1200000, estRevenue: 528260, highConfQuote: 0, totalEst: 528260, actRevenue: 639613, cumulativeTotEst: 3728712, cumulativeAct: 4572164 },
        { month: 'Jul', revenueGoal: 1200000, estRevenue: 619708, highConfQuote: 0, totalEst: 619708, actRevenue: 728738, cumulativeTotEst: 4348420, cumulativeAct: 5300902 },
        { month: 'Aug', revenueGoal: 1200000, estRevenue: 774315, highConfQuote: 0, totalEst: 774315, actRevenue: 807833, cumulativeTotEst: 5122735, cumulativeAct: 6108735 },
        { month: 'Sep', revenueGoal: 1200000, estRevenue: 720917, highConfQuote: 0, totalEst: 720917, actRevenue: 916421, cumulativeTotEst: 5843652, cumulativeAct: 7025156 },
        { month: 'Oct', revenueGoal: 1200000, estRevenue: 930274, highConfQuote: 0, totalEst: 930274, actRevenue: 945417, cumulativeTotEst: 6773926, cumulativeAct: 7970573 },
        { month: 'Nov', revenueGoal: 1100000, estRevenue: 512217, highConfQuote: 0, totalEst: 512217, actRevenue: 437645, cumulativeTotEst: 7286143, cumulativeAct: 8408218 },
        { month: 'Dec', revenueGoal: 1000000, estRevenue: 567250, highConfQuote: 0, totalEst: 567250, actRevenue: 454798, cumulativeTotEst: 7853392, cumulativeAct: 8863016 },
    ];

    const customerData: CustomerRevenueData[] = [
        { customerName: 'Mid-American Group', estRevenue: 710576, highConfQuote: 0, totalEst: 710576, actRevenue: 780732 },
        { customerName: 'Barton Malow', estRevenue: 545425, highConfQuote: 0, totalEst: 545425, actRevenue: 1042390 },
        { customerName: 'Songer Steel Services', estRevenue: 330967, highConfQuote: 0, totalEst: 330967, actRevenue: 378410 },
        { customerName: 'Connelly, L W & Son Inc', estRevenue: 278031, highConfQuote: 0, totalEst: 278031, actRevenue: 269237 },
        { customerName: 'Kaiser Industrial', estRevenue: 255152, highConfQuote: 0, totalEst: 255152, actRevenue: 202174 },
        { customerName: 'Jay Dee Contractors Inc.', estRevenue: 240787, highConfQuote: 0, totalEst: 240787, actRevenue: 250607 },
        { customerName: 'Nicholson Terminal & Dock', estRevenue: 215986, highConfQuote: 0, totalEst: 215986, actRevenue: 248174 },
        { customerName: 'Detroit Edison - Fermi', estRevenue: 205976, highConfQuote: 0, totalEst: 205976, actRevenue: 222080 },
        { customerName: 'Ideal Contracting', estRevenue: 200599, highConfQuote: 0, totalEst: 200599, actRevenue: 167187 },
    ];

    // Chart Data Transformation
    // Grouped Bar: Month, Est, Act, Goal
    const revenueByDateChartData = monthlyData.map(d => ({
        Month: d.month,
        RevenueGoal: d.revenueGoal,
        EstimatedRevenue: d.estRevenue,
        ActualRevenue: d.actRevenue
    }));
    
    // Salesperson Chart Data (Mock)
    const salespersonChartData = [
        { Salesperson: 'Matt McVittie', RevenueGoal: 7600000, EstimatedRevenue: 2600000, ActualRevenue: 2900000 },
        { Salesperson: 'Trever Weber', RevenueGoal: 2700000, EstimatedRevenue: 2300000, ActualRevenue: 2400000 },
        { Salesperson: 'Chad McComas', RevenueGoal: 1700000, EstimatedRevenue: 2600000, ActualRevenue: 3300000 },
        { Salesperson: 'Brogan Roback', RevenueGoal: 1000000, EstimatedRevenue: 300000, ActualRevenue: 300000 },
    ];

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
                                segments={['J. J. Curran Crane Company']} // Mock
                                selectedSegment={company} 
                                onSelect={setCompany}
                                label=''
                            />
                        </Box>
                        <Box>
                            <Typography variant="caption" display="block" color="text.secondary" mb={0.5}>Select a Yard</Typography>
                            <SegmentSelector 
                                segments={['All', 'Detroit', 'Toledo']} 
                                selectedSegment={yard} 
                                onSelect={setYard}
                                label=''
                            />
                        </Box>
                        <Box>
                             {/* Year Selector styled as toggle buttons in image, but using dropdown for now as placeholder */}
                             <Typography variant="caption" display="block" color="text.secondary" mb={0.5}>Year</Typography>
                             <SegmentSelector 
                                segments={['2025', '2024', '2023']} 
                                selectedSegment={year} 
                                onSelect={setYear}
                                label=''
                            />
                        </Box>
                    </Box>
                </Box>

                {/* KPI Grid */}
                <Box>
                    <KPIGrid 
                        datasetName={DATASET_NAME}
                        metrics={[
                            { metricName: 'RevenueGoal', label: 'Revenue Goal', format: 'currency' },
                            { metricName: 'EstRevenue', label: 'Est. Revenue', format: 'currency' },
                            { metricName: 'ActRevenue', label: 'Act. Revenue', format: 'currency' },
                            { metricName: 'HighConfQuote', label: 'High Conf Quote', format: 'currency' },
                            { metricName: 'TotalEst', label: 'Total Est.', format: 'currency' },
                            { metricName: 'TotalCustomers', label: 'Total Customers', format: 'number' },
                            { metricName: 'TotalJobs', label: 'Total Jobs', format: 'number' }
                        ]}
                        manualData={kpiData}
                        gridSize={{ xs: 12, sm: 6, md: 1.7 }} // Custom sizing to fit 7 items roughly 
                    />
                </Box>

                {/* Charts Row */}
                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, lg: 6 }}>
                        <MultiMetricQueryChart 
                            title="Revenue Goal, Est. Revenue and Act. Revenue by Date"
                            datasetName={DATASET_NAME}
                            groupBySegments={['Month']} 
                            metrics={[
                                { metricName: 'RevenueGoal', label: 'Revenue Goal', type: 'bar', color: chartColors.goal }, 
                                { metricName: 'EstimatedRevenue', label: 'Est. Revenue', type: 'bar', color: chartColors.est }, 
                                { metricName: 'ActualRevenue', label: 'Act. Revenue', type: 'bar', color: chartColors.act } 
                            ]}
                            orientation="vertical"
                            manualData={revenueByDateChartData}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, lg: 6 }}>
                        <MultiMetricQueryChart 
                            title="Salesperson - Revenue Goal, Est. Revenue and Act. Revenue by Salesperson"
                            datasetName={DATASET_NAME}
                            groupBySegments={['Salesperson']}
                            metrics={[
                                { metricName: 'RevenueGoal', label: 'Revenue Goal', type: 'bar', color: chartColors.goal }, 
                                { metricName: 'EstimatedRevenue', label: 'Est. Revenue', type: 'bar', color: chartColors.est }, 
                                { metricName: 'ActualRevenue', label: 'Act. Revenue', type: 'bar', color: chartColors.act } 
                            ]}
                            orientation="vertical"
                             manualData={salespersonChartData}
                        />
                    </Grid>
                </Grid>

                {/* Tables Row */}
                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, lg: 7 }}>
                        <DetailedMonthlyTable data={monthlyData} />
                    </Grid>
                    <Grid size={{ xs: 12, lg: 5 }}>
                         <CustomerRevenueTable data={customerData} />
                    </Grid>
                </Grid>
            </Stack>
        </Box>
    );
}
