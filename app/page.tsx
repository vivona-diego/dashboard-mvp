'use client'

import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import {
    Box,
    Button,
    ButtonGroup,
    Checkbox,
    ClickAwayListener,
    Divider,
    Grid,
    Popper,
    Stack
} from '@mui/material';
import axios from 'axios';
import { DateTime } from 'luxon';
import { useEffect, useState } from 'react';
import AverageValue from './components/dashboard/AverageValue';
import BarTile from './components/dashboard/charts/BarTile';
import DonutTile from './components/dashboard/charts/DonutTile';
import NewCustomersChart from './components/dashboard/charts/NewCustomersChart';

const DATE_RANGES = [
    { id: 'today', name: 'Today' },
    { id: 'yesterday', name: 'Yesterday' },
    { id: 'this_week', name: 'This Week' },
    { id: 'last_week', name: 'Last Week' },
    { id: 'this_month', name: 'This Month' },
    { id: 'last_month', name: 'Last Month' },
    { id: 'this_year', name: 'This Year' },
];

interface Route {
    route_id: string | number;
    name: string;
    checked: boolean;
}

interface Location {
    location_id: string | number;
    name: string;
    checked: boolean;
    routes: Route[];
}

export default function Page() {

    const [ready, set_ready] = useState(false);

    const [locations, set_locations] = useState<Location[]>([]);
    const [storeroutes_anchor, set_storeroutes_anchor] = useState<HTMLElement | null>(null);

    const [date_range, set_date_range] = useState('this_week');
    const [select_all, set_select_all] = useState(false);

    useEffect(() => {
        refresh_locations();
    }, []);

    useEffect(() => {
        let all_selected = true;

        if (locations.length === 0) {
            all_selected = false;
        } else {
            for (const location of locations) {
                if (!location.checked) {
                    all_selected = false;
                    break;
                }

                for (const route of location.routes) {
                    if (!route.checked) {
                        all_selected = false;
                        break;
                    }
                }
            }
        }

        set_select_all(all_selected);
    }, [locations]);

    const refresh_locations = async () => {
        try {
            const res = await axios
                .get('/api/v1/locations', {
                    params: {
                        include: ['routes']
                    }
                });

            if (res.status >= 400) {
                console.error('Locations API failed:', res.status, res.statusText);
                set_locations([]);
                set_ready(true);
                return;
            }

            // Avoid crashing if the response data is empty
            if (!res.data || !Array.isArray(res.data)) {
                console.error('Invalid response data:', res.data);
                set_locations([]);
                set_ready(true);
                return;
            }

            set_locations(res.data.map((location: { location_id: string | number; name: string; routes: { route_id: string | number; name: string }[] }) => {
                return {
                    location_id: location.location_id,
                    name: location.name,
                    checked: true,
                    routes: (location.routes || []).map((route: { route_id: string | number; name: string }) => {
                        return {
                            route_id: route.route_id,
                            name: route.name,
                            checked: true,
                        }
                    })
                }
            }));

            set_ready(true);
        } catch (error) {
            console.error('Error fetching locations:', error);
            set_locations([]);
            set_ready(true);
        }
    };

    const handle_check_all = () => {
        set_locations(prev => prev.map(location => {
            return {
                ...location,
                checked: !select_all,
                routes: location.routes.map(route => {
                    return {
                        ...route,
                        checked: !select_all,
                    }
                })
            }
        }));
        set_select_all(!select_all);
    };

    const check_location = (location_id: string | number) => {
        set_locations(prev => prev.map(location => {
            // ignored non-matched locations
            if (location.location_id !== location_id) {
                return location;
            }

            return {
                ...location,
                checked: !location.checked,
                routes: location.routes.map(route => {
                    return {
                        ...route,
                        checked: !location.checked,
                    }
                })
            }
        }));
    };

    const check_route = (route_id: string | number) => {
        set_locations(prev => prev.map(location => {
            // ignore locations with non-matched routes
            if (!location.routes.some(route => route.route_id === route_id)) {
                return location;
            }

            const new_routes = location.routes.map(route => {
                if (route.route_id !== route_id) {
                    return route;
                }

                return {
                    ...route,
                    checked: !route.checked,
                }
            })

            return {
                ...location,
                checked: new_routes.some(route => route.checked),
                routes: new_routes,
            }
        }));
    };

    const count_selected = () => {
        return locations
            .reduce((a, c) => {
                if (c.checked) {
                    ++a;
                }

                c.routes.forEach(route => {
                    if (route.checked) {
                        ++a;
                    }
                });

                return a;
            }, 0);
    }

    return (
        <Stack spacing={2}>
            <h2>Analytics Dashboard</h2>
            <Box sx={{ p: 1 }}>
                <Stack direction="row" spacing={1}>
                    <ButtonGroup variant="outlined">
                        {DATE_RANGES.map(mode => {
                            return (
                                <Button
                                    key={mode.id}
                                    variant={date_range === mode.id ? 'contained' : 'outlined'}
                                    onClick={() => set_date_range(mode.id)}
                                >
                                    {mode.name}
                                </Button>
                            )
                        })}
                    </ButtonGroup>
                    <Box sx={{ flex: 1 }} />
                    <ClickAwayListener onClickAway={() => set_storeroutes_anchor(null)}>
                        <Box>
                            <Button
                                variant="contained"
                                endIcon={<ArrowDropDownIcon />}
                                onClick={e => set_storeroutes_anchor(storeroutes_anchor ? null : e.currentTarget)}
                            >
                                Stores/Routes ({count_selected()} selected)
                            </Button>
                            <Popper
                                open={Boolean(storeroutes_anchor)}
                                anchorEl={storeroutes_anchor}
                                placement="bottom-end"
                                modifiers={[
                                    {
                                        name: 'offset',
                                        options: {
                                            offset: [0, 8],
                                        },
                                    },
                                ]}
                            >
                                <Box sx={{ p: 1.5, maxHeight: 500, overflow: 'auto' }}>
                                    <Stack>
                                        <Box>
                                            <Stack direction="row" spacing={1}>
                                                <Checkbox checked={select_all} onClick={handle_check_all} />
                                                <h4>Select All</h4>
                                            </Stack>
                                        </Box>
                                        <Divider sx={{ my: 1 }} />
                                        <Stack spacing={1}>
                                            {locations.map(location => {
                                                return (
                                                    <Stack key={location.location_id.toString()} spacing={1}>
                                                        <Stack direction="row" spacing={1}>
                                                            <Checkbox
                                                                checked={location.checked}
                                                                onClick={() => check_location(location.location_id)}
                                                            />
                                                            <h4>{location.name}</h4>
                                                        </Stack>
                                                        <Stack spacing={1} sx={{ pl: 2 }}>
                                                            {location.routes.map(route => {
                                                                return (
                                                                    <Stack key={route.route_id.toString()} direction="row" spacing={1}>
                                                                        <Checkbox
                                                                            checked={route.checked}
                                                                            onClick={() => check_route(route.route_id)}
                                                                        />
                                                                        <h4>{route.name}</h4>
                                                                    </Stack>
                                                                )
                                                            })}
                                                        </Stack>
                                                    </Stack>
                                                );
                                            })}
                                        </Stack>
                                    </Stack>
                                </Box>
                            </Popper>
                        </Box>
                    </ClickAwayListener>
                </Stack>
            </Box>
            <Box>
                <EffectiveDates mode={date_range} />
            </Box>
            {!ready ? (
                <Box sx={{ p: 3, textAlign: 'center' }}>
                    <h3>Loading dashboard...</h3>
                    <p>Please wait while we fetch your data.</p>
                </Box>
            ) : (
                <Box>
                    {locations.length === 0 ? (
                        <Box sx={{ p: 3, textAlign: 'center' }}>
                            <h3>No locations available</h3>
                            <p>Unable to load location data.</p>
                        </Box>
                    ) : (
                        <Grid container spacing={2}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <BarTile
                                title="Dropoff Sales by Location"
                                source="invoices"
                                date_range={date_range}
                                date_field="dropoff_at"
                                locations={locations}
                                stat_field="total"
                                stat_value="sum"
                                buckets="locations"
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <BarTile
                                title="Dropoff Sales by Time Period"
                                source="invoices"
                                date_range={date_range}
                                date_field="dropoff_at"
                                locations={locations}
                                stat_field="total"
                                stat_value="sum"
                                buckets={{
                                    today: 'hour',
                                    yesterday: 'hour',
                                    this_week: 'day',
                                    last_week: 'day',
                                    this_month: 'day',
                                    last_month: 'day',
                                    this_year: 'month',
                                }[date_range] || 'day'}
                            />
                        </Grid>
                        {/* <Grid size={{ xs: 12, sm: 6 }}>
                        <BarTile
                            title="Pieces"
                            source="invoices"
                            date_range={date_range}
                            date_field="dropoff_at"
                            locations={locations}
                            stat_field="pieces"
                            stat_value="sum"
                            buckets="locations"
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <BarTile
                            title="Pieces"
                            source="invoices"
                            date_range={date_range}
                            date_field="dropoff_at"
                            locations={locations}
                            stat_field="pieces"
                            stat_value="sum"
                            buckets={{
                                today: 'hour',
                                yesterday: 'hour',
                                this_week: 'day',
                                last_week: 'day',
                                this_month: 'day',
                                last_month: 'day',
                                this_year: 'month',
                            }[date_range] || 'day'}
                        />
                    </Grid> */}
                        <Grid size={{ xs: 12, sm: 3 }}>
                            <DonutTile
                                title="Dropoff Visits"
                                source="visits"
                                date_range={date_range}
                                date_field="visit_at"
                                locations={locations}
                                buckets="locations,routes"
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 3 }}>
                            <DonutTile
                                title="Dropoff Sales"
                                source="invoices"
                                date_range={date_range}
                                date_field="dropoff_at"
                                locations={locations}
                                stat_field="total"
                                stat_value="sum"
                                buckets="locations,routes"
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 3 }}>
                            <DonutTile
                                title="Dropoff Pieces"
                                source="invoices"
                                date_range={date_range}
                                date_field="dropoff_at"
                                locations={locations}
                                stat_field="pieces"
                                stat_value="sum"
                                buckets="locations,routes"
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 3 }}>
                            <NewCustomersChart
                                date_range={date_range}
                                locations={locations}
                                buckets="locations,routes"
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 3 }}>
                            <DonutTile
                                title="Pickup Sales"
                                source="invoices"
                                date_range={date_range}
                                date_field="pickup_at"
                                locations={locations}
                                stat_field="total"
                                stat_value="sum"
                                buckets="locations,routes"
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 3 }}>
                            <DonutTile
                                title="Promotion Visits"
                                source="visits"
                                date_range={date_range}
                                date_field="visit_at"
                                locations={locations}
                                filter_extra="promotion"
                                buckets="locations,routes"
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 3 }}>
                            <DonutTile
                                title="Promotion Incoming Sales"
                                source="visits"
                                date_range={date_range}
                                date_field="visit_at"
                                locations={locations}
                                filter_extra="promotion"
                                stat_field="total"
                                stat_value="sum"
                                buckets="coupons"
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 3 }}>
                            <AverageValue
                                title="Average Incoming Visit Pieces"
                                source="visits"
                                date_range={date_range}
                                date_field="visit_at"
                                locations={locations}
                                stat_field="pieces"
                                stat_value="avg"
                                buckets="locations"
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 3 }}>
                            <AverageValue
                                title="Average Incoming Visit Amount"
                                source="visits"
                                date_range={date_range}
                                date_field="visit_at"
                                locations={locations}
                                stat_field="total"
                                stat_value="avg"
                                buckets="locations"
                            />
                        </Grid>
                        </Grid>
                    )}
                </Box>
            )}
        </Stack>
    );
}

