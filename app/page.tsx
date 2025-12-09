'use client'

import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Box,
    Button,
    ButtonGroup,
    Checkbox,
    ClickAwayListener,
    Grid,
    Popper,
    Stack,
    Typography
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { DateTime } from 'luxon';
import { useEffect, useState } from 'react';
import BarTile from './components/dashboard/charts/BarTile';
import DonutTile from './components/dashboard/charts/DonutTile';
import api from './api/axiosClient';

const DATE_RANGES = [
    { id: 'last_week', name: 'Last Week' },
];

const AVAILABLE_SEGMENTS = ['Yard', 'JobType', 'Status'];

export default function Page() {

    const [ready, set_ready] = useState(false);

    const [filters, set_filters] = useState<Record<string, string[]>>({});
    const [segment_values, set_segment_values] = useState<Record<string, string[]>>({});
    // filters_anchor was defined but not used properly in previous step, renaming to generic or reusing storeroutes_anchor logic but better named
    const [filters_anchor, set_filters_anchor] = useState<HTMLElement | null>(null);

    const [date_range, set_date_range] = useState('last_week');

    useEffect(() => {
        const refresh_segment_values = async () => {
            try {
                const new_values: Record<string, string[]> = {};
                
                for (const segment of AVAILABLE_SEGMENTS) {
                    try {
                        const res = await api.get('/bi/segment-values', {
                            params: {
                                datasetName: 'FCC_Jobs',
                                segmentName: segment,
                                includeCount: true
                            }
                        });
                        if (res.data && Array.isArray(res.data)) {
                            new_values[segment] = res.data.map((item: any) => item.value || item);
                        }
                    } catch (e) {
                        console.error(`Error fetching values for ${segment}`, e);
                        new_values[segment] = [];
                    }
                }
    
                set_segment_values(new_values);
                set_ready(true);
            } catch (error) {
                console.error('Error fetching segment values:', error);
                set_ready(true);
            }
        };

        refresh_segment_values();
    }, []);

    const handle_check_all = (segment: string) => {
        const all_values = segment_values[segment] || [];
        const current_selected = filters[segment] || [];
        
        if (current_selected.length === all_values.length) {
            const new_filters = { ...filters };
            delete new_filters[segment];
            set_filters(new_filters);
        } else {
            set_filters({
                ...filters,
                [segment]: all_values
            });
        }
    };

    const toggle_filter = (segment: string, value: string) => {
        const current = filters[segment] || [];
        const index = current.indexOf(value);
        let new_list = [];

        if (index > -1) {
            new_list = current.filter(v => v !== value);
        } else {
            new_list = [...current, value];
        }

        const new_filters = { ...filters };
        if (new_list.length > 0) {
            new_filters[segment] = new_list;
        } else {
            delete new_filters[segment];
        }
        set_filters(new_filters);
    };

    const count_selected = () => {
        return Object.values(filters).reduce((acc, curr) => acc + curr.length, 0);
    }

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#f3f4f6', p: 3 }}>
            <Stack spacing={3}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h4" fontWeight="bold" color="text.primary">
                        Business Intelligence Dashboard
                    </Typography>
                </Box>

                <Box sx={{ bgcolor: 'background.paper', p: 2, borderRadius: 2, boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)' }}>
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center" justifyContent="space-between">
                         <Stack direction="row" spacing={1} alignItems="center">
                            <Typography variant="subtitle2" color="text.secondary" fontWeight="medium">
                                Controls:
                            </Typography>
                            <ClickAwayListener onClickAway={() => set_filters_anchor(null)}>
                                <Box>
                                    <Button
                                        variant="outlined"
                                        color="inherit"
                                        endIcon={<ArrowDropDownIcon />}
                                        onClick={e => set_filters_anchor(filters_anchor ? null : e.currentTarget)}
                                        sx={{ textTransform: 'none', borderColor: 'divider' }}
                                    >
                                        Filters {count_selected() > 0 && `(${count_selected()})`}
                                    </Button>
                                    <Popper
                                        open={Boolean(filters_anchor)}
                                        anchorEl={filters_anchor}
                                        placement="bottom-start"
                                        modifiers={[
                                            {
                                                name: 'offset',
                                                options: {
                                                    offset: [0, 8],
                                                },
                                            },
                                        ]}
                                        sx={{ zIndex: 1200 }}
                                    >
                                        <Box sx={{ p: 1.5, maxHeight: 500, overflow: 'auto', bgcolor: 'background.paper', boxShadow: 4, borderRadius: 2, minWidth: 320, border: '1px solid', borderColor: 'divider' }}>
                                            <Stack spacing={1}>
                                                {AVAILABLE_SEGMENTS.map(segment => {
                                                    const values = segment_values[segment] || [];
                                                    const selected = filters[segment] || [];
                                                    const all_selected = selected.length === values.length && values.length > 0;
                                                    
                                                    return (
                                                        <Accordion key={segment} disableGutters elevation={0} sx={{ '&:before': { display: 'none' }, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                                                            <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ minHeight: 48, px: 2, bgcolor: '#f9fafb' }}>
                                                                <Stack direction="row" alignItems="center" spacing={1} width="100%" onClick={e => e.stopPropagation()}>
                                                                     <Checkbox 
                                                                        size="small"
                                                                        checked={all_selected} 
                                                                        indeterminate={selected.length > 0 && selected.length < values.length}
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            handle_check_all(segment);
                                                                        }}
                                                                     />
                                                                    <Typography fontWeight="bold" variant="body2">{segment}</Typography>
                                                                    {selected.length > 0 && (
                                                                        <Box sx={{ bgcolor: 'primary.light', color: 'primary.contrastText', px: 0.8, py: 0.2, borderRadius: 1, fontSize: '0.7rem' }}>
                                                                            {selected.length}
                                                                        </Box>
                                                                    )}
                                                                </Stack>
                                                            </AccordionSummary>
                                                            <AccordionDetails sx={{ p: 0, maxHeight: 200, overflowY: 'auto' }}>
                                                                <Stack>
                                                                    {values.map(val => (
                                                                        <Stack 
                                                                            key={val} 
                                                                            direction="row" 
                                                                            alignItems="center" 
                                                                            sx={{ 
                                                                                px: 2, 
                                                                                py: 0.5, 
                                                                                '&:hover': { bgcolor: '#f3f4f6' },
                                                                                cursor: 'pointer'
                                                                            }}
                                                                            onClick={() => toggle_filter(segment, val)}
                                                                        >
                                                                            <Checkbox 
                                                                                size="small"
                                                                                checked={selected.includes(val)}
                                                                                onClick={(e) => { e.stopPropagation(); toggle_filter(segment, val); }}
                                                                            />
                                                                            <Typography variant="body2">{val}</Typography>
                                                                        </Stack>
                                                                    ))}
                                                                </Stack>
                                                            </AccordionDetails>
                                                        </Accordion>
                                                    )
                                                })}
                                            </Stack>
                                        </Box>
                                    </Popper>
                                </Box>
                            </ClickAwayListener>
                        </Stack>

                        <Stack direction="row" spacing={2} alignItems="center">
                             <EffectiveDates mode={date_range} />
                             <ButtonGroup variant="outlined" size="small">
                                {DATE_RANGES.map(mode => {
                                    return (
                                        <Button
                                            key={mode.id}
                                            variant={date_range === mode.id ? 'contained' : 'outlined'}
                                            onClick={() => set_date_range(mode.id)}
                                            style={{ textTransform: 'capitalize' }}
                                        >
                                            {mode.name}
                                        </Button>
                                    )
                                })}
                            </ButtonGroup>
                        </Stack>
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
                        <Grid container spacing={2}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <BarTile
                                title="Sales by Yard"
                                datasetName="FCC_Jobs"
                                groupBySegments={['Yard']}
                                metrics={['TotalCost']}
                                filters={filters}
                                date_range={date_range}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <BarTile
                                title="Sales by Time Period"
                                datasetName="FCC_Jobs"
                                groupBySegments={['Month']}
                                metrics={['TotalCost']}
                                filters={filters}
                                date_range={date_range}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 3 }}>
                            <DonutTile
                                title="Jobs by Yard" // Was Dropoff Visits
                                datasetName="FCC_Jobs"
                                groupBySegments={['Yard']}
                                metrics={['TotalJobs']}
                                filters={filters}
                                date_range={date_range}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 3 }}>
                            <DonutTile
                                title="Sales by Yard" // Was Dropoff Sales
                                datasetName="FCC_Jobs"
                                groupBySegments={['Yard']}
                                metrics={['TotalCost']}
                                filters={filters}
                                date_range={date_range}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 3 }}>
                            <DonutTile
                                title="Jobs by Status" // Was Dropoff Pieces
                                datasetName="FCC_Jobs"
                                groupBySegments={['Status']}
                                metrics={['TotalJobs']}
                                filters={filters}
                                date_range={date_range}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 3 }}>
                           {/* NewCustomersChart placeholder or replacement */}
                            <DonutTile
                                title="Jobs by JobType"
                                datasetName="FCC_Jobs"
                                groupBySegments={['JobType']}
                                metrics={['TotalJobs']}
                                filters={filters}
                                date_range={date_range}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 3 }}>
                            <DonutTile
                                title="Labor Hours by Yard" // Was Pickup Sales
                                datasetName="FCC_Jobs"
                                groupBySegments={['Yard']}
                                metrics={['TotalLaborHours']} // Changed to show something else
                                filters={filters}
                                date_range={date_range}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 3 }}>
                            <DonutTile
                                title="Average Job Cost by Yard" // Was Promotion Visits (Using AvgJobCost now)
                                datasetName="FCC_Jobs"
                                groupBySegments={['Yard']}
                                metrics={['AvgJobCost']}
                                filters={filters}
                                date_range={date_range}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 3 }}>
                            <DonutTile
                                title="Sales by Status" // Was Promotion Incoming Sales
                                datasetName="FCC_Jobs"
                                groupBySegments={['Status']}
                                metrics={['TotalCost']}
                                filters={filters}
                                date_range={date_range}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 3 }}>
                             {/* AverageValue placeholder */}
                             <DonutTile
                                title="Total Cost (Status)"
                                datasetName="FCC_Jobs"
                                groupBySegments={['Status']}
                                metrics={['TotalCost']}
                                filters={filters}
                                date_range={date_range}
                             />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 3 }}>
                             {/* AverageValue placeholder 2 */}
                             <DonutTile 
                                title="Total Jobs (JobType)"
                                datasetName="FCC_Jobs"
                                groupBySegments={['JobType']}
                                metrics={['TotalJobs']}
                                filters={filters}
                                date_range={date_range}
                             />
                        </Grid>
                        </Grid>

                </Box>
            )}
        </Stack>
        </Box>
    );
}

