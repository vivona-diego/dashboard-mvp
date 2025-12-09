'use client'

import BarChart from './BarChart';
import formatter from '@/app/helpers/formatter';
import {
    Box
} from '@mui/material';
import axios from 'axios';
import { DateTime } from 'luxon';
import { useEffect, useMemo, useState } from 'react';

interface BarTileProps {
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

const BarTile = (props: BarTileProps) => {
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

    const [/* ready */, set_ready] = useState(false);
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
                    set_results({
                        aggregations: {
                            global: { overall: { count: { value: 0 }, sum: { value: 0 }, avg: { value: 0 } } },
                            global_prev: { overall: { count: { value: 0 }, sum: { value: 0 }, avg: { value: 0 } } }
                        }
                    });
                    set_ready(true);
                    return;
                }

                set_results(res.data);
                set_ready(true);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
                set_results({
                    aggregations: {
                        global: { overall: { count: { value: 0 }, sum: { value: 0 }, avg: { value: 0 } } },
                        global_prev: { overall: { count: { value: 0 }, sum: { value: 0 }, avg: { value: 0 } } }
                    }
                });
                set_ready(true);
            }
        };

        set_ready(false);
        refresh_data();
    }, [date_range, locations, source, date_field, stat_field, filter_extra, buckets]);

    const content = useMemo(() => {
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

        let labels: any[] = [];
        const data: any[] = [];
        let primary_bucket: string | undefined;

        for (const bucket of buckets.split(',')) {
            if (!primary_bucket) {
                primary_bucket = bucket;

                const date_buckets = [
                    'hour',
                    'day',
                    'week',
                    'month',
                    'year',
                ];

                if (date_buckets.includes(bucket)) {
                    labels = (results.aggregations[bucket]?.buckets || [])
                        .map((row: any) => {
                            const date = DateTime
                                .fromISO(row.key, { setZone: true });
                            
                            let dateStr = '';

                            switch (bucket) {
                                case 'hour':
                                    dateStr = date
                                        .toFormat('h a');
                                    break;
                                case 'day':
                                case 'week':
                                    dateStr = date
                                        .toFormat('M/d');
                                    break;
                                case 'month':
                                    dateStr = date
                                        .toFormat('MMMM');
                                    break;
                                case 'year':
                                    dateStr = date
                                        .toFormat('yyyy');
                                    break;
                                default:
                                    dateStr = date
                                        .toLocaleString(DateTime.DATE_SHORT);
                            }

                            return dateStr;
                        });
                } else {
                    labels = (results.aggregations[bucket]?.buckets || [])
                        .map((row: any) => row.key)
                }
            }

            data.push({
                name: 'Sales',
                type: 'bar',
                emphasis: {
                    focus: 'series',
                },
                data: (results.aggregations[bucket]?.buckets || [])
                    .map((row: any) => row[value])
            });
        }

        return (
            <Box sx={{ p: 2, alignItems: 'center' }}>
                <h3>{title}</h3>
                <BarChart
                    options={{
                        tooltip: {
                            trigger: 'item',
                            valueFormatter: val_formatter
                        },
                    }}
                    labels={labels}
                    data={data}
                />
            </Box>
        )
    }, [results, buckets, stat_field, title, value]);

    if (!results) {
        return null;
    }

    return content;
};

export default BarTile;
