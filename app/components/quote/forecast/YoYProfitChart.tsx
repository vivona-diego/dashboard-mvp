'use client';

import ReactECharts from 'echarts-for-react';

interface YoYChartDataPoint {
    month: string;
    profitPct: number;
}

interface YoYProfitChartProps {
    data: YoYChartDataPoint[];
}

export default function YoYProfitChart({ data }: YoYProfitChartProps) {
    const options = {
        title: {
            text: 'Profit % by Year, Quarter and Month',
            left: 10,
            top: 10,
            textStyle: {
                color: '#999',
                fontSize: 13,
                fontWeight: 'normal',
            },
        },
        tooltip: {
            trigger: 'axis',
            formatter: (params: any) => {
                const p = params[0];
                return `${p.name}<br/>Profit: ${p.value.toFixed(1)} %`;
            },
        },
        grid: {
            left: '5%',
            right: '5%',
            bottom: '15%',
            top: '18%',
            containLabel: true,
        },
        xAxis: {
            type: 'category',
            data: data.map((d) => d.month),
            boundaryGap: false,
            axisLabel: {
                fontSize: 11,
                color: '#999',
            },
            axisLine: { lineStyle: { color: '#e0e0e0' } },
            axisTick: { show: false },
            name: 'Year',
            nameLocation: 'center',
            nameGap: 30,
            nameTextStyle: { color: '#999', fontSize: 11 },
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                formatter: '{value} %',
                fontSize: 11,
                color: '#999',
            },
            splitLine: { lineStyle: { color: '#f0f0f0' } },
            axisLine: { show: false },
            axisTick: { show: false },
        },
        series: [
            {
                name: 'Profit %',
                type: 'line',
                data: data.map((d) => d.profitPct),
                smooth: false,
                symbol: 'circle',
                symbolSize: 6,
                lineStyle: {
                    color: '#00e5cc',
                    width: 2,
                },
                itemStyle: {
                    color: '#00e5cc',
                },
                areaStyle: undefined,
            },
        ],
    };

    return (
        <ReactECharts
            option={options}
            style={{ height: '400px', width: '100%' }}
        />
    );
}
