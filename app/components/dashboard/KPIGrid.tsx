'use client';

import { Card, CardContent, CircularProgress, Grid, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import api from '@/app/api/axiosClient';
import formatter from '@/app/helpers/formatter';

interface MetricConfig {
  metricName: string;
  label: string; // Display name
  format?: 'currency' | 'currency_dense' | 'number' | 'percent';
  highlightNegative?: boolean; // If true, negative values will be red
}

interface KPIGridProps {
  datasetName: string;
  metrics: MetricConfig[];
  filters?: Array<{ segmentName: string; operator: string; value?: any }>;
  manualData?: Record<string, number>;
  loading?: boolean;
  gridSize?: { xs?: number; sm?: number; md?: number; lg?: number; xl?: number }; // Optional grid sizing
}

export default function KPIGrid({ datasetName, metrics, filters, manualData, loading: externalLoading, gridSize }: KPIGridProps) {
  const [data, setData] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false); // internal loading
  const effectiveLoading = externalLoading || loading;

  useEffect(() => {
    if (manualData) {
        setData(manualData);
        return;
    }
    const fetchKPIs = async () => {
        // Mock data override block removed


      setLoading(true);
      try {
        const uniqueMetrics = Array.from(new Set(metrics.map(m => m.metricName)));
        const requestBody = {
            datasetName,
            metrics: uniqueMetrics.map(name => ({ metricName: name })),
            filters: filters
        };

        const res = await api.post('/bi/kpis', requestBody);
        
        if (res.data?.success && res.data?.data) {
             const resultData: Record<string, number> = {};
             if (Array.isArray(res.data.data)) {
                 res.data.data.forEach((item: any) => {
                     resultData[item.metricName] = item.value;
                 });
             } else {
                 Object.assign(resultData, res.data.data);
             }
             setData(resultData);
        } else {
            console.warn('Unexpected KPI response:', res.data);
        }
      } catch (err) {
        console.error('Error fetching KPIs:', err);
        // Fallback to mock if API fails significantly
      } finally {
        setLoading(false);
      }
    };

    fetchKPIs();
  }, [datasetName, metrics, filters]);

  const formatValue = (value: number, format?: string) => {
      if (value === undefined || value === null) return '-';
      if (format === 'currency') return formatter.as_currency(value, false); 
      if (format === 'currency_dense') return formatter.as_currency(value, true); 
      if (format === 'percent') return `${value.toFixed(1)} %`; 
      return formatter.with_commas(value, 0); // Corrected: with_commas takes 2 args
  };

  const getColor = (value: number, config: MetricConfig) => {
      if (config.highlightNegative && value < 0) return 'error.main';
      return 'text.primary';
  };

  return (
    <Grid container spacing={3}>
      {metrics.map((metric) => {
        const value = data[metric.metricName];
        
        return (
            <Grid key={metric.label} size={gridSize || { xs: 12, sm: 6, md: 2 }}> 
                <Card elevation={0} sx={{ bgcolor: 'background.paper', height: '100%', borderRadius: 2, boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)' }}>
                     <CardContent sx={{ p: '16px !important', textAlign: 'center' }}>
                          <Typography variant="h5" fontWeight="bold" sx={{ color: getColor(value, metric), fontSize: '1.5rem' }}>
                             {effectiveLoading ? <CircularProgress size={20} /> : (
                                <>
                                    {metric.highlightNegative && value < 0 && '('} 
                                    {formatValue(Math.abs(value), metric.format)}
                                    {metric.highlightNegative && value < 0 && ')'}
                                </>
                            )}
                         </Typography>
                         <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                            {metric.label}
                         </Typography>
                    </CardContent>
                </Card>
            </Grid>
        );
      })}
    </Grid>
  );
}