const EffectiveDates = ({ mode }: { mode: string }) => {
    let start_date = DateTime.now();
    let end_date = DateTime.now();

    switch (mode) {
        case 'yesterday':
            start_date = start_date.minus({ day: 1 });
            end_date = end_date.minus({ day: 1 });
            break;
        case 'this_week':
            start_date = start_date.startOf('week');
            break;
        case 'last_week':
            start_date = start_date.minus({ week: 1 }).startOf('week');
            end_date = end_date.minus({ week: 1 }).endOf('week');
            break;
        case 'this_month':
            start_date = start_date.startOf('month');
            break;
        case 'last_month':
            start_date = start_date.minus({ month: 1 }).startOf('month');
            end_date = end_date.minus({ month: 1 }).endOf('month');
            break;
        case 'this_year':
            start_date = start_date.startOf('year');
            break;
    }

    const dateStr = (mode === 'today' || mode === 'yesterday') 
        ? start_date.toFormat('MMM d, yyyy')
        : `${start_date.toFormat('MMM d, yyyy')} - ${end_date.toFormat('MMM d, yyyy')}`;

    return (
        <Stack direction="row" alignItems="center" spacing={1}>
             <Typography variant="caption" color="text.secondary" fontWeight="bold" sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Effective Range:
            </Typography>
            <Typography variant="body2" color="text.primary" fontWeight="medium">
                {dateStr}
            </Typography>
        </Stack>
    );
}