const EffectiveDates = ({ mode }: { mode: string }) => {
    let start_date = DateTime.now();
    let end_date = DateTime.now();

    switch (mode) {
        case 'yesterday':
            start_date = start_date
                .minus({ day: 1 });
            end_date = end_date
                .minus({ day: 1 });
            break;
        case 'this_week':
            start_date = start_date
                .startOf('week');
            break;
        case 'last_week':
            start_date = start_date
                .minus({ week: 1 })
                .startOf('week');
            end_date = end_date
                .minus({ week: 1 })
                .endOf('week');
            break;
        case 'this_month':
            start_date = start_date
                .startOf('month');
            break;
        case 'last_month':
            start_date = start_date
                .minus({ month: 1 })
                .startOf('month');
            end_date = end_date
                .minus({ month: 1 })
                .endOf('month');
            break;
        case 'this_year':
            start_date = start_date
                .startOf('year');
            break;
    }

    if (mode === 'today' || mode === 'yesterday') {
        return (
            <h3>
                Effective Date:
                {' '}
                {start_date.toFormat('MMMM d, yyyy')}
            </h3>
        )
    } else {
        return (
            <h3>
                Effective Dates:
                {' '}
                {start_date.toFormat('MMMM d, yyyy')} to {end_date.toFormat('MMMM d, yyyy')}
            </h3>
        )
    }
}
