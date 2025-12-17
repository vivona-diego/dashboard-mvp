'use client';

import { Box, Typography, Button, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Alert, Pagination } from '@mui/material';
import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense, useEffect, useState, useRef } from 'react';
import api from '@/app/api/axiosClient';
import { useDataset } from '@/app/contexts/DatasetContext';

function DetailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { selectedDataset } = useDataset();
  const personName = searchParams.get('person');
  const segmentName = searchParams.get('segment');

  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [columns, setColumns] = useState<string[]>([]);
  const pageSize = 50;
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    // Reset page when filters change
    setPage(1);
    setData([]);
    setColumns([]);
  }, [personName, segmentName, selectedDataset]);

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

        // If person is provided, add filter
        if (personName && segmentName) {
          const decodedPersonName = decodeURIComponent(personName);
          requestBody.filters = [
            {
              segmentName: decodeURIComponent(segmentName),
              operator: 'eq',
              value: decodedPersonName,
            },
          ];
        }

        const res = await api.post('/bi/drilldown', requestBody, {
          signal: abortController.signal,
        });

        if (abortController.signal.aborted) {
          return;
        }

        if (res.data?.success && res.data?.data?.data) {
          const rows = res.data.data.data;
          setData(rows);

          // Extract columns from first row if available
          if (rows.length > 0) {
            setColumns(Object.keys(rows[0]));
          }

          // Get totalPages from pagination metadata
          const pagination = res.data?.data?.pagination || res.data?.data?.data?.pagination;
          if (pagination?.totalPages) {
            setTotalPages(pagination.totalPages);
          } else {
            // Fallback: if we got less than pageSize, we're on the last page
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
  }, [selectedDataset, personName, segmentName, page]);

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
        <Button variant="outlined" onClick={() => router.push('/')} sx={{ alignSelf: 'flex-start' }}>
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
          <Typography variant="h4" fontWeight="bold" color="text.primary" gutterBottom>
            {decodedPersonName ? 'Person Details' : 'All Data'}
          </Typography>
          {decodedPersonName && decodedSegmentName && (
            <Typography variant="h6" color="text.secondary" sx={{ mt: 2, mb: 2 }}>
              {decodedSegmentName}: <strong>{decodedPersonName}</strong>
            </Typography>
          )}

          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
              <CircularProgress />
            </Box>
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
          <Typography variant="h6" color="text.secondary">
            Loading...
          </Typography>
        </Box>
      }
    >
      <DetailContent />
    </Suspense>
  );
}

