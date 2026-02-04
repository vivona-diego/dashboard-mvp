import TableTile from '@/app/components/dashboard/charts/TableTile';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';

interface DrilldownListModalProps {
    open: boolean;
    onClose: () => void;
    type: 'SalesPerson' | 'Customer' | null;
    value: string | null;
    dateFilters?: { startDate?: string; endDate?: string };
    onJobClick: (jobCode: string) => void;
}

const DrilldownListModal = ({ open, onClose, type, value, dateFilters, onJobClick }: DrilldownListModalProps) => {
    
    if (!type || !value) return null;

    const datasetName = 'jobs_profit_loss';
    const filters = [
        { segmentName: type, operator: 'eq', value: value },
        ...(dateFilters?.startDate && dateFilters?.endDate 
            ? [{ segmentName: 'JobStartDate', operator: 'between', value: dateFilters.startDate, secondValue: dateFilters.endDate }]
            : [])
    ];

    const columns = type === 'SalesPerson' 
        ? ["JobCode", "CustomerName", "Yard", "JobStartDate", "JobStatus", "JobRevenue", "TotalExpenses", "Profit", "LaborHours"]
        : ["JobCode", "SalespersonName", "Yard", "JobStartDate", "JobStatus", "JobRevenue", "TotalExpenses", "Profit"];

    const handleRowClick = (row: any) => {
        if (row && row.JobCode) {
            onJobClick(row.JobCode);
        }
    };

    return (
        <Dialog 
            open={open} 
            onClose={onClose} 
            maxWidth="xl" 
            fullWidth
            PaperProps={{
                sx: { borderRadius: 2, height: '80vh', display: 'flex', flexDirection: 'column' }
            }}
        >
            <DialogTitle component="div" sx={{ borderBottom: '1px solid', borderColor: 'divider', pb: 2 }}>
                <Box>
                    <Typography variant="h6" fontWeight="bold">
                        {type === 'SalesPerson' ? 'Salesperson' : 'Customer'} Drilldown: {value}
                    </Typography>
                     <Typography variant="caption" color="text.secondary">
                        Showing jobs for {value}
                    </Typography>
                </Box>
            </DialogTitle>
            <DialogContent sx={{ p: 0, flex: 1, overflow: 'hidden', bgcolor: 'background.default' }}>
                <Box sx={{ height: '100%', p: 2 }}>
                    <TableTile 
                         title={`Jobs List`}
                         datasetName={datasetName}
                         groupBySegments={['JobCode']} // Not used in drilldown mode but required by props
                         metrics={[]}
                         useDrilldown={true}
                         filters={filters}
                         columns={columns}
                         height="100%"
                         onRowClick={handleRowClick}
                    />
                </Box>
            </DialogContent>
            <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                <Button onClick={onClose} variant="outlined">Close</Button>
            </DialogActions>
        </Dialog>
    );
};

export default DrilldownListModal;
