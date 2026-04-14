'use client';

import ReactECharts from 'echarts-for-react';
import { Box, Typography, useTheme } from '@mui/material';

export default function WOSummaryChart() {
  const theme = useTheme();

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      }
    },
    legend: {
      data: ['Total WO Amount', 'Total WO Amount PY', 'Total WO', 'Total WO PY'],
      top: 0,
      left: 'left',
      icon: 'circle',
      itemWidth: 10,
      textStyle: {
        fontSize: 10,
        color: theme.palette.text.secondary,
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '10%',
      top: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['Jan'],
      axisLabel: {
        fontSize: 11,
        color: theme.palette.text.secondary,
      },
      axisLine: {
        lineStyle: {
          color: theme.palette.divider,
        }
      },
      name: 'Month',
      nameLocation: 'middle',
      nameGap: 30
    },
    yAxis: [
      {
        type: 'value',
        name: 'Total WO Amount and Total WO...',
        nameLocation: 'middle',
        nameGap: 45,
        axisLabel: {
          formatter: '${value}K',
          fontSize: 10,
          color: theme.palette.text.secondary,
        },
        splitLine: {
          lineStyle: {
            color: theme.palette.divider,
            type: 'dashed'
          }
        }
      },
      {
        type: 'value',
        name: 'Total WO and Total WO PY',
        nameLocation: 'middle',
        nameGap: 40,
        min: 23,
        max: 26,
        interval: 1,
        axisLabel: {
          fontSize: 10,
          color: theme.palette.text.secondary,
        },
        splitLine: {
          show: false
        }
      }
    ],
    series: [
      {
        name: 'Total WO Amount',
        type: 'bar',
        data: [22],
        barWidth: '25%',
        itemStyle: {
          color: '#2196F3', // Light Blue
        }
      },
      {
        name: 'Total WO Amount PY',
        type: 'bar',
        data: [36],
        barWidth: '25%',
        itemStyle: {
          color: '#1A237E', // Dark Blue
        }
      },
      {
        name: 'Total WO',
        type: 'scatter',
        yAxisIndex: 1,
        symbolSize: 10,
        data: [23],
        itemStyle: {
          color: '#FF7043', // Orange/Red
        }
      },
      {
        name: 'Total WO PY',
        type: 'scatter',
        yAxisIndex: 1,
        symbolSize: 10,
        data: [26],
        itemStyle: {
          color: '#6A1B9A', // Purple
        }
      }
    ]
  };

  return (
    <Box sx={{ width: '100%', height: '100%', bgcolor: 'background.paper', p: 2 }}>
      <Box sx={{ 
        display: 'flex',
        justifyContent: 'center',
        mb: 2
      }}>
        <Typography variant="caption" sx={{ color: '#00BCD4', fontWeight: 'bold', fontSize: '0.75rem' }}>
          WO Volume Trend Current Year Vs. Previous Year
        </Typography>
      </Box>
      <ReactECharts option={option} style={{ height: '350px' }} />
    </Box>
  );
}
