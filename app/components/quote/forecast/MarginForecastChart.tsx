'use client';

import ReactECharts from 'echarts-for-react';

interface MarginForecastData {
    name: string;
    value: number; // Percentage
}

interface MarginForecastChartProps {
    data: MarginForecastData[];
}

export default function MarginForecastChart({ data }: MarginForecastChartProps) {
    const options = {
        title: {
            text: 'Margin Forecast % by Salesperson/Customer',
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
            left: '20%',
            right: '10%',
             bottom: '10%',
            containLabel: true
        },
        xAxis: {
            type: 'value',
            min: 0,
            max: 100,
            axisLabel: {
                show: false // No axis labels as per screenshot
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
                name: 'Margin',
                type: 'bar',
                data: data.map(item => item.value),
                itemStyle: {
                    color: '#00cbb5'
                },
                label: {
                    show: true,
                    position: 'inside',
                    formatter: '{c}%',
                    color: 'white',
                    fontWeight: 'bold'
                },
                barWidth: '60%',
                markLine: {
                    symbol: 'none',
                    data: [
                        { xAxis: 75, lineStyle: { color: 'grey', type: 'dashed' }, label: { formatter: '75.1%' } }
                    ]
                }
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
