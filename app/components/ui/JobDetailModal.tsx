import api from '@/app/api/axiosClient';
import formatter from '@/app/helpers/formatter';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Skeleton, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

interface JobDetailModalProps {
    open: boolean;
    onClose: () => void;
    jobCode: string | null;
}

const JobDetailModal = ({ open, onClose, jobCode }: JobDetailModalProps) => {
    const [jobData, setJobData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchJobDetails = async () => {
            if (!jobCode || !open) return;

            setLoading(true);
            setError(null);
            setJobData(null);

            try {
                const res = await api.post('/bi/drilldown', {
                    datasetName: 'jobs_profit_loss',
                    filters: [
                        { segmentName: 'JobCode', operator: 'eq', value: jobCode }
                    ],
                    limit: 1
                });

                if (res.data?.success && res.data?.data && res.data.data.length > 0) {
                     setJobData(res.data.data[0]);
                } else if (res.data?.success && res.data?.data?.data && res.data.data.data.length > 0) {
                     setJobData(res.data.data.data[0]);
                } else {
                    setError('Job details not found.');
                }

            } catch (err: any) {
                console.error('Error fetching job details:', err);
                setError('Failed to load job details.');
            } finally {
                setLoading(false);
            }
        };

        fetchJobDetails();
    }, [jobCode, open]);

    const DetailItem = ({ label, value, isCurrency = false, isPercent = false }: { label: string, value: any, isCurrency?: boolean, isPercent?: boolean }) => (
        <Stack spacing={0.5}>
            <Typography variant="caption" color="text.secondary" fontWeight="bold">
                {label}
            </Typography>
            <Typography variant="body1" fontWeight="medium">
                {isCurrency && typeof value === 'number'
                    ? formatter.as_currency(value)
                    : isPercent && typeof value === 'number'
                        ? `${value.toFixed(2)}%`
                        : value ?? '-'}
            </Typography>
        </Stack>
    );

    return (
        <Dialog 
            open={open} 
            onClose={onClose} 
            maxWidth="md" 
            fullWidth
            PaperProps={{
                sx: { borderRadius: 2 }
            }}
        >
            <DialogTitle sx={{ borderBottom: '1px solid', borderColor: 'divider', pb: 2 }}>
                 <Typography variant="h6" fontWeight="bold" component="span">
                    Job Details: {jobCode}
                </Typography>
            </DialogTitle>
            <DialogContent sx={{ pt: 3 }}>
                {loading ? (
                    <Box sx={{ pt: 2 }}>
                        <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 1 }} />
                    </Box>
                ) : error ? (
                    <Box sx={{ pt: 2, textAlign: 'center' }}>
                         <Typography color="error">{error}</Typography>
                    </Box>
                ) : jobData ? (
                    <Box sx={{ pt: 2 }}>
                        {/* Header Info */}
                        <Box sx={{ bgcolor: 'background.default', p: 2, borderRadius: 2, mb: 3 }}>
                             <Grid container spacing={2}>
                                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                    <DetailItem label="Customer" value={jobData.CustomerName} />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                    <DetailItem label="Salesperson" value={jobData.SalespersonName} />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                    <DetailItem label="Yard" value={jobData.Yard} />
                                </Grid>
                                 <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                    <DetailItem label="Job Start Date" value={jobData.JobStartDate ? new Date(jobData.JobStartDate).toLocaleDateString() : '-'} />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                    <DetailItem label="Job Status" value={jobData.JobStatus} />
                                </Grid>
                             </Grid>
                        </Box>

                        {/* Financials */}
                         <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ mb: 2 }}>
                            Financial Overview
                        </Typography>
                         <Grid container spacing={2} sx={{ mb: 3 }}>
                            <Grid size={{ xs: 6, sm: 4 }}>
                                <DetailItem label="Job Revenue" value={jobData.JobRevenue} isCurrency />
                            </Grid>
                            <Grid size={{ xs: 6, sm: 4 }}>
                                <DetailItem label="Total Expenses" value={jobData.TotalExpenses} isCurrency />
                            </Grid>
                            <Grid size={{ xs: 6, sm: 4 }}>
                                <DetailItem 
                                    label="Profit" 
                                    value={jobData.Profit} 
                                    isCurrency 
                                />
                            </Grid>
                             <Grid size={{ xs: 6, sm: 4 }}>
                                <DetailItem label="Profit %" value={(jobData.Profit / jobData.JobRevenue) * 100} isPercent />
                            </Grid>
                             <Grid size={{ xs: 6, sm: 4 }}>
                                <DetailItem label="Labor Hours" value={jobData.LaborHours} />
                            </Grid>
                        </Grid>

                         {/* Expense Breakdown */}
                         <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ mb: 2 }}>
                            Expense Breakdown
                        </Typography>
                         <Grid container spacing={2}>
                             <Grid size={{ xs: 6, sm: 4, md: 3 }}>
                                <DetailItem label="Labor Expenses" value={jobData.LaborExpenses} isCurrency />
                            </Grid>
                             <Grid size={{ xs: 6, sm: 4, md: 3 }}>
                                <DetailItem label="Labor Burden" value={jobData.LaborBurden} isCurrency />
                            </Grid>
                            <Grid size={{ xs: 6, sm: 4, md: 3 }}>
                                <DetailItem label="Labor Union" value={jobData.LaborUnion} isCurrency />
                            </Grid>
                            <Grid size={{ xs: 6, sm: 4, md: 3 }}>
                                <DetailItem label="Labor WC" value={jobData.LaborWC} isCurrency />
                            </Grid>
                            <Grid size={{ xs: 6, sm: 4, md: 3 }}>
                                <DetailItem label="Equipment Expenses" value={jobData.EquipmentExpenses} isCurrency />
                            </Grid>
                             <Grid size={{ xs: 6, sm: 4, md: 3 }}>
                                <DetailItem label="Materials" value={jobData.Materials} isCurrency />
                            </Grid>
                             <Grid size={{ xs: 6, sm: 4, md: 3 }}>
                                <DetailItem label="Materials Overhead" value={jobData.MaterialsOverhead} isCurrency />
                            </Grid>
                             <Grid size={{ xs: 6, sm: 4, md: 3 }}>
                                <DetailItem label="Overhead" value={jobData.Overhead} isCurrency />
                            </Grid>
                         </Grid>

                    </Box>
                ) : null}
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 3, borderTop: '1px solid', borderColor: 'divider', pt: 2 }}>
                <Button onClick={onClose} variant="outlined">Close</Button>
            </DialogActions>
        </Dialog>
    );
};

export default JobDetailModal;
