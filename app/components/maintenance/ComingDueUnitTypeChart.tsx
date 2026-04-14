'use client';

import ReactECharts from 'echarts-for-react';
import { Box, Typography, useTheme } from '@mui/material';

interface ChartData {
  name: string;
  value: number;
}

const MOCK_DATA: ChartData[] = [
  { name: 'Truck', value: 21 },
  { name: 'Trailer', value: 14 },
  { name: '35 Ton RT Class', value: 4 },
  { name: '50 Ton Mobilift', value: 4 },
  { name: 'Gas Detector', value: 4 },
  { name: '15 Ton Carry...', value: 3 },
  { name: '50 Ton RT Class', value: 3 },
  { name: '80 Ton AT Class', value: 3 },
  { name: '8k telescopic...', value: 3 },
  { name: '115 Ton Truck...', value: 2 },
  { name: '330 ton crawler', value: 2 },
  { name: '45 Ton RT Class', value: 2 },
  { name: '65 ton RT', value: 2 },
  { name: '75 Ton RT', value: 2 },
  { name: '155 Ton AT CL...', value: 1 },
  { name: '175 Ton AT CL...', value: 1 },
  { name: '18 Ton Carry...', value: 1 },
  { name: '23 Ton BT Class', value: 1 },
];

export default function ComingDueUnitTypeChart() {
  const theme = useTheme();

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' }
    },
    grid: {
      left: '3%',
      right: '2%',
      bottom: '25%',
      top: '10%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: MOCK_DATA.map(d => d.name),
      axisLabel: {
        fontSize: 9,
        color: theme.palette.text.secondary,
        interval: 0,
        rotate: 90
      },
      axisLine: {
        lineStyle: {
          color: theme.palette.divider,
        }
      },
      name: 'Unit Type',
      nameLocation: 'middle',
      nameGap: 60,
      nameTextStyle: {
         fontSize: 11,
         color: theme.palette.text.secondary,
         fontWeight: 'bold'
      }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        fontSize: 10,
        color: theme.palette.text.secondary,
      },
      name: 'Coming Due Units',
      nameLocation: 'middle',
      nameGap: 25,
      nameTextStyle: {
         fontSize: 11,
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
        name: 'Coming Due Units',
        type: 'bar',
        data: MOCK_DATA.map(d => d.value),
        barWidth: '70%',
        itemStyle: {
          color: '#E57373', // Red/Pink from screenshot
        },
        label: {
            show: true,
            position: 'top',
            color: theme.palette.text.secondary,
            fontSize: 9
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
          Coming Due Unit Activities by Unit Type
        </Typography>
      </Box>
      <Box sx={{ px: 2 }}>
        <ReactECharts option={option} style={{ height: 350 }} />
      </Box>
    </Box>
  );
}
