'use client';

import ReactECharts from 'echarts-for-react';
import { Box, Typography, useTheme } from '@mui/material';

interface ChartData {
  name: string;
  value: number;
}

const MOCK_DATA: ChartData[] = [
  { name: 'Annual Vehicle Inspection...', value: 9 }, // 39.13%
  { name: 'Annual Crane Inspection', value: 6 }, // 26.09%
  { name: '300 Hr. Service - Lower', value: 3 }, // 13.04%
  { name: 'Trailer Service', value: 3 }, // 13.04%
  { name: 'Maintenance Service', value: 2 }, // 8.7%
];

export default function PastDueActivitiesPieChart() {
  const theme = useTheme();

  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      right: '5%',
      top: 'middle',
      icon: 'circle',
      itemWidth: 10,
      textStyle: {
        fontSize: 11,
        color: theme.palette.text.secondary,
      }
    },
    title: {
       text: 'Maintenance Activity',
       right: '5%',
       top: '25%',
       textStyle: {
         fontSize: 12,
         fontWeight: 'normal',
         color: theme.palette.text.secondary
       }
    },
    series: [
      {
        name: 'Maintenance Activity',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['40%', '50%'],
        avoidLabelOverlap: true,
        label: {
          show: true,
          position: 'outside',
          formatter: '{c} ({d}%)',
          color: theme.palette.text.secondary,
          fontSize: 10
        },
        labelLine: {
          show: true,
          length: 10,
          length2: 10
        },
        data: MOCK_DATA,
        itemStyle: {
           borderColor: '#fff',
           borderWidth: 2
        },
        color: [
            '#2196F3', // Light Blue
            '#1A237E', // Dark Blue
            '#E65100', // Orange
            '#6A1B9A', // Purple
            '#E91E63'  // Pink
        ]
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
          Past Due Units by Maintenance Activity
        </Typography>
      </Box>
      <Box sx={{ px: 2 }}>
        <ReactECharts option={option} style={{ height: 260 }} />
      </Box>
    </Box>
  );
}
