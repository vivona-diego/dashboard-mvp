'use client';

import { useEffect, useState, useMemo } from 'react';
import { Box, Button, Typography, Stack } from '@mui/material';
import { useSearchParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useDataset } from '../contexts/DatasetContext';
import api from '../api/axiosClient';

interface Dataset {
  name: string;
  datasetId?: string;
}

export default function Header() {
  const { selectedDataset, setSelectedDataset } = useDataset();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const forecastParam = searchParams.get('forecast'); // 'job' or 'quote' or null
  const featureParam = searchParams.get('feature'); // 'job' or null
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

    const prefixes = forecastParam === 'job' ? 'job_' : 'quote_';
    return datasets.filter((dataset) => dataset.name.toLowerCase().startsWith(prefixes));
  }, [datasets, forecastParam]);

  const jobMenuItems = [
    { text: 'Job Forecast', path: '/jobs/revenue/forecast' },
    { text: 'Job P/L Dashboard', path: '/jobs/pl/dashboard' },
    { text: 'Job Profit/(Loss) Drilldown', path: '/jobs/pl/drilldown' },
    { text: 'Jobs Revenue Report', path: '/jobs/revenue' },
    { text: 'Jobs Unbilled', path: '/jobs/billing' },
    { text: 'Jobs Revenue Forecast Report By Salesperson', path: '/jobs/revenue/forecast/salesperson' },
  ];

  if (!isMounted) {
    return null;
  }

  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        boxShadow: '0 1px 3px 0 rgb(0/ 0.1)',
      }}
    >
      {/* Top Bar */}
      <Box
        sx={{
          borderBottom: '1px solid',
          borderColor: 'divider',
          px: 4,
          py: 1.5,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {/* Left: Branding */}
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="subtitle1" fontWeight="bold" color="text.primary">
            Business Intelligence
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            | FCC
          </Typography>
        </Stack>

        {/* Right: Navigation & Datasets */}
        <Stack
             direction="row"
             spacing={1}
             alignItems="center"
             sx={{ 
                maxWidth: '100%', 
                minWidth: 0, 
                overflowX: 'auto',
                pb: { xs: 1, md: 0 }, 
                // Restore scrollbar for mouse users, style it nicely
                '&::-webkit-scrollbar': { height: '6px' },
                '&::-webkit-scrollbar-track': {  background: 'transparent' },
                '&::-webkit-scrollbar-thumb': { 
                    backgroundColor: 'rgba(0,0,0,0.1)', 
                    borderRadius: '4px',
                    '&:hover': { backgroundColor: 'rgba(0,0,0,0.2)' }
                },
                scrollbarWidth: 'thin', // Firefox
             }}
        >
          {/* Navigation Items (converted from Tabs) */}
          {!loading &&
            !error &&
            filteredDatasets.length > 0 &&
            filteredDatasets.map((item) => {
              const isActive = selectedDataset === item.name;
              return (
                <Button
                  key={item.name}
                  variant={isActive ? 'contained' : 'outlined'}
                  onClick={() => handleDatasetClick(item.name)}
                  sx={{
                    borderRadius: '50px',
                    textTransform: 'none',
                    fontWeight: 'medium',
                    px: 2,
                    py: 0.5,
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                    color: isActive ? 'text.primary' : 'text.secondary',
                    borderColor: isActive ? 'transparent' : 'divider',
                    bgcolor: isActive ? 'action.selected' : 'transparent',
                    boxShadow: 'none',
                    '&:hover': {
                      bgcolor: isActive ? 'action.selected' : 'action.hover',
                      borderColor: isActive ? 'transparent' : 'divider',
                    },
                  }}
                >
                  {item.name.replace(/_/g, ' ')}
                </Button>
              );
            })}
        </Stack>
      </Box>

      {/* Bottom Bar: Page Title */}
      <Box sx={{ px: 4, py: 2, display: 'flex', flexDirection: 'row', gap: 4, alignItems: 'center' }}>
        <Typography variant="h5" fontWeight="bold" color="text.primary" component={Link} href={featureParam ? `/?feature=${featureParam}&forecast=${featureParam}` : '/'}>
          {forecastParam ? forecastParam.charAt(0).toUpperCase() + forecastParam.slice(1) : 'BI Dashboard'}
        </Typography>
        <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{ 
                maxWidth: '100%', 
                minWidth: 0, 
                overflowX: 'auto',
                pb: 1, // Ensure space for scrollbar
                '&::-webkit-scrollbar': { height: '6px' },
                '&::-webkit-scrollbar-track': {  background: 'transparent' },
                '&::-webkit-scrollbar-thumb': { 
                    backgroundColor: 'rgba(0,0,0,0.1)', 
                    borderRadius: '4px',
                    '&:hover': { backgroundColor: 'rgba(0,0,0,0.2)' }
                },
                scrollbarWidth: 'thin',
             }}
        >
          {featureParam === 'job' &&
            jobMenuItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Button
                  key={item.path}
                  component={Link}
                  href={`${item.path}?feature=${featureParam}&forecast=${featureParam}`}
                  variant={isActive ? 'contained' : 'outlined'}
                  color="inherit"
                  sx={{
                    borderRadius: '50px',
                    textTransform: 'none',
                    fontWeight: 'medium',
                    px: 2,
                    py: 0.5,
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                    borderColor: isActive ? 'transparent' : 'divider',
                    bgcolor: isActive ? 'action.selected' : 'transparent',
                    boxShadow: 'none',
                    '&:hover': {
                      bgcolor: isActive ? 'action.selected' : 'action.hover',
                      borderColor: isActive ? 'transparent' : 'divider',
                    },
                  }}
                >
                  {item.text}
                </Button>
              );
            })}
        </Stack>
      </Box>
    </Box>
  );
}
