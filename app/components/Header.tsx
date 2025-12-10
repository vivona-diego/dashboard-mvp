'use client';

import { useEffect, useState } from 'react';
import { Box, Button, ButtonGroup, Typography, CircularProgress, Stack } from '@mui/material';
import { useDataset } from '../contexts/DatasetContext';
import api from '../api/axiosClient';

interface Dataset {
  name: string;
  datasetId?: string;
}

export default function Header() {
  const { selectedDataset, setSelectedDataset } = useDataset();
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        <Typography variant="h5" fontWeight="bold" color="text.primary">
          Business Intelligence Dashboard
        </Typography>

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
               {datasets.map((dataset) => (
                 <Button
                   key={dataset.name}
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
