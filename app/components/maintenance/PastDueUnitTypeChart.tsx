'use client';

import ReactECharts from 'echarts-for-react';
import { Box, Typography, useTheme } from '@mui/material';

interface ChartData {
  name: string;
  value: number;
}

export default function PastDueUnitTypeChart({ data = [] }: { data?: ChartData[] }) {
  const theme = useTheme();

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      top: '10%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: data.map(d => d.name),
      axisLabel: {
        fontSize: 10,
        color: theme.palette.text.secondary,
        interval: 0,
      },
      axisLine: {
        lineStyle: {
          color: theme.palette.divider,
        }
      },
      name: 'Unit Type',
      nameLocation: 'middle',
      nameGap: 30,
      nameTextStyle: {
         fontSize: 12,
         color: theme.palette.text.secondary,
         fontWeight: 'bold'
      }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        fontSize: 11,
        color: theme.palette.text.secondary,
      },
      name: 'Past Due Units',
      nameLocation: 'middle',
      nameGap: 25,
      nameTextStyle: {
         fontSize: 12,
         color: theme.palette.text.secondary,
         fontWeight: 'bold'
      },
      splitLine: {
        lineStyle: {
          color: theme.palette.divider,
          type: 'dashed'
        }
      }
    },
    series: [
      {
        name: 'Past Due Units',
        type: 'bar',
        data: data.map(d => d.value),
        barWidth: '60%',
        itemStyle: {
          color: '#E57373', // Red/Pink from screenshot
        },
        label: {
            show: true,
            position: 'top',
            color: theme.palette.text.secondary,
            fontSize: 10
        }
      }
    ]
  };

  return (
    <Box sx={{ width: '100%', height: '100%', bgcolor: 'background.paper', borderRadius: 2, overflow: 'hidden' }}>
      {/* Header Strip */}
      <Box sx={{ 
        bgcolor: '#CFD8DC', 
        py: 0.5, 
        px: 2, 
        mb: 2, 
        display: 'flex',
        justifyContent: 'center'
      }}>
        <Typography variant="subtitle2" sx={{ color: '#455A64', fontSize: '0.8rem' }}>
          Past Due Unit Activities by Unit Type
        </Typography>
      </Box>
      <Box sx={{ px: 2 }}>
        <ReactECharts option={option} style={{ height: 320 }} />
      </Box>
    </Box>
  );
}
