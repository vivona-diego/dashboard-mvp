'use client';

import { useEffect, useState, useMemo } from 'react';
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Stack
} from '@mui/material';
import { useSearchParams } from 'next/navigation';
import { useDataset } from '../contexts/DatasetContext';
import api from '../api/axiosClient';

interface Dataset {
  name: string;
  datasetId?: string;
}

export default function Header() {
  const { selectedDataset, setSelectedDataset } = useDataset();
  const searchParams = useSearchParams();
  const forecastParam = searchParams.get('forecast'); // 'job' or 'quote' or null
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, []);

  useEffect(() => {
    const fetchDatasets = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get('/bi/datasets');

        // Handle response structure: response.data.data.datasets
        const datasetsArray = response.data?.data?.datasets || response.data?.datasets || response.data;

        if (datasetsArray && Array.isArray(datasetsArray)) {
          const datasetList: Dataset[] = datasetsArray.map((item: any) => ({
            name: item.name,
            datasetId: item.datasetId,
          }));
          setDatasets(datasetList);

          // Si no hay dataset seleccionado y hay datasets disponibles, seleccionar el primero
          if (!selectedDataset && datasetList.length > 0) {
            setSelectedDataset(datasetList[0].name);
          }
        } else {
          setError('Invalid response format');
        }
      } catch (err: any) {
        console.error('Error fetching datasets:', err);
        setError(err.response?.data?.message || err.message || 'Failed to fetch datasets');
      } finally {
        setLoading(false);
      }
    };

    fetchDatasets();
  }, []);

  const handleDatasetClick = (datasetName: string) => {
    setSelectedDataset(datasetName);
  };

  // Filter datasets based on forecast parameter
  const filteredDatasets = useMemo(() => {
    if (!forecastParam) {
      return datasets; // Show all datasets if no forecast filter
    }

    const prefix = forecastParam === 'job' ? 'job_' : 'quote_';
    return datasets.filter(dataset => dataset.name.toLowerCase().startsWith(prefix));
  }, [datasets, forecastParam]);

  // Determine which forecast buttons to show
  const showJobForecast = !forecastParam || forecastParam === 'job';
  const showQuoteForecast = !forecastParam || forecastParam === 'quote';

  if (!isMounted) {
    return null;
  }

  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
        px: 3,
        py: 2,
        boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={3}>
         <Stack direction="row" spacing={2} alignItems="center">
           <Typography
             variant="h5"
             fontWeight="bold"
             color="text.primary"
             component="a"
             href="/"
             sx={{ textDecoration: 'none', cursor: 'pointer' }}
           >
             {forecastParam ? forecastParam.charAt(0).toUpperCase() + forecastParam.slice(1) : 'BI Dashboard'}
           </Typography>
          <Stack direction="row" spacing={1}>
            <Stack direction="row" spacing={1}>
              {showJobForecast && (
                <Button
                  href="/job-revenue-forecast"
                  variant="text"
                  sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
                >
                  Job Forecast
                </Button>
              )}
              {showQuoteForecast && (
                <Button
                  href="/quote-revenue-forecast"
                  variant="text"
                  sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
                >
                  Quote Forecast
                </Button>
              )}
            </Stack>
          </Stack>
        </Stack>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {loading ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CircularProgress size={20} />
              <Typography variant="body2" color="text.secondary">
                Loading datasets...
              </Typography>
            </Box>
          ) : error ? (
            <Typography variant="body2" color="error">
              {error}
            </Typography>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {filteredDatasets.map((dataset) => (
                <Button
                  key={dataset.name}
                  sx={{borderRadius: '100px'}}
                  variant={selectedDataset === dataset.name ? 'contained' : 'outlined'}
                  onClick={() => handleDatasetClick(dataset.name)}
                >
                  {dataset.name}
                </Button>
              ))}
            </Box>
          )}
        </Box>
      </Stack>
    </Box>
  );
}
