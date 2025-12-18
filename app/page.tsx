'use client';

    import { Box, Button, ButtonGroup, Chip, CircularProgress, Grid, Skeleton, Stack, Typography } from '@mui/material';
import { DateTime } from 'luxon';
import { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import QueryChart from './components/dashboard/charts/QueryChart';
import TableTile from './components/dashboard/charts/TableTile';
import api from './api/axiosClient';
import { useDataset } from './contexts/DatasetContext';

interface DateRange {
  id: string;
  name: string;
}

interface DatasetSegment {
  columnName: string;
  segment: {
    segmentName: string;
  };
  isFilterable: boolean;
  isGroupable: boolean;
}

const VISUAL_DATE_RANGES = [
  { id: 'today', name: 'Today' },
  { id: 'yesterday', name: 'Yesterday' },
  { id: 'this_week', name: 'This Week' },
  { id: 'last_week', name: 'Last Week' },
  { id: 'last_month', name: 'Last Month' },
  { id: 'this_year', name: 'This Year' },
];

export default function Page() {
  const { selectedDataset, setSelectedDataset } = useDataset();
  const searchParams = useSearchParams();
  const [ready, set_ready] = useState(false);
  const [mounted, set_mounted] = useState(false);

  const [selected_segment, set_selected_segment] = useState<string | null>(null);
  const [available_segments, set_available_segments] = useState<string[]>([]);
  const [available_metrics, set_available_metrics] = useState<string[]>([]);
  const [visual_date_range, set_visual_date_range] = useState<string>('last_week');
  const [loading_segments, set_loading_segments] = useState(false);

  const [date_ranges, set_date_ranges] = useState<DateRange[]>([]);
  const [date_range, set_date_range] = useState<string>('');

  // Interactive filter state (from chart clicks) - Array for multi-select
  const [interactive_filters, set_interactive_filters] = useState<{ segment: string; value: string }[]>([]);

  // Sync dataset and date range from URL
  useEffect(() => {
    const urlDataset = searchParams.get('dataset');
    const urlDateRange = searchParams.get('date_range')

    if (urlDataset && urlDataset !== selectedDataset && mounted) {
       setSelectedDataset(urlDataset);
       set_interactive_filters([]); // Clear filters on dataset change
    }
    if (urlDateRange && VISUAL_DATE_RANGES.find(r => r.id === urlDateRange)) {
        set_visual_date_range(urlDateRange);
    }
  }, [searchParams, mounted, setSelectedDataset]);

  const handlePersonClick = (personName: string) => {
    // Toggle filter: If exists, remove it; if not, add it.
    if (selected_segment) {
        set_interactive_filters(prev => {
            const exists = prev.find(f => f.segment === selected_segment && f.value === personName);
            if (exists) {
                return prev.filter(f => !(f.segment === selected_segment && f.value === personName));
            } else {
                return [...prev, { segment: selected_segment, value: personName }];
            }
        });
    }
  };

  const handleTitleClick = () => {
    // Clear all filters for the current segment? Or custom logic.
    // For now, clear all.
    set_interactive_filters([]);
  };

  useEffect(() => {
    set_mounted(true);
  }, []);

  // Fetch dataset info (segments and date ranges) when dataset changes
  useEffect(() => {
    const fetchDatasetInfo = async () => {
      // Reset segment selection when dataset changes
      set_selected_segment(null);

      if (!selectedDataset) {
        set_date_ranges([]);
        set_date_range('');
        set_available_segments([]);
        set_available_metrics([]);
        set_loading_segments(false);
        return;
      }

      set_loading_segments(true);
      try {
        const response = await api.get(`/bi/datasets/${selectedDataset}`);

        // Handle the response structure: response.data.data.dataset
        const datasetData = response.data?.data?.dataset || response.data?.dataset || response.data;

        // Extract segments from datasetSegments
        if (datasetData?.datasetSegments && Array.isArray(datasetData.datasetSegments)) {
          const segments = datasetData.datasetSegments
            .filter((ds: DatasetSegment) => ds.isFilterable !== false) // Only include filterable segments
            .map((ds: DatasetSegment) => ds.segment.segmentName);
          set_available_segments(segments);

           // Restore segment from URL if applicable
           const urlSegment = searchParams.get('segment');
           const urlDataset = searchParams.get('dataset');
           if (urlDataset === selectedDataset && urlSegment && segments.includes(urlSegment)) {
               set_selected_segment(urlSegment);
           }
        } else {
          set_available_segments([]);
        }

        // Extract metrics from response.data.data.metrics
        if (response.data?.data?.metrics && Array.isArray(response.data.data.metrics)) {
          const metrics = response.data.data.metrics
            .filter((m: any) => m.isActive !== false)
            .map((m: any) => m.metricName);
          set_available_metrics(metrics);
        } else {
          set_available_metrics([]);
        }

        // Extract date ranges if available in the response
        if (response.data?.data?.dateRanges && Array.isArray(response.data.data.dateRanges)) {
          const ranges = response.data.data.dateRanges.map((item: any) => ({
            id: item.id || item.name || item,
            name: item.name || item.id || item,
          }));
          set_date_ranges(ranges);

          // Set default date range to first available
          if (ranges.length > 0) {
            set_date_range(ranges[0].id);
          }
        } else {
          set_date_ranges([]);
          set_date_range('');
        }
      } catch (error) {
        console.error('Error fetching dataset info:', error);
        set_date_ranges([]);
        set_date_range('');
        set_available_segments([]);
        set_available_metrics([]);
      } finally {
        set_loading_segments(false);
      }
    };

    fetchDatasetInfo();
  }, [selectedDataset, searchParams]);

  // Set ready when segments and metrics are available
  useEffect(() => {
    if (available_segments.length > 0 && available_metrics.length > 0) {
      set_ready(true);
    } else {
      set_ready(false);
    }
  }, [available_segments, available_metrics]);

  // Memoize groupBySegments to prevent recreating array on each render
  const groupBySegments = useMemo(() => (selected_segment ? [selected_segment] : []), [selected_segment]);

  // Determine date segment name based on dataset
  const getDateSegmentName = (datasetName: string): string => {
    if (datasetName.toLowerCase().includes('quote')) {
      return 'QuoteDate';
    }
    // Default to CreatedDate for Jobs_By_Status and other datasets
    return 'CreatedDate';
  };

  // Memoize filters based on visual_date_range and dataset
  // These are the GLOBAL filters applied to all charts logic (data fetching)
  const baseFilters = useMemo(() => {
    if (!visual_date_range || !selectedDataset) {
      return [];
    }
    const dateSegmentName = getDateSegmentName(selectedDataset);
    return [
      {
        segmentName: dateSegmentName,
        operator: visual_date_range,
      },
    ];
  }, [visual_date_range, selectedDataset]);

  // Combine global filters + interactive filters for the TableTile
  const tableFilters = useMemo(() => {
      const filters: Array<{ segmentName: string; operator: string; value?: any }> = [...baseFilters];
      
      if (interactive_filters.length > 0) {
          // Group filters by segment
          const groups: Record<string, string[]> = {};
          interactive_filters.forEach(f => {
              if (!groups[f.segment]) groups[f.segment] = [];
              groups[f.segment].push(f.value);
          });

          // Create filter objects
          Object.keys(groups).forEach(segment => {
              const values = groups[segment];
              if (values.length === 1) {
                  filters.push({
                      segmentName: segment,
                      operator: 'eq',
                      value: values[0]
                  });
              } else if (values.length > 1) {
                   filters.push({
                      segmentName: segment,
                      operator: 'in', // Using IN operator for multi-select
                      value: values
                  });
              }
          });
      }
      return filters;
  }, [baseFilters, interactive_filters]);

  // Construct highlight filters array for charts
  const highlightFilters = useMemo(() => {
     return interactive_filters.map(f => ({
         segmentName: f.segment,
         value: f.value
     }));
  }, [interactive_filters]);

  if (!mounted) {
    return <div className="min-h-dvh bg-black"></div>;
  }

  if (!selectedDataset) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          bgcolor: '#f3f4f6',
          p: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="h6" color="text.secondary">
          Please select a dataset from the header
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#0B1D35', p: { xs: 1, md: 3 } }}>
      <Stack spacing={3}>
        <Box
          sx={{
            bgcolor: 'background.paper',
            p: 2,
            borderRadius: 2,
            boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
          }}
        >
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center" justifyContent="space-between">
            <Stack direction="row" spacing={2} alignItems="center">
              <ButtonGroup variant="outlined">
                {date_ranges.map((mode) => {
                  return (
                    <Button
                      key={mode.id}
                      variant={date_range === mode.id ? 'contained' : 'outlined'}
                      onClick={() => set_date_range(mode.id)}
                      disabled={!date_range}
                    >
                      {mode.name}
                    </Button>
                  );
                })}
              </ButtonGroup>
            </Stack>

            <Stack
              flex={1}
              direction="row"
              spacing={2}
              alignItems="center"
              flexWrap="wrap"
              justifyContent="space-between"
              sx={{ p: { xs: 1, md: 2 }, backgroundColor: '#07101c' }}
            >
              <Stack direction="row" spacing={1} alignItems="center" sx={{ maxWidth: '100%', overflowX: 'auto' }}>
                <ButtonGroup variant="outlined" size="small">
                  {VISUAL_DATE_RANGES.map((mode) => (
                    <Button
                      key={mode.id}
                      variant={visual_date_range === mode.id ? 'contained' : 'outlined'}
                      onClick={() => set_visual_date_range(mode.id)}
                    >
                      {mode.name}
                    </Button>
                  ))}
                </ButtonGroup>
              </Stack>

              <Stack direction="row" spacing={1} alignItems="center" sx={{ maxWidth: '100%', overflowX: 'auto',ml:0 }}>
                <Typography variant="subtitle2" color="text.secondary" fontWeight="medium">
                  Segment:
                </Typography>
                {loading_segments ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 2 }}>
                    <CircularProgress size={16} />
                    <Typography variant="body2" color="text.secondary">
                      Loading segments...
                    </Typography>
                  </Box>
                ) : (
                  <ButtonGroup variant="outlined" size="small">
                    {available_segments.map((segment: string) => (
                      <Button
                        key={segment}
                        variant={selected_segment === segment ? 'contained' : 'outlined'}
                        onClick={() => set_selected_segment(selected_segment === segment ? null : segment)}
                      >
                        {segment}
                      </Button>
                    ))}
                  </ButtonGroup>
                )}
              </Stack>
            </Stack>
          </Stack>
        </Box>
        <Box>
          <EffectiveDates mode={visual_date_range} />
        </Box>
        {!ready ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <h3>Loading dashboard...</h3>
            <p>Please wait while we fetch your data.</p>
          </Box>
        ) : !selected_segment ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              Please select a segment to view charts
            </Typography>
          </Box>
        ) : (
          <Box>
            {interactive_filters.length > 0 && (
                <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {interactive_filters.map((f) => (
                        <Chip 
                            key={`${f.segment}-${f.value}`}
                            label={`${f.segment}: ${f.value}`} 
                            onDelete={() => handlePersonClick(f.value)} // Re-clicking acts as toggle/delete
                            color="primary"
                            variant="outlined"
                            sx={{ bgcolor: 'rgba(25, 118, 210, 0.08)', fontWeight: 'bold' }}
                        />
                    ))}
                    <Chip 
                        label="Clear All" 
                        onDelete={() => set_interactive_filters([])}
                        variant="outlined"
                        size="small"
                    />
                </Box>
            )}
            <Grid container spacing={2}>
              {available_metrics.slice(0, 5).map((metric, index) => {
                // Alternate between bar and donut, starting with bar for first two, then donut
                const chartType = index < 2 ? 'bar' : index < 4 ? 'donut' : 'bar';
                // First two are large (6 cols), rest are medium (4 cols)
                const gridSize = index < 2 ? { xs: 12, sm: 6 } : { xs: 12, sm: 4 };

                return (
                  <Grid key={metric} size={gridSize}>
                    <QueryChart
                      title={`${metric} by ${selected_segment}`}
                      datasetName={selectedDataset || ''}
                      groupBySegments={groupBySegments}
                      metricName={metric}
                      chartType={chartType}
                      filters={baseFilters}
                      highlightFilters={highlightFilters}
                      onPersonClick={handlePersonClick}
                      onTitleClick={handleTitleClick}
                    />
                  </Grid>
                );
              })}

              {/* Demo Table for Jobs (Prioritize Customer segment as requested) */}
              {(() => {
                  const desiredMetrics = ['TotalJobs', 'TotalCost'];
                  const tableMetrics = desiredMetrics.filter(m => available_metrics.includes(m));
                  
                  // Boss requested "Jobs by Customer" specifically for the demo.
                  // Try to find "Customer" in available segments, otherwise fall back to selected_segment.
                  const demoSegment = available_segments.includes('Customer') ? 'Customer' : selected_segment;

                  if (tableMetrics.length === 0 || !demoSegment) return null;

                  return (
                    <Grid size={{ xs: 12 }}>
                        <TableTile 
                            title={`All data`}
                            datasetName={selectedDataset || ''}
                            groupBySegments={[demoSegment]}
                            metrics={tableMetrics} 
                            filters={tableFilters}
                            useDrilldown={true}
                        />
                    </Grid>
                  );
              })()}
             
            </Grid>
          </Box>
        )}
      </Stack>
    </Box>
  );
}

