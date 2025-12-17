'use client';

import api from '@/app/api/axiosClient';
import BarChart from './BarChart';
import DonutChart from './DonutChart';
import formatter from '@/app/helpers/formatter';
import { Box, Typography, CircularProgress } from '@mui/material';
import { useEffect, useState, useRef } from 'react';

interface QueryChartProps {
  title: string;
  datasetName: string;
  groupBySegments: string[];
  metricName: string;
  chartType: 'bar' | 'donut';
  filters?: Array<{ segmentName: string; operator: string }>;
  onPersonClick?: (personName: string) => void;
  onTitleClick?: () => void;
}

const QueryChart = (props: QueryChartProps) => {
  const { title, datasetName, groupBySegments, metricName, chartType, filters, onPersonClick, onTitleClick } = props;

  const [results, set_results] = useState<any[]>([]);
  const [loading, set_loading] = useState(false);
  const [error, set_error] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    // Cancel previous request if it exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const fetchData = async () => {
      // Validate that we have all required data before making the request
      if (
        !datasetName ||
        !groupBySegments ||
        groupBySegments.length === 0 ||
        groupBySegments.some((seg) => !seg || seg.trim() === '')
      ) {
        set_results([]);
        set_error(null);
        set_loading(false);
        return;
      }

      // Create new AbortController for this request
      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      set_loading(true);
      set_error(null);
      try {
        const requestBody: any = {
          datasetName,
          groupBySegments,
          metrics: [{ metricName }],
          useCache: true,
        };

        // Add filters if provided
        if (filters && filters.length > 0) {
          requestBody.filters = filters;
        }

        const res = await api.post('/bi/query', requestBody, {
          signal: abortController.signal,
        });

        // Check if request was aborted
        if (abortController.signal.aborted) {
          return;
        }

        if (res.data?.success && res.data?.data?.data) {
          set_results(res.data.data.data);
        } else {
          set_error('Invalid response format');
          set_results([]);
        }
      } catch (err: any) {
        // Don't set error if request was aborted
        if (err.name === 'AbortError' || err.name === 'CanceledError') {
          return;
        }
        console.error('Error fetching query data:', err);
        set_error(err.response?.data?.message || err.message || 'Failed to fetch data');
        set_results([]);
      } finally {
        // Only update loading state if this request wasn't aborted
        if (!abortController.signal.aborted) {
          set_loading(false);
        }
      }
    };

    fetchData();

    // Cleanup function
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [datasetName, groupBySegments, metricName, filters]);

  if (loading) {
    return (
      <Box
        sx={{
          p: 2,
          height: '100%',
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 300,
        }}
      >
        <CircularProgress />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Loading...
        </Typography>
      </Box>
    );
  }

  if (error || results.length === 0) {
    return (
      <Box
        sx={{
          p: 2,
          height: '100%',
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 300,
        }}
      >
        <Typography variant="body2" color="error">
          {error || 'No data available'}
        </Typography>
      </Box>
    );
  }

  const segmentName = groupBySegments[0];
  const labels = results.map((row) => row[segmentName] || '');
  const values = results.map((row) => row[metricName] || 0);

  const format_fn = (val: any) => formatter.with_commas(val, 0);
  const val_formatter = (value: number) => format_fn(value);

  if (chartType === 'bar') {
    const series = [
      {
        name: metricName,
        type: 'bar',
        emphasis: { focus: 'series' },
        data: values,
      },
    ];

    return (
      <Box
        sx={{
          p: 2,
          height: '100%',
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Typography
          variant="h6"
          fontWeight="bold"
          color="text.primary"
          gutterBottom
          onClick={onTitleClick}
          sx={{
            cursor: onTitleClick ? 'pointer' : 'default',
            '&:hover': onTitleClick
              ? {
                  color: 'primary.main',
                  textDecoration: 'underline',
                }
              : {},
            transition: 'color 0.2s, text-decoration 0.2s',
          }}
        >
          {title}
        </Typography>
        <Box sx={{ flex: 1, minHeight: 0 }}>
          <BarChart
            options={{
              grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true,
              },
              tooltip: {
                trigger: 'axis',
                valueFormatter: val_formatter,
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                borderColor: '#e5e7eb',
                textStyle: {
                  color: '#374151',
                },
              },
            }}
            labels={labels}
            data={series}
            onBarClick={onPersonClick}
          />
        </Box>
      </Box>
    );
  }

  // Donut chart
  const donutValues = labels.map((label, index) => ({
    name: label,
    value: values[index],
  }));

  const donutSeries = [
    {
      radius: ['55%', '75%'],
      data: donutValues,
    },
  ];

  const total = values.reduce((a, b) => a + b, 0).toFixed(2);

  return (
    <Box
      sx={{
        p: 2,
        height: '100%',
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Typography
        variant="h6"
        fontWeight="bold"
        color="text.primary"
        gutterBottom
        onClick={onTitleClick}
        sx={{
          cursor: onTitleClick ? 'pointer' : 'default',
          '&:hover': onTitleClick
            ? {
                color: 'primary.main',
                textDecoration: 'underline',
              }
            : {},
          transition: 'color 0.2s, text-decoration 0.2s',
        }}
      >
        {title}
      </Typography>
      <Box sx={{ flex: 1, minHeight: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <DonutChart
          options={{
            tooltip: {
              trigger: 'item',
              valueFormatter: val_formatter,
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              borderColor: '#e5e7eb',
              textStyle: {
                color: '#374151',
              },
            },
            legend: {
              bottom: 0,
              left: 'center',
              icon: 'circle',
              type: 'scroll',
            },
          }}
          data={donutSeries}
          centered_element={
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h5" fontWeight="bold" color="text.primary">
                {format_fn(total)}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase' }}>
                Total
              </Typography>
            </Box>
          }
          chartPosition={['50%', '40%']}
          onSliceClick={onPersonClick}
        />
      </Box>
    </Box>
  );
};

export default QueryChart;
