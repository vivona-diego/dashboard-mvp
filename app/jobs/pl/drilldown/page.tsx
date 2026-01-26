'use client';

import { Box, Grid, Stack, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import api from '../../../api/axiosClient';
import SegmentSelector from '../../../components/dashboard/SegmentSelector';
import QueryChart from '../../../components/dashboard/charts/QueryChart';
import TableTile from '../../../components/dashboard/charts/TableTile';

const DATASET_NAME = 'jobs_profit_loss';

export default function JobsPLDrilldownPage() {
  // Filter States
  const [selectedYard, setSelectedYard] = useState<string | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [selectedSalesperson, setSelectedSalesperson] = useState<string | null>(null);
  const [selectedJobCode, setSelectedJobCode] = useState<string | null>(null);
  const [selectedJobStatus, setSelectedJobStatus] = useState<string | null>(null);

  // Data Lists for Dropdowns
  const [yards, setYards] = useState<string[]>([]);
  const [customers, setCustomers] = useState<string[]>([]);
  const [salespeople, setSalespeople] = useState<string[]>([]);
  const [jobCodes, setJobCodes] = useState<string[]>([]);
  const [jobStatuses, setJobStatuses] = useState<string[]>([]);

  // Loading States
  const [loadingFilters, setLoadingFilters] = useState(false);

  // Dates
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  // Fetch Filters
  const fetchFilterData = async (segmentName: string, setter: (data: string[]) => void) => {
    try {
      const res = await api.get('/bi/segment-values', {
        params: {
          datasetName: DATASET_NAME,
          segmentName: segmentName,
          limit: 100,
        },
      });
      const values = res.data?.data?.values || res.data?.values || [];
      setter(values.map((v: any) => v.displayValue));
    } catch (error) {
      console.error(`Error fetching ${segmentName}:`, error);
    }
  };

  const loadFilters = async () => {
    setLoadingFilters(true);
    await Promise.all([
      fetchFilterData('Yard', setYards),
      fetchFilterData('Customer', setCustomers),
      fetchFilterData('SalesPerson', setSalespeople),
      fetchFilterData('JobCode', setJobCodes),
      fetchFilterData('JobStatusCode', setJobStatuses),
    ]);
    setLoadingFilters(false);
  };

  useEffect(() => {
    loadFilters();
  }, []);

  const FILTERS = [
    ...(startDate && endDate
      ? [{ segmentName: 'JobStartDate', operator: 'between', value: startDate, secondValue: endDate }]
      : []),
    ...(selectedYard ? [{ segmentName: 'Yard', operator: 'eq', value: selectedYard }] : []),
    ...(selectedCustomer ? [{ segmentName: 'Customer', operator: 'eq', value: selectedCustomer }] : []),
    ...(selectedSalesperson ? [{ segmentName: 'SalesPerson', operator: 'eq', value: selectedSalesperson }] : []),
    ...(selectedJobCode ? [{ segmentName: 'JobCode', operator: 'eq', value: selectedJobCode }] : []),
    ...(selectedJobStatus ? [{ segmentName: 'JobStatus', operator: 'eq', value: selectedJobStatus }] : []),
  ];

  return (
    <Box sx={{ p: { xs: 1, md: 3 }, bgcolor: 'background.default', minHeight: '100vh' }}>
      {/* Header */}
      <Box
        sx={{
          bgcolor: 'background.paper',
          p: 2,
          borderRadius: 2,
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
          mb: 3,
        }}
      >
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', md: 'center' }}
          spacing={2}
        >
          <Typography variant="h5" fontWeight="bold" color="text.primary">
            Job Profit/(Loss) Drilldown Report
          </Typography>

          {/* Date Range */}
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            alignItems={{ xs: 'stretch', sm: 'center' }}
            width={{ xs: '100%', sm: 'auto' }}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Typography
                variant="caption"
                color="text.secondary"
                fontWeight="bold"
                display={{ xs: 'none', sm: 'block' }}
                sx={{ textTransform: 'uppercase', letterSpacing: 0.5, fontSize: '0.75rem' }}
              >
                Date Range
              </Typography>
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{
                  bgcolor: 'background.default',
                  p: 0.5,
                  borderRadius: 1.5,
                  border: '1px solid',
                  borderColor: 'divider',
                  width: { xs: '100%', sm: 'auto' },
                  justifyContent: 'space-between',
                }}
              >
                <TextField
                  type="date"
                  size="small"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                    '& .MuiInputBase-input': { py: 0.5, fontSize: '0.875rem' },
                    width: { xs: '130px', sm: 'auto' },
                  }}
                />
                <Typography variant="body2" color="text.secondary">
                  -
                </Typography>
                <TextField
                  type="date"
                  size="small"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                    '& .MuiInputBase-input': { py: 0.5, fontSize: '0.875rem' },
                    width: { xs: '130px', sm: 'auto' },
                  }}
                />
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      </Box>

      <Grid container spacing={{ xs: 2, md: 3 }}>
        {/* Row 1: Sidebar Filters & Top Charts */}
        <Grid size={{ xs: 12, md: 3, lg: 3 }}>
          <Stack
            spacing={2}
            sx={{
              p: 2,
              height: '100%',
              bgcolor: 'background.paper',
              borderRadius: 2,
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
            }}
          >
            <SegmentSelector
              label="Select a Yard"
              segments={yards}
              selectedSegment={selectedYard}
              onSelect={setSelectedYard}
              loading={loadingFilters}
              orientation="vertical"
            />
            <SegmentSelector
              label="Select a Customer"
              segments={customers}
              selectedSegment={selectedCustomer}
              onSelect={setSelectedCustomer}
              loading={loadingFilters}
              orientation="vertical"
            />
            <SegmentSelector
              label="Select a Salesperson"
              segments={salespeople}
              selectedSegment={selectedSalesperson}
              onSelect={setSelectedSalesperson}
              loading={loadingFilters}
              orientation="vertical"
            />
            <SegmentSelector
              label="Select a Job Code"
              segments={jobCodes}
              selectedSegment={selectedJobCode}
              onSelect={setSelectedJobCode}
              loading={loadingFilters}
              orientation="vertical"
            />
            <SegmentSelector
              label="Select a Job Status"
              segments={jobStatuses}
              selectedSegment={selectedJobStatus}
              onSelect={setSelectedJobStatus}
              loading={loadingFilters}
              orientation="vertical"
            />
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, md: 9, lg: 9 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, lg: 6 }}>
              <QueryChart
                title="Profit % by Yard & Department"
                datasetName={DATASET_NAME}
                groupBySegments={['Yard']}
                metricName="Profit"
                chartType="bar"
                filters={FILTERS}
                height={300}
                color="#00bfa5"
              />
            </Grid>
            <Grid size={{ xs: 12, lg: 6 }}>
              <TableTile
                title="Summary"
                datasetName={DATASET_NAME}
                groupBySegments={['Yard']}
                metrics={['JobRevenue', 'TotalExpenses', 'Profit']}
                filters={FILTERS}
                height={300}
              />
            </Grid>
          </Grid>
        </Grid>

        {/* Row 2: Detailed Job Data (Full Width) */}
        <Grid size={12}>
          <Box sx={{ height: 600 }}>
            <TableTile
              title="Detailed Job Data"
              datasetName={DATASET_NAME}
              groupBySegments={[]}
              metrics={[]}
              useDrilldown={true}
              columns={[
                'JobCode',
                'Customer',
                'SalesPerson',
                'Department',
                'JobRevenue',
                'TotalExpenses',
                'Profit',
                'ProfitPercent',
                'LaborExpenses',
                'LaborBurden',
                'LaborUnion',
                'LaborWC',
                'EquipmentExpenses',
                'Materials',
                'MaterialsOverhead',
                'Overhead',
                'LaborHours',
              ]}
              filters={FILTERS}
              height={600}
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
