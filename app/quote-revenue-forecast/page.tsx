'use client';

import { Box, Stack, Typography, Grid } from '@mui/material';
import KPIGrid from '../components/dashboard/KPIGrid';
import MultiMetricQueryChart from '../components/dashboard/charts/MultiMetricQueryChart';

export default function QuoteRevenueForecastPage() {
  const datasetName = 'Quote_Revenue_Forecast';

    const theme = 'dark';
  const isDarkMode = theme === 'dark';
  
  const chartColors = isDarkMode ? {
      amount: '#818CF8', // Indigo 400
      count: '#FB923C'   // Orange 400
  } : {
      amount: '#1a237e', // Navy
      count: '#ff9800'   // Orange
  };

  return (
    <Box sx={{ minHeight: '100%', p: 3 }}>
        <Stack spacing={3}>
            <Box>
                <Typography variant="h5" fontWeight="bold" color="text.primary">
                    Quote Revenue Forecast Report
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                    Total Quoted Amount and Count
                </Typography>
            </Box>

            <Box>
                <KPIGrid 
                    datasetName={datasetName}
                    metrics={[
                        { metricName: 'TotalQuoteAmount', label: 'Total Quote Amount', format: 'currency' },
                        { metricName: 'QuoteCount', label: 'Quote Count', format: 'number' }
                    ]}
                />
            </Box>

            <Grid container spacing={3}>
                <Grid size={{ xs: 12 }}>
                    <MultiMetricQueryChart 
                        title="Quote Revenue Forecast"
                        datasetName={datasetName}
                        groupBySegments={['Month']} 
                        metrics={[
                            { metricName: 'TotalQuoteAmount', label: 'Total Amount', type: 'bar', color: chartColors.amount },
                            { metricName: 'QuoteCount', label: 'Count', type: 'line', color: chartColors.count }
                        ]}
                    />
                </Grid>
            </Grid>
        </Stack>
    </Box>
  );
}
