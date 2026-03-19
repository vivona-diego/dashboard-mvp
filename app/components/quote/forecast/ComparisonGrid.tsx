'use client';

import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Tooltip,
    IconButton,
    Chip,
} from '@mui/material';
import LinkIcon from '@mui/icons-material/Link';
import formatter from '@/app/helpers/formatter';

export interface ComparisonGridData {
    id: string;
    quoteNo: string;
    customer: string;
    date: string;
    estimatedDollar: number;
    expenseDollar: number;
    netProfit: number;
    marginPct: number;
    jobCode: string | null;
    hasLink: boolean;
    startDt: string | null;
    endDt: string | null;
    status: string | null;
    actRevenue: number | null;
    actExpense: number | null;
    profitDollar: number | null;
    profitPct: number | null;
    varDollar: number | null;
    varPct: number | null;
}

interface ComparisonGridProps {
    data: ComparisonGridData[];
}

const headerCellSx = {
    fontWeight: 'bold',
    fontSize: '0.7rem',
    bgcolor: 'primary.main',
    color: 'common.white',
    whiteSpace: 'nowrap',
    py: 1,
};

const cellSx = { fontSize: '0.72rem', py: 0.75 };

function fmt(val: number | null, isCurrency = true) {
    if (val === null || val === undefined) return '';
    return isCurrency ? formatter.as_currency(val, false) : formatter.as_percent(val);
}

function StatusChip({ status }: { status: string }) {
    return (
        <Chip
            label={status}
            size="small"
            sx={{
                fontSize: '0.65rem',
                height: 18,
                bgcolor: status === 'Finished' ? 'success.light' : 'warning.light',
                color: status === 'Finished' ? 'success.dark' : 'warning.dark',
                fontWeight: 'bold',
            }}
        />
    );
}

