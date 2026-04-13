'use client';

import { useEffect, useState, useMemo } from 'react';
import { Box, Button, Typography, Stack } from '@mui/material';
import { useSearchParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useDataset } from '../contexts/DatasetContext';
import { useAuth } from '../contexts/AuthContext';
import LogoutIcon from '@mui/icons-material/Logout';
import api from '@/app/lib/axiosClient';

interface Dataset {
  name: string;
  datasetId?: string;
}

export default function Header() {
  const { selectedDataset, setSelectedDataset } = useDataset();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const forecastParam = searchParams.get('forecast'); // 'job' or 'quote' or 'equipment' or null
  const featureParam = searchParams.get('feature'); // 'job' or 'quote' or 'equipment' or null
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
      // Solo cargar si estamos autenticados
      const token = localStorage.getItem('auth_token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        // Fixed URL with leading slash
        const response = await api.get('/api/bi/datasets');

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

  const { logout } = useAuth();

  // Filter datasets based on forecast parameter
  const filteredDatasets = useMemo(() => {
    if (!forecastParam) {
      return datasets; // Show all datasets if no forecast filter
    }

    let prefix = '';
    if (forecastParam === 'job') prefix = 'job_';
    else if (forecastParam === 'quote') prefix = 'quote_';
    else if (forecastParam === 'equipment') prefix = 'equipment_';

    return datasets.filter((dataset) => dataset.name.toLowerCase().startsWith(prefix));
  }, [datasets, forecastParam]);

  const jobMenuItems = [
    { text: 'Forecast', path: '/jobs/revenue/forecast' },
    { text: 'P/L Dashboard', path: '/jobs/pl/dashboard' },
    { text: 'Finish Jobs', path: '/jobs/pl/dashboard/finish' },
    { text: 'Job Profit/Loss', path: '/jobs/pl/drilldown' },
    { text: 'Revenue Report', path: '/jobs/revenue' },
    { text: 'Unbilled', path: '/jobs/billing' },
    { text: 'Revenue Forecast Details', path: '/jobs/revenue/forecast/details' },
    { text: 'Revenue Forecast By Salesperson', path: '/jobs/revenue/forecast/salesperson' },
  ];

  const quoteMenuItems = [
    { text: 'Profit Forecast', path: '/quote/forecast/profit' },
    { text: 'Profit Detail', path: '/quote/forecast/detail' },
    { text: 'Forecast Comparison', path: '/quote/forecast/comparison' },
    { text: 'QPF YoY Analysis', path: '/quote/forecast/yoy' },
    { text: 'Billing', path: '/quote/billing' },
  ];

  const equipmentMenuItems = [
    { text: 'Summary', path: '/equipment/summary' },
    { text: 'Revenue', path: '/equipment/revenue' },
    { text: 'Down Report', path: '/equipment/down' },
    { text: 'Yearly Utilization', path: '/equipment/utilization' },
    { text: 'Utilization Summary', path: '/equipment/utilization/summary' },
    { text: 'CY vs PY Utilization', path: '/equipment/utilization/yearly/cyvspy' },
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
        </Stack>

        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          sx={{ minWidth: 0, flex: 1, justifyContent: 'flex-end', overflow: 'hidden' }}
        >
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
              '&::-webkit-scrollbar': { height: '6px' },
              '&::-webkit-scrollbar-track': { background: 'transparent' },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: 'rgba(0,0,0,0.1)',
                borderRadius: '4px',
                '&:hover': { backgroundColor: 'rgba(0,0,0,0.2)' },
              },
              scrollbarWidth: 'thin',
            }}
          >
            {/* Navigation Items (converted from Tabs) */}
            {pathname === '/' &&
              !loading &&
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

          {/* Logout Section */}
          <Button
            variant="outlined"
            onClick={logout}
            startIcon={<LogoutIcon />}
            size="small"
            sx={{
              borderRadius: '50px',
              textTransform: 'none',
              fontWeight: 'medium',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              color: 'text.secondary',
              borderColor: 'divider',
              '&:hover': {
                bgcolor: 'error.lighter',
                color: 'error.main',
                borderColor: 'error.light',
              },
            }}
          >
            Logout
          </Button>
        </Stack>
      </Box>

      {/* Bottom Bar: Page Title */}
      <Box sx={{ px: 4, py: 2, display: 'flex', flexDirection: 'row', gap: 4, alignItems: 'center' }}>
        <Typography
          variant="h5"
          fontWeight="bold"
          color="text.primary"
          component={Link}
          href={featureParam ? `/?feature=${featureParam}&forecast=${featureParam}` : '/'}
        >
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
            '&::-webkit-scrollbar-track': { background: 'transparent' },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'rgba(0,0,0,0.1)',
              borderRadius: '4px',
              '&:hover': { backgroundColor: 'rgba(0,0,0,0.2)' },
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
          {featureParam === 'quote' &&
            quoteMenuItems.map((item) => {
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
          {featureParam === 'equipment' &&
            equipmentMenuItems.map((item) => {
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
