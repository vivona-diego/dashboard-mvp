'use client';

import {
  Box,
  Typography,
  Button,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  Pagination,
  TextField,
  MenuItem,
  IconButton,
  Chip,
  Collapse,
  CircularProgress,
} from '@mui/material';
import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense, useEffect, useState, useRef } from 'react';
import api from '@/app/api/axiosClient';
import { useDataset } from '@/app/contexts/DatasetContext';
import { DateTime } from 'luxon';
// Icons
import AddIcon from '@mui/icons-material/Add';
import FilterListIcon from '@mui/icons-material/FilterList';
import TableSkeleton from '../components/ui/TableSkeleton';

interface FilterItem {
  segmentName: string;
  operator: string;
  value: string;
}

function DetailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { selectedDataset } = useDataset();
  const personName = searchParams.get('person');
  const segmentName = searchParams.get('segment');
  const urlDateRange = searchParams.get('date_range');

  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [columns, setColumns] = useState<string[]>([]);
  const pageSize = 50;
  const abortControllerRef = useRef<AbortController | null>(null);

  // Filter State
  const [showFilters, setShowFilters] = useState(false);
  const [customFilters, setCustomFilters] = useState<FilterItem[]>([]);
  
  // New Filter Input State
  const [newFilterColumn, setNewFilterColumn] = useState('');
  const [newFilterOperator, setNewFilterOperator] = useState('eq');
  const [newFilterValue, setNewFilterValue] = useState('');

  // Available operators
  const operators = [
    { value: 'eq', label: 'Equals' },
    { value: 'contains', label: 'Contains' },
    { value: 'gt', label: 'Greater Than' },
    { value: 'lt', label: 'Less Than' },
    { value: 'gte', label: 'Greater/Equal' },
    { value: 'lte', label: 'Less/Equal' },
    { value: 'neq', label: 'Not Equals' },
  ];

  useEffect(() => {
    // Reset page when context changes
    setPage(1);
    setData([]);
    setColumns([]);
    // Do NOT reset customFilters here to allow persistence across simple navigations if desired, 
    // but typically if dataset changes, filters might be invalid. Let's clear them on dataset change.
    setCustomFilters([]); 
  }, [selectedDataset]);

  // If person/segment changes, we might want to keep other filters or reset?
  // Let's keep them for now.

  const addFilter = () => {
    if (!newFilterColumn || !newFilterValue) return;
    
    setCustomFilters(prev => [
      ...prev,
      { segmentName: newFilterColumn, operator: newFilterOperator, value: newFilterValue }
    ]);
    
    // Clear inputs provided they aren't 'sticky' preferences
    setNewFilterValue('');
  };

  const removeFilter = (index: number) => {
    setCustomFilters(prev => prev.filter((_, i) => i !== index));
    setPage(1); // Reset to first page on filter change
  };

  useEffect(() => {
    // Cancel previous request if it exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    if (!selectedDataset) {
      setData([]);
      setError('No dataset selected');
      return;
    }

    const fetchData = async () => {
      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      // Only show main loading state if we heavily need it, 
      // but we have a boolean for that.
      setLoading(true);
      setError(null);

      try {
        const requestBody: any = {
          datasetName: selectedDataset,
          pagination: {
            page,
            pageSize,
          },
        };

        const apiFilters: any[] = [];

        // 1. URL Person Filter
        if (personName && segmentName) {
          apiFilters.push({
            segmentName: decodeURIComponent(segmentName),
            operator: 'eq',
            value: decodeURIComponent(personName),
          });
        }

        // 2. URL Date Range Filter
        // Replicating BarTile logic for consistent date handling
        if (urlDateRange) {
           const now = DateTime.now();
           if (urlDateRange === 'this_month') {
               apiFilters.push({ segmentName: 'Year', operator: 'eq', value: now.year });
               apiFilters.push({ segmentName: 'Month', operator: 'eq', value: now.month });
           } else if (urlDateRange === 'last_month') {
               const lastMonth = now.minus({ month: 1 });
               apiFilters.push({ segmentName: 'Year', operator: 'eq', value: lastMonth.year });
               apiFilters.push({ segmentName: 'Month', operator: 'eq', value: lastMonth.month });
           } else if (urlDateRange === 'this_year') {
               apiFilters.push({ segmentName: 'Year', operator: 'eq', value: now.year });
           } else {
               // Fallback / Placeholder for future logic
           }
        }

        // 3. Custom Filters
        if (customFilters.length > 0) {
            customFilters.forEach(f => {
                apiFilters.push({
                   segmentName: f.segmentName,
                   operator: f.operator,
                   value: f.value 
                });
            });
        }

        if (apiFilters.length > 0) {
            requestBody.filters = apiFilters;
        }

        const res = await api.post('/bi/drilldown', requestBody, {
          signal: abortController.signal,
        });

        if (abortController.signal.aborted) {
          return;
        }

        const responseData = res.data?.data;

        if (responseData && (responseData.success || Array.isArray(responseData.data))) {
          const rows = responseData.data || [];
          setData(rows);

          // Extract columns
          let newColumns = columns;
          if (rows.length > 0) {
            newColumns = Object.keys(rows[0]).filter((k) => k !== '_RowNum');
            setColumns(newColumns);
          } else if (responseData.metadata?.columns) {
            newColumns = responseData.metadata.columns;
            setColumns(newColumns);
          }

          // Pagination
          const pagination = responseData.pagination;
          if (pagination) {
            setTotalPages(pagination.totalPages);
          } else if (responseData.metadata?.totalRows) {
            setTotalPages(Math.ceil(responseData.metadata.totalRows / pageSize));
          } else {
            setTotalPages(rows.length < pageSize ? page : page + 1);
          }
        } else {
          setError('Invalid response format');
          setData([]);
        }
      } catch (err: any) {
        if (err.name === 'AbortError' || err.name === 'CanceledError') {
          return;
        }
        console.error('Error fetching drilldown data:', err);
        setError(err.response?.data?.message || err.message || 'Failed to fetch data');
        setData([]);
      } finally {
        if (!abortController.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [selectedDataset, personName, segmentName, page, urlDateRange, customFilters]);


  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackDashboard = () => {
    const query = new URLSearchParams();
    if (selectedDataset) query.set('dataset', selectedDataset);
    if (segmentName) query.set('segment', segmentName);
    if (urlDateRange) query.set('date_range', urlDateRange);
    router.push(`/?${query.toString()}`);
  };

  const decodedPersonName = personName ? decodeURIComponent(personName) : null;
  const decodedSegmentName = segmentName ? decodeURIComponent(segmentName) : null;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#0B1D35',
        p: 3,
      }}
    >
      <Stack spacing={3}>
        <Button variant="outlined" onClick={handleBackDashboard} sx={{ alignSelf: 'flex-start' }}>
          ← Back to Dashboard
        </Button>

        <Box
          sx={{
            bgcolor: 'background.paper',
            p: 4,
            borderRadius: 2,
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box>
                <Typography variant="h4" fontWeight="bold" color="text.primary">
                    {decodedPersonName ? 'Person Details' : 'All Data'}
                </Typography>
                {decodedPersonName && decodedSegmentName && (
                    <Typography variant="h6" color="text.secondary" sx={{ mt: 1 }}>
                    {decodedSegmentName}: <strong>{decodedPersonName}</strong>
                    </Typography>
                )}
            </Box>
             <Button 
                startIcon={<FilterListIcon />} 
                variant={showFilters ? 'contained' : 'outlined'} 
                onClick={() => setShowFilters(!showFilters)}
             >
                Filters
             </Button>
          </Box>

          <Collapse in={showFilters}>
            <Paper variant="outlined" sx={{ p: 2, mb: 3, bgcolor: 'background.default' }}>
                <Stack spacing={2}>
                    <Typography variant="subtitle2" fontWeight="bold">Add Filter</Typography>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
                        <TextField
                            select
                            label="Column"
                            size="small"
                            value={newFilterColumn}
                            onChange={(e) => setNewFilterColumn(e.target.value)}
                            sx={{ minWidth: 150 }}
                        >
                            {columns.map(col => (
                                <MenuItem key={col} value={col}>{col}</MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            select
                            label="Operator"
                            size="small"
                            value={newFilterOperator}
                            onChange={(e) => setNewFilterOperator(e.target.value)}
                            sx={{ minWidth: 120 }}
                        >
                            {operators.map(op => (
                                <MenuItem key={op.value} value={op.value}>{op.label}</MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            label="Value"
                            size="small"
                            value={newFilterValue}
                            onChange={(e) => setNewFilterValue(e.target.value)}
                            fullWidth
                        />
                        <IconButton 
                            color="primary" 
                            onClick={addFilter} 
                            disabled={!newFilterColumn || !newFilterValue}
                            sx={{ bgcolor: 'primary.main', color: 'white', '&:hover': { bgcolor: 'primary.dark' } }}
                        >
                            <AddIcon />
                        </IconButton>
                    </Stack>
                    
                    {customFilters.length > 0 && (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                            {customFilters.map((filter, idx) => (
                                <Chip
                                    key={idx}
                                    label={`${filter.segmentName} ${filter.operator} ${filter.value}`}
                                    onDelete={() => removeFilter(idx)}
                                    color="primary"
                                    variant="outlined"
                                />
                            ))}
                        </Box>
                    )}
                </Stack>
            </Paper>
          </Collapse>

          {loading && (
             <TableSkeleton />
          )}

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}

          {!loading && !error && data.length > 0 && (
            <>
              <TableContainer component={Paper} sx={{ mt: 3, maxHeight: '70vh', overflow: 'auto' }}>
                <Table stickyHeader sx={{ minWidth: 650 }}>
                  <TableHead>
                    <TableRow>
                      {columns.map((column) => (
                        <TableCell key={column} sx={{ fontWeight: 'bold', bgcolor: 'background.default' }}>
                          {column}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.map((row, index) => (
                      <TableRow key={index} hover>
                        {columns.map((column) => (
                          <TableCell key={column}>{row[column] ?? '-'}</TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                    size="large"
                    showFirstButton
                    showLastButton
                  />
                </Box>
              )}
            </>
          )}

          {!loading && !error && data.length === 0 && (
            <Typography variant="body1" color="text.secondary" sx={{ mt: 3, textAlign: 'center' }}>
              No data available
            </Typography>
          )}
        </Box>
      </Stack>
    </Box>
  );
}

export default function DetailPage() {
  return (
    <Suspense
      fallback={
        <Box
          sx={{
            minHeight: '100vh',
            bgcolor: '#0B1D35',
            p: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CircularProgress />
        </Box>
      }
    >
      <DetailContent />
    </Suspense>
  );
}
