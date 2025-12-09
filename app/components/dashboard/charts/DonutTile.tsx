'use client'

import formatter from '@/app/helpers/formatter';
import {
    Box
} from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import DonutChart from './DonutChart';
import ComparisonRow from '../ComparisonRow';

interface DonutTileProps {
    title: string;
    source: string;
    date_range: string;
    date_field: string;
    stat_field?: string;
    stat_value?: string;
    filter_extra?: string;
    buckets: string;
    locations: any[];
}

const DonutTile = (props: DonutTileProps) => {
    const {
        title,
        source,
        date_range,
        date_field,
        stat_field,
        stat_value,
        filter_extra,
        buckets,
        locations
    } = props;

    const value = stat_value || 'count';

    const [results, set_results] = useState<any>(null);

    useEffect(() => {
        const refresh_data = async () => {
            try {
                const res = await axios
                    .get('/api/v1/dashboard/data', {
                        params: {
                            source,
                            date_range,
                            date_field,
                            stat_field,
                            filter_extra,
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
                    return;
                }

                set_results(res.data);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
                // Set empty results to prevent crashes
                set_results({
                    aggregations: {}
                });
            }
        };

        refresh_data();
    }, [date_range, locations, source, date_field, stat_field, filter_extra, buckets]);

    if (!results) {
        return null;
    }

    let format_fn = (val: any) => formatter.with_commas(val, 0);
    let val_formatter = (value: number) => format_fn(value);

    switch (stat_field) {
        case 'total':
            format_fn = formatter.as_currency;
            val_formatter = (value: number) => formatter.as_currency(value);
            break;
    }

    const data: any[] = [];
    let primary_bucket: string | undefined;

    for (const bucket of buckets.split(',')) {
        if (!primary_bucket) {
            primary_bucket = bucket;
        }

        let radius = ['70%', '95%'];

        if (data.length > 0) {
            radius = ['50%', '70%'];
        }

        data.push({
            radius,
            data: (results.aggregations[bucket]?.buckets || [])
                .map((e: any) => {
                    return {
                        name: e.key,
                        value: e[value],
                    }
                })
        });
    }

    return (
        <Box sx={{ p: 2, alignItems: 'center' }}>
            <h3>{title}</h3>
            <DonutChart
                options={{
                    tooltip: {
                        trigger: 'item',
                        valueFormatter: val_formatter
                    },
                }}
                data={data}
                centered_element={
                    <Box>
                        <h3>{format_fn(results.aggregations[primary_bucket!]?.overall?.[value] || 0)}</h3>
                        <h4>Total</h4>
                    </Box>
                }
            />
            <ComparisonRow
                date_range={date_range}
                prev_change={results.aggregations[primary_bucket!]?.overall?.comparison?.prev?.[value] ?? 0}
                stack_change={results.aggregations[primary_bucket!]?.overall?.comparison?.stack?.[value] ?? 0}
            />
        </Box>
    )
};

export default DonutTile;