const EffectiveDates = ({ mode }: { mode: string }) => {
  // Inicializamos con null para saber que aún no hemos calculado la fecha en el cliente
  const [dateStr, setDateStr] = useState<string | null>(null);

  useEffect(() => {
    let start_date = DateTime.now();
    let end_date = DateTime.now();

    switch (mode) {
      case 'yesterday':
        start_date = start_date.minus({ day: 1 });
        end_date = end_date.minus({ day: 1 });
        break;
      case 'this_week':
        start_date = start_date.startOf('week');
        // Ojo: end_date sigue siendo "ahora mismo".
        // Si quieres el fin de semana, usa: end_date = end_date.endOf('week');
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

    const calculatedStr =
      mode === 'today' || mode === 'yesterday'
        ? start_date.toFormat('MMM d, yyyy')
        : `${start_date.toFormat('MMM d, yyyy')} - ${end_date.toFormat('MMM d, yyyy')}`;

    setDateStr(calculatedStr);
  }, [mode]); // Se recalcula si cambia el 'mode'

  // Mientras carga (o si hay SSR), mostramos un Skeleton o nada para evitar el error de hidratación
  if (!dateStr) {
    return <Skeleton variant="text" width={200} />;
  }

  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      <Typography
        variant="body1"
        color="text.secondary"
        fontWeight="bold"
        sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}
      >
        Effective Date:
      </Typography>
      <Typography variant="body2" color="text.primary" fontWeight="medium">
        {dateStr}
      </Typography>
    </Stack>
  );
};
