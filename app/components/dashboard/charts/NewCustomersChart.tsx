'use client'

import DonutChart from './DonutChart';
import ComparisonRow from '../ComparisonRow';
import { DarkBox } from '@/app/components/themed';
import formatter from '@/app/helpers/formatter';
import {
    Box
} from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';

interface NewCustomersChartProps {
    date_range: string;
    locations: any[];
    buckets: string;
}

const NewCustomersChart = (props: NewCustomersChartProps) => {
    const { date_range, locations, buckets } = props;
    const [results, set_results] = useState<any>(null);

    useEffect(() => {
        const refresh_data = async () => {
            try {
                const res = await axios
                    .get('/api/v1/dashboard/data', {
                        params: {
                            source: 'customers',
                            date_range,
                            date_field: 'original_signup',
                            buckets,
                            include_comparisons: true,
                            filter_locations: locations
                                .filter(location => location.checked)
                                .map(location => location.location_id)
                                .join(','),
                            filter_routes: locations
                                .filter(location => location.checked)
                                .reduce((a, c) => a.concat(
                                    c.routes
                                        .filter((route: any) => route.checked)
                                        .map((route: any) => route.route_id)
                                ), [])
                                .join(','),
                        }
                    });

                if (res.status >= 400) {
                    console.error('Dashboard API failed:', res.status, res.statusText);
                    set_results({
                        aggregations: {
                            global: { overall: { count: { value: 0 }, sum: { value: 0 }, avg: { value: 0 } } },
                            global_prev: { overall: { count: { value: 0 }, sum: { value: 0 }, avg: { value: 0 } } }
                        }
                    });
                    return;
                }

                set_results(res.data);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
                set_results({
                    aggregations: {
                        global: { overall: { count: { value: 0 }, sum: { value: 0 }, avg: { value: 0 } } },
                        global_prev: { overall: { count: { value: 0 }, sum: { value: 0 }, avg: { value: 0 } } }
                    }
                });
            }
        };

        refresh_data();
    }, [date_range, locations, buckets]);

    if (!results) {
        return null;
    }

    return (
        <DarkBox sx={{ p: 2, alignItems: 'center' }}>
            <h3>New Customers by Store/Route</h3>
            <DonutChart
                data={[
                    {
                        radius: ['70%', '95%'],
                        data: (results.aggregations.locations?.buckets || [])
                            .map((e: any) => {
                                return {
                                    name: e.key,
                                    value: e.count,
                                }
                        })
                    },
                    {
                        radius: ['50%', '70%'],
                        data: (results.aggregations.routes?.buckets || [])
                            .filter((e: any) => e.key !== 'Retail')
                            .map((e: any) => {
                                return {
                                    name: e.key,
                                    value: e.count,
                                }
                        })
                    }
                ]}
                centered_element={
                    <Box>
                        <h2>{formatter.with_commas(results.aggregations.locations?.overall?.count || 0, 0)}</h2>
                        <h4>Total</h4>
                    </Box>
                }
            />
            <ComparisonRow
                date_range={date_range}
                prev_change={results.aggregations.locations?.overall?.comparison?.prev?.count || 0}
                stack_change={results.aggregations.locations?.overall?.comparison?.stack?.count || 0}
            />
        </DarkBox>
    )
};

export default NewCustomersChart;
