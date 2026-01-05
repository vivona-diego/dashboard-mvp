'use client';

import api from '@/app/api/axiosClient';
import { Box, Typography, CircularProgress } from '@mui/material';
import { useEffect, useState, useRef } from 'react';
import ReactECharts from 'echarts-for-react';
import formatter from '@/app/helpers/formatter';

interface MultiMetricQueryChartProps {
  title: string;
  datasetName: string;
  groupBySegments: string[]; 
  metrics: { metricName: string; label: string; type: 'bar' | 'line'; color?: string }[];
  filters?: Array<{ segmentName: string; operator: string; value?: any }>;
  orientation?: 'vertical' | 'horizontal'; // Add orientation
  manualData?: any[];
  loading?: boolean;
}

export default function MultiMetricQueryChart(props: MultiMetricQueryChartProps) {
  const { title, datasetName, groupBySegments, metrics, filters, orientation = 'vertical', manualData, loading: externalLoading } = props;

  const [results, set_results] = useState<any[]>([]);
  const [loading, set_loading] = useState(false);
  
  const effectiveLoading = externalLoading || loading;
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
     if (manualData) {
         set_results(manualData);
         return;
     }
    if (abortControllerRef.current) abortControllerRef.current.abort();

    const fetchData = async () => {
      // Mock data override block removed to enable dynamic fetching
      if (!datasetName || !groupBySegments.length) return;

      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      set_loading(true);
      try {
        const requestBody: any = {
          datasetName,
          groupBySegments,
          metrics: metrics.map(m => ({ metricName: m.metricName })),
          filters,
          orderBy: [{ field: groupBySegments[0], direction: 'ASC' }] // Default sort by X-axis
        };

        const res = await api.post('/bi/query', requestBody, { signal: abortController.signal });

        if (!abortController.signal.aborted) {
           if (res.data?.success && res.data?.data?.data) {
             set_results(res.data.data.data);
           } else {
             set_results([]);
           }
        }
      } catch (err: any) {
        if (!abortController.signal.aborted) {
            console.error(err);
        }
      } finally {
        if (!abortController.signal.aborted) set_loading(false);
      }
    };

    fetchData();
    return () => {
        if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, [datasetName, groupBySegments, metrics, filters, manualData]);

  if (effectiveLoading && results.length === 0) {
      return (
        <Box sx={{ p: 2, height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.paper', borderRadius: 2 }}>
            <CircularProgress />
        </Box>
      );
  }

  const xAxisField = groupBySegments[0];
  const xAxisData = results.map(row => row[xAxisField]);
  
  // Determine Axis based on orientation
  const isHorizontal = orientation === 'horizontal';
  
  const categoryAxis = {
      type: 'category',
      data: xAxisData,
      axisTick: { alignWithLabel: true },
      inverse: isHorizontal // Usually horizontal charts list top-down
  };
  
  const valueAxis = {
      type: 'value',
      axisLabel: {
          formatter: (value: number) => formatter.as_currency(value, true) // Using dense=true (3k, 3m) which is what as_currency_compact intended
      }
  };

  const series = metrics.map(m => ({
      name: m.label,
      type: m.type,
      data: results.map(row => row[m.metricName]),
      itemStyle: m.color ? { color: m.color } : undefined,
      label: {
          show: true,
          position: isHorizontal ? 'right' : 'top',
          formatter: (params: any) => formatter.as_currency(params.value, true) 
      }
  }));

  const options = {
      tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'shadow' },
          formatter: (params: any) => {
             let res = `<div>${params[0].axisValue}</div>`;
             params.forEach((item: any) => {
                 res += `<div>${item.marker} ${item.seriesName}: ${formatter.as_currency(item.value)}</div>`;
             });
             return res;
          }
      },
      legend: {
          bottom: 0,
          left: 'center'
      },
      grid: {
          left: '3%',
          right: '5%', // Increased right padding for horizontal value labels
          bottom: '10%',
          top: '10%',
          containLabel: true
      },
      xAxis: isHorizontal ? valueAxis : categoryAxis,
      yAxis: isHorizontal ? categoryAxis : valueAxis,
      series: series
  };

  return (
    <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 2, boxShadow: '0 1px 3px 0 rgba(0,0,0,0.1)', height: '100%' }}>
       <Typography variant="h6" fontWeight="bold" gutterBottom>
           {title}
       </Typography>
       <ReactECharts option={options} style={{ height: '400px', width: '100%' }} />
    </Box>
  );
}
