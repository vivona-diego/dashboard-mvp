'use client';

import { Box, Stack, Typography, Grid, Paper, CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import ForecastDetailsTable, { ForecastDetailRow } from '../../../../components/dashboard/ForecastDetailsTable';
import SegmentSelector from '../../../../components/dashboard/SegmentSelector';
import formatter from '@/app/helpers/formatter';
import api from '../../../../api/axiosClient';

export default function ForecastDetailsPage() {
  const DATASET_NAME = 'jobs_profit_loss';

  // State for filters
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [selectedYard, setSelectedYard] = useState<string | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [selectedSalesperson, setSelectedSalesperson] = useState<string | null>(null);
  const [selectedJobCode, setSelectedJobCode] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);

  // Data Lists for Dropdowns
  const [yards, setYards] = useState<string[]>([]);
  const [customers, setCustomers] = useState<string[]>([]);
  const [salespeople, setSalespeople] = useState<string[]>([]);
  const [jobCodes, setJobCodes] = useState<string[]>([]);
  const [companies, setCompanies] = useState<string[]>([]);
  const [years, setYears] = useState<string[]>([]);

  // Job Status not used in UI yet but requested logic included it, can skip if no UI element

  // Loading States
  const [loadingFilters, setLoadingFilters] = useState(false);

  // Data States
  const [tableData, setTableData] = useState<ForecastDetailRow[]>([]);
  const [loadingTable, setLoadingTable] = useState(false);

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
      fetchFilterData('Company', setCompanies),
      fetchFilterData('JobYear', setYears),
    ]);
    setLoadingFilters(false);
  };

  useEffect(() => {
    loadFilters();
  }, []);

  // Construct Filters Object
  const currentFilters = [
    ...(selectedCompany ? [{ segmentName: 'Company', operator: 'eq', value: selectedCompany }] : []),
    ...(selectedYard && selectedYard !== 'All' ? [{ segmentName: 'Yard', operator: 'eq', value: selectedYard }] : []),
    ...(selectedCustomer && selectedCustomer !== 'All'
      ? [{ segmentName: 'Customer', operator: 'eq', value: selectedCustomer }]
      : []),
    ...(selectedSalesperson && selectedSalesperson !== 'All'
      ? [{ segmentName: 'SalesPerson', operator: 'eq', value: selectedSalesperson }]
      : []),
    ...(selectedJobCode && selectedJobCode !== 'All'
      ? [{ segmentName: 'JobCode', operator: 'eq', value: selectedJobCode }]
      : []),
    ...(selectedYear && selectedYear !== 'All'
      ? [{ segmentName: 'JobYear', operator: 'eq', value: selectedYear }]
      : []),
  ];

  // Fetch Table Data
  useEffect(() => {
    const fetchTableData = async () => {
      setLoadingTable(true);
      try {
        const requestBody = {
          datasetName: DATASET_NAME,
          filters: currentFilters,
          pagination: { page: 1, pageSize: 1000 }, // Fetch reasonable amount
          columns: [
            'JobMonth',
            'JobYear',
            'Customer',
            'JobCode',
            'JobStartDate',
            'JobEndDate',
            'JobSite',
            'SalesPerson',
            'EstRevenue',
            'ActRevenue',
            'LastModifiedBy',
            'ModifiedDate',
          ],
        };

        const res = await api.post('/bi/drilldown', requestBody);

        if (res.data?.success || (res.data?.data && Array.isArray(res.data.data?.data))) {
          const rows = res.data.data?.data || res.data.data || [];
          const mappedRows: ForecastDetailRow[] = rows.map((row: any) => ({
            month: row.JobMonth,
            year: row.JobYear,
            customer: row.Customer,
            jobCode: row.JobCode,
            startDate: row.JobStartDate,
            endDate: row.JobEndDate,
            jobSite: row.JobSite,
            salesperson: row.SalesPerson,
            estRevenue: parseFloat(row.EstRevenue || 0),
            actRevenue: parseFloat(row.ActRevenue || 0),
            lastModifiedBy: row.LastModifiedBy,
            modifiedDate: row.ModifiedDate,
          }));
          setTableData(mappedRows);
        } else {
          setTableData([]);
        }
      } catch (error) {
        console.error('Error fetching table data:', error);
        setTableData([]);
      } finally {
        setLoadingTable(false);
      }
    };

    fetchTableData();
  }, [selectedCompany, selectedYard, selectedCustomer, selectedSalesperson, selectedJobCode, selectedYear]);

  // Calculate Summary Metrics
  const totalEstRevenue = tableData.reduce((acc, curr) => acc + (curr.estRevenue || 0), 0);
  const totalActRevenue = tableData.reduce((acc, curr) => acc + (curr.actRevenue || 0), 0);

  return (
    <Box
      sx={{
        p: 3,
        bgcolor: 'background.default',
        height: 'calc(100vh - 64px)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <Box sx={{ mb: 2, bgcolor: '#f5f5f5', p: 2, borderRadius: 1, flexShrink: 0 }}>
        <Typography variant="h5" fontWeight="bold" color="text.primary">
          Jobs Revenue Forecast Details Report
        </Typography>
      </Box>

      {/* Filters Section */}
      <Paper elevation={0} sx={{ p: 3, mb: 2, borderRadius: 2, flexShrink: 0 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 3 }}>
            <SegmentSelector
              label="Select a Company"
              segments={companies}
              selectedSegment={selectedCompany}
              onSelect={setSelectedCompany}
              loading={loadingFilters}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <SegmentSelector
              label="Select a Yard"
              segments={yards}
              selectedSegment={selectedYard}
              onSelect={setSelectedYard}
              loading={loadingFilters}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <SegmentSelector
              label="Salesperson"
              segments={salespeople}
              selectedSegment={selectedSalesperson}
              onSelect={setSelectedSalesperson}
              loading={loadingFilters}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <SegmentSelector
              label="Customer"
              segments={customers}
              selectedSegment={selectedCustomer}
              onSelect={setSelectedCustomer}
              loading={loadingFilters}
            />
          </Grid>

          {/* Row 2 Filters */}
          <Grid size={{ xs: 12, md: 3 }}>
            <SegmentSelector
              label="Job Code"
              segments={jobCodes}
              selectedSegment={selectedJobCode}
              onSelect={setSelectedJobCode}
              loading={loadingFilters}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <SegmentSelector
              label="Year, Month"
              segments={years}
              selectedSegment={selectedYear}
              onSelect={setSelectedYear}
              loading={loadingFilters}
            />
          </Grid>

          {/* Summary Metrics */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Stack direction="row" spacing={8} justifyContent="flex-end" alignItems="center">
              <Box textAlign="center">
                <Typography variant="h3" fontWeight="bold" color="text.primary">
                  {formatter.as_currency(totalEstRevenue, true)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Est. Revenue
                </Typography>
              </Box>
              <Box textAlign="center">
                <Typography variant="h3" fontWeight="bold" color="text.primary">
                  {formatter.as_currency(totalActRevenue, true)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Act. Revenue
                </Typography>
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      {/* Data Table */}
      <Box sx={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', position: 'relative' }}>
        {loadingTable && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'rgba(255,255,255,0.7)',
              zIndex: 1,
            }}
          >
            <CircularProgress />
          </Box>
        )}
        <ForecastDetailsTable data={tableData} />
      </Box>
    </Box>
  );
}
