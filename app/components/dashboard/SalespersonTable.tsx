import { 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow, 
    Paper, 
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography
} from '@mui/material';
import { useState } from 'react';
import formatter from '@/app/helpers/formatter';

// Define interfaces for data structure
export interface MonthlyData {
    month: string;
    target: number;
    estRevenue: number;
    actRevenue: number;
    newCustomers: number;
    newCustEstRev: number;
    newCustActRev: number;
}

export interface SalespersonData {
    id: string;
    name: string;
    target: number;
    estRevenue: number;
    actRevenue: number;
    newCustomers: number;
    newCustEstRev: number;
    newCustActRev: number;
    monthlyData: MonthlyData[];
}

interface SalespersonTableProps {
    data: SalespersonData[];
    maxHeight?: string | number;
}

interface MonthlyBreakdownModalProps {
    open: boolean;
    onClose: () => void;
    data: SalespersonData | null;
}

const MonthlyBreakdownModal = ({ open, onClose, data }: MonthlyBreakdownModalProps) => {
    if (!data) return null;

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
                    Monthly Breakdown - {data.name}
                </Typography>
            </DialogTitle>
            <DialogContent sx={{ pt: 3, px: 3 }}>
                <TableContainer sx={{ maxHeight: '60vh' }}>
                    <Table stickyHeader aria-label="monthly breakdown">
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold', fontSize: '0.75rem', bgcolor: 'primary.main', color: 'common.white' }}>MONTH</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '0.75rem', bgcolor: 'primary.main', color: 'common.white' }}>REVENUE GOAL</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '0.75rem', bgcolor: 'primary.main', color: 'common.white' }}>ACT. REVENUE</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '0.75rem', bgcolor: 'primary.main', color: 'common.white' }}>VARIANCE</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '0.75rem', bgcolor: 'primary.main', color: 'common.white' }}>VARIANCE %</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.monthlyData.map((historyRow) => (
                                <TableRow key={historyRow.month} hover>
                                    <TableCell component="th" scope="row" sx={{ fontWeight: 500 }}>{historyRow.month}</TableCell>
                                    <TableCell align="right">{formatter.as_currency(historyRow.target, false)}</TableCell>
                                    <TableCell align="right">{formatter.as_currency(historyRow.actRevenue, false)}</TableCell>
                                    <TableCell align="right" sx={{ color: historyRow.estRevenue - historyRow.target >= 0 ? 'success.main' : 'error.main' }}>
                                        {formatter.as_currency(historyRow.estRevenue - historyRow.target, false)}
                                    </TableCell>
                                    <TableCell align="right" sx={{ color: historyRow.estRevenue - historyRow.target >= 0 ? 'success.main' : 'error.main' }}>
                                        {formatter.as_percent(historyRow.target ? ((historyRow.estRevenue - historyRow.target) / historyRow.target) * 100 : 0)}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2, borderTop: '1px solid', borderColor: 'divider', pt: 2 }}>
                <Button onClick={onClose} variant="outlined">Close</Button>
            </DialogActions>
        </Dialog>
    );
};

export default function SalespersonTable({ data, maxHeight = 500 }: SalespersonTableProps) {
    const [selectedRow, setSelectedRow] = useState<SalespersonData | null>(null);

    const handleRowClick = (row: SalespersonData) => {
        setSelectedRow(row);
    };

    const handleClose = () => {
        setSelectedRow(null);
    };

    return (
        <>
            <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2, boxShadow: '0 1px 3px 0 rgba(0,0,0,0.1)', maxHeight: maxHeight }}>
                <Table aria-label="salesperson table" size="small" stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold', fontSize: '0.75rem', bgcolor: 'primary.main', color: 'common.white' }}>SALESPERSON</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '0.75rem', bgcolor: 'primary.main', color: 'common.white' }}>REVENUE GOAL</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '0.75rem', bgcolor: 'primary.main', color: 'common.white' }}>ACT. REVENUE</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '0.75rem', bgcolor: 'primary.main', color: 'common.white' }}>VARIANCE</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '0.75rem', bgcolor: 'primary.main', color: 'common.white' }}>VARIANCE %</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((row) => (
                            <TableRow 
                                key={row.id} 
                                hover 
                                onClick={() => handleRowClick(row)}
                                sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}
                            >
                                <TableCell component="th" scope="row" sx={{ fontWeight: 500 }}>
                                    {row.name}
                                </TableCell>
                                <TableCell align="right">{formatter.as_currency(row.target, false)}</TableCell>
                                <TableCell align="right">{formatter.as_currency(row.actRevenue, false)}</TableCell>
                                <TableCell align="right" sx={{ color: row.estRevenue - row.target >= 0 ? 'success.main' : 'error.main' }}>
                                    {formatter.as_currency(row.estRevenue - row.target, false)}
                                </TableCell>
                                <TableCell align="right" sx={{ color: row.estRevenue - row.target >= 0 ? 'success.main' : 'error.main' }}>
                                    {formatter.as_percent(row.target ? ((row.estRevenue - row.target) / row.target) * 100 : 0)}
                                </TableCell>
                            </TableRow>
                        ))}
                        {/* Total Row */}
                         <TableRow sx={{ bgcolor: 'action.selected' }}>
                            <TableCell sx={{ fontWeight: 'bold', fontSize: '0.875rem' }}>Total</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '0.875rem' }}>
                                {formatter.as_currency(data.reduce((acc, curr) => acc + curr.target, 0), false)}
                            </TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '0.875rem' }}>
                                {formatter.as_currency(data.reduce((acc, curr) => acc + curr.actRevenue, 0), false)}
                            </TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '0.875rem' }}>
                                {formatter.as_currency(data.reduce((acc, curr) => acc + (curr.estRevenue - curr.target), 0), false)}
                            </TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '0.875rem' }}>
                               -
                            </TableCell>
                         </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>

            <MonthlyBreakdownModal 
                open={!!selectedRow} 
                onClose={handleClose} 
                data={selectedRow} 
            />
        </>
    );
}
