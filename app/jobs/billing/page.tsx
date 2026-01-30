'use client';

import { Box, Stack, Typography, CircularProgress, Grid } from '@mui/material';
import { useState, useEffect } from 'react';
import SegmentSelector from '../../components/dashboard/SegmentSelector';
import JobsUnbilledTable, { JobsUnbilledData } from '../../components/dashboard/JobsUnbilledTable';
import api from '../../api/axiosClient';

export default function JobsBilledUnbilledRecurringPage() {
    const DATASET_NAME = 'jobs_profit_loss'; // Using consistent dataset

    // Filter States
    const [yard, setYard] = useState<string | null>(null);
    const [jobNo, setJobNo] = useState<string | null>(null);
    const [jobStatus, setJobStatus] = useState<string | null>(null);
    const [salesperson, setSalesperson] = useState<string | null>(null);
    const [customer, setCustomer] = useState<string | null>(null); // Added Customer as it's common

    // Dropdown Data States
    const [yards, setYards] = useState<string[]>([]);
    const [jobNos, setJobNos] = useState<string[]>([]);
    const [jobStatuses, setJobStatuses] = useState<string[]>([]);
    const [salespeople, setSalespeople] = useState<string[]>([]);
    const [customers, setCustomers] = useState<string[]>([]);

    // Loading States
    const [loadingFilters, setLoadingFilters] = useState(false);
    const [loadingTable, setLoadingTable] = useState(false);
    const [tableData, setTableData] = useState<JobsUnbilledData[]>([]);

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
            fetchFilterData('JobCode', setJobNos),
            fetchFilterData('JobStatus', setJobStatuses),
            fetchFilterData('SalesPerson', setSalespeople),
            fetchFilterData('Customer', setCustomers)
        ]);
        setLoadingFilters(false);
    };

    useEffect(() => {
        loadFilters();
    }, []);

    // Fetch Table Data
    useEffect(() => {
        const fetchTableData = async () => {
            setLoadingTable(true);
            try {
                // Construct Filters
                const currentFilters = [
                    ...(yard && yard !== 'All' ? [{ segmentName: 'Yard', operator: 'eq', value: yard }] : []),
                    ...(jobNo && jobNo !== 'All' ? [{ segmentName: 'JobCode', operator: 'eq', value: jobNo }] : []),
                    ...(jobStatus && jobStatus !== 'All' ? [{ segmentName: 'JobStatus', operator: 'eq', value: jobStatus }] : []),
                    ...(salesperson && salesperson !== 'All' ? [{ segmentName: 'SalesPerson', operator: 'eq', value: salesperson }] : []),
                    ...(customer && customer !== 'All' ? [{ segmentName: 'Customer', operator: 'eq', value: customer }] : [])
                ];

                const requestBody = {
                    datasetName: DATASET_NAME,
                    filters: currentFilters,
                    pagination: { page: 1, pageSize: 1000 },
                    columns: [
                        'JobCode', 'JobStatus', 'Customer', 'JobStartDate', 'JobEndDate', 
                        'SalesPerson', 'LastInvoiceDate', 'EstRevenue', 'ActRevenue' 
                    ] 
                };

                const res = await api.post('/bi/drilldown', requestBody);

                if (res.data?.success || (res.data?.data && Array.isArray(res.data.data?.data))) {
                    const rows = res.data.data?.data || res.data.data || [];
                    const mappedRows: JobsUnbilledData[] = rows.map((row: any) => ({
                        jobNo: row.JobCode,
                        jobStatus: row.JobStatus,
                        customer: row.Customer,
                        jobStart: row.JobStartDate,
                        jobEnd: row.JobEndDate,
                        salesperson: row.SalesPerson,
                        lastInvDate: row.LastInvoiceDate || '',
                        totalToBeBilled: parseFloat(row.EstRevenue || 0), 
                        billedTillNow: parseFloat(row.ActRevenue || 0),   
                        remToBilled: parseFloat(row.EstRevenue || 0) - parseFloat(row.ActRevenue || 0) 
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
    }, [yard, jobNo, jobStatus, salesperson, customer]);

    return (
        <Box sx={{ height: 'calc(100vh - 100px)', display: 'flex', flexDirection: 'column', p: 3, bgcolor: 'background.default', overflow: 'hidden' }}>
            <Stack spacing={3} sx={{ height: '100%' }}>
                {/* Header & Filters */}
                <Box sx={{ flexShrink: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
                    <Box sx={{ py: 1, px: 2, bgcolor: '#e0e0e0', borderRadius: 1 }}> {/* Grey background as in image */}
                        <Typography variant="h6" fontWeight="bold" color="text.primary">
                            Jobs Billed/Unbilled/Recurring Summary
                        </Typography>
                    </Box>
                    <Grid container spacing={2} sx={{ mb: 2 }}>
                        <Grid size={{ xs: 12, sm: 6, md: 'auto' }}>
                            <SegmentSelector 
                                label='Yard'
                                segments={yards} 
                                selectedSegment={yard} 
                                onSelect={setYard}
                                loading={loadingFilters}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 'auto' }}>
                             <SegmentSelector 
                                label='Job No'
                                segments={jobNos} 
                                selectedSegment={jobNo} 
                                onSelect={setJobNo}
                                loading={loadingFilters}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 'auto' }}>
                            <SegmentSelector 
                                label='Job Status'
                                segments={jobStatuses} 
                                selectedSegment={jobStatus} 
                                onSelect={setJobStatus}
                                loading={loadingFilters}
                            />
                        </Grid>
                         <Grid size={{ xs: 12, sm: 6, md: 'auto' }}>
                            <SegmentSelector 
                                label='Salesperson'
                                segments={salespeople} 
                                selectedSegment={salesperson} 
                                onSelect={setSalesperson}
                                loading={loadingFilters}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 'auto' }}>
                            <SegmentSelector 
                                label='Customer'
                                segments={customers} 
                                selectedSegment={customer} 
                                onSelect={setCustomer}
                                loading={loadingFilters}
                            />
                        </Grid>
                    </Grid>
                </Box>

                {/* Table */}
                <Box sx={{ flexGrow: 1, overflow: 'hidden', minHeight: 0, position: 'relative' }}>
                     {loadingTable && (
                        <Box sx={{ 
                            position: 'absolute', 
                            top: 0, 
                            left: 0, 
                            right: 0, 
                            bottom: 0, 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            bgcolor: 'rgba(255,255,255,0.7)', 
                            zIndex: 1 
                        }}>
                            <CircularProgress />
                        </Box>
                    )}
                    <JobsUnbilledTable data={tableData} />
                </Box>
            </Stack>
        </Box>
    );
}
