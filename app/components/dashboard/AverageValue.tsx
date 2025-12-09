'use client'

import { useEffect, useState } from 'react';
import ComparisonRow from './ComparisonRow';
import { DarkBox } from '@/app/components/themed';
import formatter from '@/app/helpers/formatter';
import {
    Box
} from '@mui/material';
import axios from 'axios';

interface AverageValueProps {
    title: string;
    source: string;
    date_range: string;
    date_field: string;
    stat_field?: string;
    stat_value?: string;
    buckets: string;
    locations: any[];
}

const AverageValue = (props: AverageValueProps) => {
    const {
        title,
        source,
        date_range,
        date_field,
        stat_field,
        stat_value,
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
    }, [date_range, locations, source, date_field, stat_field, buckets]);

    if (!results) {
        return null;
    }

// AverageValue.tsx fix
    let format_fn = (val: any) => formatter.with_commas(val, 1);

// ... (Wait, I can't edit two files in one call use replace_file_content. I must use separate calls or multi_replace if in one file.)

// I will do AverageValue.tsx first.

    switch (stat_field) {
        case 'total':
            format_fn = formatter.as_currency;
            break;
    }

    return (
        <DarkBox sx={{ p: 2, alignItems: 'center' }}>
            <h3>{title}</h3>
            <Box
                sx={{
                    width: '100%',
                    height: '300px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column'
                }}
            >
                <h1 style={{ fontSize: 58 }}>{format_fn(results.aggregations.locations?.overall?.[value] || 0)}</h1>
                <h2>Average</h2>
            </Box>
            <ComparisonRow
                date_range={date_range}
                prev_change={results.aggregations.locations?.overall?.comparison?.prev?.count || 0}
                stack_change={results.aggregations.locations?.overall?.comparison?.stack?.count || 0}
            />
        </DarkBox>
    )
};

export default AverageValue;
