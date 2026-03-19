'use client';

import ReactECharts from 'echarts-for-react';

interface ProfitForecastData {
    name: string;
    value: number;
}

interface ProfitForecastChartProps {
    data: ProfitForecastData[];
}

export default function ProfitForecastChart({ data }: ProfitForecastChartProps) {
    const options = {
        title: {
            text: 'Profit Forecast by Salesperson/Customer',
            left: 'center',
            textStyle: {
                color: 'white',
                fontSize: 14
            },
            backgroundColor: '#4dabf5', // lighter blue
            padding: 5,
            width: '100%',
        },
        grid: {
            left: '20%', // Adjust for long names
            right: '10%',
            bottom: '10%',
            containLabel: true
        },
        xAxis: {
            type: 'value',
            axisLabel: {
                formatter: (value: number) => `$${value / 1000000}M`
            },
           splitLine: { show: false }
        },
        yAxis: {
            type: 'category',
            data: data.map(item => item.name),
            axisTick: { show: false },
            axisLine: { show: false }
        },
        series: [
            {
                data: data.map(item => item.value),
                type: 'bar',
                itemStyle: {
                    color: '#00cbb5' // Teal color from screenshot
                },
                label: {
                    show: true,
                    position: 'right',
                    formatter: (params: any) => `$${(params.value / 1000000).toFixed(1)}M`,
                    color: 'white', // White text for inside bar or adjust if outside
                    fontWeight: 'bold'
                },
                 barWidth: '60%'
            }
        ]
    };

    return (
        <ReactECharts 
            option={options} 
            style={{ height: '300px', width: '100%' }} 
        />
    );
}