export default function ComparisonGrid({ data }: ComparisonGridProps) {
    const totals = data.reduce(
        (acc, row) => ({
            estimatedDollar: acc.estimatedDollar + row.estimatedDollar,
            expenseDollar: acc.expenseDollar + row.expenseDollar,
            netProfit: acc.netProfit + row.netProfit,
            actRevenue: acc.actRevenue + (row.actRevenue ?? 0),
            actExpense: acc.actExpense + (row.actExpense ?? 0),
            profitDollar: acc.profitDollar + (row.profitDollar ?? 0),
            varDollar: acc.varDollar + (row.varDollar ?? 0),
        }),
        { estimatedDollar: 0, expenseDollar: 0, netProfit: 0, actRevenue: 0, actExpense: 0, profitDollar: 0, varDollar: 0 }
    );

    const totalMarginPct = totals.estimatedDollar
        ? (totals.netProfit / totals.estimatedDollar) * 100
        : 0;

    const totalProfitPct = totals.actRevenue
        ? (totals.profitDollar / totals.actRevenue) * 100
        : 0;

    const totalVarPct = totals.netProfit
        ? (totals.varDollar / totals.netProfit) * 100
        : 0;

    return (
        <TableContainer
            component={Paper}
            elevation={0}
            sx={{ borderRadius: 2, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
        >
            <Table aria-label="comparison table" size="small" stickyHeader>
                <TableHead>
                    <TableRow>
                        <TableCell sx={headerCellSx}>Quote No</TableCell>
                        <TableCell sx={headerCellSx}>Customer</TableCell>
                        <TableCell sx={headerCellSx}>Date</TableCell>
                        <TableCell align="right" sx={headerCellSx}>Estimated $</TableCell>
                        <TableCell align="right" sx={headerCellSx}>Expense $</TableCell>
                        <TableCell align="right" sx={headerCellSx}>Net Profit $</TableCell>
                        <TableCell align="right" sx={headerCellSx}>Margin %</TableCell>
                        <TableCell sx={headerCellSx}>JobCode</TableCell>
                        <TableCell align="center" sx={headerCellSx}>Link</TableCell>
                        <TableCell sx={headerCellSx}>Start Dt.</TableCell>
                        <TableCell sx={headerCellSx}>End Dt.</TableCell>
                        <TableCell sx={headerCellSx}>Status</TableCell>
                        <TableCell align="right" sx={headerCellSx}>Act. Revenue</TableCell>
                        <TableCell align="right" sx={headerCellSx}>Act. Expense</TableCell>
                        <TableCell align="right" sx={headerCellSx}>Profit $</TableCell>
                        <TableCell align="right" sx={headerCellSx}>Profit %</TableCell>
                        <TableCell align="right" sx={headerCellSx}>Var $</TableCell>
                        <TableCell align="right" sx={headerCellSx}>Var %</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((row) => (
                        <TableRow
                            key={row.id}
                            sx={{
                                '&:last-child td, &:last-child th': { border: 0 },
                                '&:hover': { bgcolor: 'action.hover' },
                            }}
                        >
                            <TableCell sx={{ ...cellSx, fontWeight: 'bold', color: 'primary.main' }}>
                                {row.quoteNo}
                            </TableCell>
                            <TableCell sx={cellSx}>{row.customer}</TableCell>
                            <TableCell sx={{ ...cellSx, whiteSpace: 'nowrap' }}>{row.date}</TableCell>
                            <TableCell align="right" sx={cellSx}>{fmt(row.estimatedDollar)}</TableCell>
                            <TableCell align="right" sx={cellSx}>{fmt(row.expenseDollar)}</TableCell>
                            <TableCell align="right" sx={{ ...cellSx, color: 'primary.main', fontWeight: 'bold' }}>
                                {fmt(row.netProfit)}
                            </TableCell>
                            <TableCell
                                align="right"
                                sx={{
                                    ...cellSx,
                                    color: row.marginPct < 0 ? 'error.main' : 'text.primary',
                                    fontWeight: 'bold',
                                }}
                            >
                                {formatter.as_percent(row.marginPct)}
                            </TableCell>
                            <TableCell sx={cellSx}>{row.jobCode ?? ''}</TableCell>
                            <TableCell align="center" sx={cellSx}>
                                {row.hasLink && (
                                    <Tooltip title="View Job">
                                        <IconButton size="small" sx={{ p: 0.25 }}>
                                            <LinkIcon sx={{ fontSize: '0.9rem', color: 'primary.main' }} />
                                        </IconButton>
                                    </Tooltip>
                                )}
                            </TableCell>
                            <TableCell sx={{ ...cellSx, whiteSpace: 'nowrap' }}>{row.startDt ?? ''}</TableCell>
                            <TableCell sx={{ ...cellSx, whiteSpace: 'nowrap' }}>{row.endDt ?? ''}</TableCell>
                            <TableCell sx={cellSx}>
                                {row.status ? <StatusChip status={row.status} /> : ''}
                            </TableCell>
                            <TableCell align="right" sx={cellSx}>{fmt(row.actRevenue)}</TableCell>
                            <TableCell align="right" sx={cellSx}>{fmt(row.actExpense)}</TableCell>
                            <TableCell
                                align="right"
                                sx={{
                                    ...cellSx,
                                    color:
                                        row.profitDollar !== null && row.profitDollar < 0
                                            ? 'error.main'
                                            : 'primary.main',
                                    fontWeight: 'bold',
                                }}
                            >
                                {fmt(row.profitDollar)}
                            </TableCell>
                            <TableCell
                                align="right"
                                sx={{
                                    ...cellSx,
                                    color:
                                        row.profitPct !== null && row.profitPct < 0
                                            ? 'error.main'
                                            : 'text.primary',
                                }}
                            >
                                {row.profitPct !== null ? formatter.as_percent(row.profitPct) : ''}
                            </TableCell>
                            <TableCell
                                align="right"
                                sx={{
                                    ...cellSx,
                                    color:
                                        row.varDollar !== null && row.varDollar < 0
                                            ? 'error.main'
                                            : 'text.primary',
                                }}
                            >
                                {fmt(row.varDollar)}
                            </TableCell>
                            <TableCell
                                align="right"
                                sx={{
                                    ...cellSx,
                                    color:
                                        row.varPct !== null && row.varPct < 0
                                            ? 'error.main'
                                            : 'text.primary',
                                }}
                            >
                                {row.varPct !== null ? formatter.as_percent(row.varPct) : ''}
                            </TableCell>
                        </TableRow>
                    ))}

                    {/* Totals Row */}
                    <TableRow sx={{ bgcolor: 'background.default' }}>
                        <TableCell
                            component="th"
                            scope="row"
                            sx={{ fontWeight: 'bold', fontSize: '0.72rem' }}
                        >
                            Total
                        </TableCell>
                        <TableCell colSpan={2} />
                        <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '0.72rem' }}>
                            {fmt(totals.estimatedDollar)}
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '0.72rem' }}>
                            {fmt(totals.expenseDollar)}
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '0.72rem' }}>
                            {fmt(totals.netProfit)}
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '0.72rem' }}>
                            {formatter.as_percent(totalMarginPct)}
                        </TableCell>
                        <TableCell colSpan={5} />
                        <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '0.72rem' }}>
                            {fmt(totals.actRevenue)}
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '0.72rem' }}>
                            {fmt(totals.actExpense)}
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '0.72rem' }}>
                            {fmt(totals.profitDollar)}
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '0.72rem' }}>
                            {formatter.as_percent(totalProfitPct)}
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '0.72rem', color: totals.varDollar < 0 ? 'error.main' : 'text.primary' }}>
                            {fmt(totals.varDollar)}
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '0.72rem', color: totalVarPct < 0 ? 'error.main' : 'text.primary' }}>
                            {formatter.as_percent(totalVarPct)}
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    );
}
