'use client';

import api from '@/app/api/axiosClient';
import formatter from '@/app/helpers/formatter';
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@mui/material';
import { useEffect, useState } from 'react';
import TableSkeleton from '../../ui/TableSkeleton';

interface TableTileProps {
    title: string;
    datasetName: string;
    groupBySegments: string[];
    metrics: string[]; // e.g. ['TotalJobs', 'TotalCost']
    filters?: Array<{ segmentName: string; operator: string; value?: any; secondValue?: any }>;
    useDrilldown?: boolean;
    columns?: string[]; // Specific columns for drilldown
    headerAction?: React.ReactNode;
    height?: number | string;
    onRowClick?: (row: any) => void;
}

const TableTile = (props: TableTileProps) => {
    const { title, datasetName, groupBySegments, metrics, filters, useDrilldown, headerAction, height } = props;

    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [dynamicColumns, setDynamicColumns] = useState<string[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                let res;

                if (useDrilldown) {
                    const requestBody: any = {
                        datasetName,
                        pagination: { page: 1, pageSize: 50 } // Drilldown view
                    };

                    if (filters && filters.length > 0) {
                        requestBody.filters = filters;
                    }
                    
                    if (props.columns && props.columns.length > 0) {
                        requestBody.columns = props.columns;
                    }

                    res = await api.post('/bi/drilldown', requestBody);

                    if (res.data?.success || (res.data?.data && Array.isArray(res.data.data))) {
                         // Drilldown response format handling
                         const rows = res.data.data?.data || res.data.data || [];
                         setData(rows);
                        
                         // Extract dynamic columns
                         if (rows.length > 0) {
                             const cols = Object.keys(rows[0]).filter(k => k !== '_RowNum');
                             setDynamicColumns(cols);
                         } else if (res.data.metadata?.columns) {
                             setDynamicColumns(res.data.metadata.columns);
                         }
                    } else {
                        setData([]);
                    }

                } else {
                   // Standard Aggregate Tile
                    const requestBody: any = {
                        datasetName,
                        groupBySegments,
                        metrics: metrics.map(m => ({ metricName: m })),
                        orderBy: metrics.length > 0 ? [{ field: metrics[0], direction: 'DESC' }] : undefined,
                        pagination: { page: 1, pageSize: 10 } // Top 10 for tile
                    };
    
                    if (filters && filters.length > 0) {
                        requestBody.filters = filters;
                    }
    
                    res = await api.post('/bi/query', requestBody);
                    if (res.data?.success && res.data?.data?.data) {
                        setData(res.data.data.data);
                    } else {
                        setData([]);
                    }
                }

            } catch (err: any) {
                console.error('Error fetching table tile data:', err);
                setError('Failed to load data');
                setData([]);
            } finally {
                setLoading(false);
            }
        };

        if (datasetName && (useDrilldown || (groupBySegments.length > 0 && metrics.length > 0))) {
            fetchData();
        }
    }, [datasetName, groupBySegments, metrics, filters, useDrilldown]);

    if (loading) {
        return (
             <Box sx={{ p: 2, height: height || '100%', minHeight: height || 400, bgcolor: 'background.paper', borderRadius: 2, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', overflow: 'hidden' }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>{title}</Typography>
                <TableSkeleton rows={10} columns={useDrilldown ? 5 : metrics.length + 1} />
             </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 2, height: height || '100%', minHeight: height || 400, bgcolor: 'background.paper', borderRadius: 2, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography color="error">{error}</Typography>
            </Box>
        );
    }

    // Render Logic
    if (useDrilldown) {
        // Render drilldown view
        return (
            <Box sx={{ p: 0, height: '100%', bgcolor: 'background.paper', borderRadius: 2, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" fontWeight="bold" color="text.primary">
                        {title}
                    </Typography>
                    {headerAction}
                </Box>
                
                <TableContainer sx={{ flex: 1, overflow: 'auto', maxHeight: height || 600 }}>
                    <Table stickyHeader size="small">
                        <TableHead>
                            <TableRow>
                                {dynamicColumns.map(col => (
                                    <TableCell 
                                        key={col} 
                                        sx={{ 
                                            fontWeight: 'bold',
                                            bgcolor: 'primary.main',
                                            color: 'common.white'
                                        }}
                                        align={['JobRevenue', 'TotalExpenses', 'Profit', 'ProfitPercent', 'LaborExpenses', 'LaborBurden', 'LaborUnion', 'LaborWC', 'EquipmentExpenses', 'Materials', 'MaterialsOverhead', 'Overhead', 'LaborHours'].includes(col) || typeof data[0]?.[col] === 'number' ? 'right' : 'left'}
                                    >
                                        {col}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.map((row, idx) => (
                                <TableRow 
                                    key={idx} 
                                    hover 
                                    onClick={() => props.onRowClick && props.onRowClick(row)}
                                    sx={{ 
                                        cursor: props.onRowClick ? 'pointer' : 'default',
                                        '&:hover': {
                                            bgcolor: props.onRowClick ? 'action.hover' : undefined
                                        }
                                    }}
                                >
                                    {dynamicColumns.map(col => {
                                        const isCurrency = ['JobRevenue', 'TotalExpenses', 'Profit', 'LaborExpenses', 'LaborBurden', 'LaborUnion', 'LaborWC', 'EquipmentExpenses', 'Materials', 'MaterialsOverhead', 'Overhead'].includes(col);
                                        const isPercent = ['ProfitPercent'].includes(col);
                                        const isNumber = typeof row[col] === 'number';

                                        return (
                                            <TableCell key={col} align={isNumber ? "right" : "left"}>
                                                {isCurrency && isNumber 
                                                    ? formatter.as_currency(row[col]) 
                                                    : isPercent && isNumber
                                                        ? `${row[col].toFixed(2)}%`
                                                        : isNumber 
                                                            ? formatter.with_commas(row[col], 0) 
                                                            : (row[col] ?? '-')
                                                }
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            ))}
                             {data.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={dynamicColumns.length || 1} align="center" sx={{ py: 3 }}>
                                        <Typography variant="body2" color="text.secondary">No data available</Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        );
    }

    // Original Aggregate View Logic
    const hasJobs = metrics.includes('TotalJobs');
    const hasCost = metrics.includes('TotalCost');
    const hasRevenue = metrics.includes('JobRevenue');
    const hasProfit = metrics.includes('Profit');
    const segmentName = groupBySegments[0];

    // Calculate Profit % if possible
    const showProfitPercent = hasRevenue && hasProfit;

    const processedData = data.map(row => {
        const jobs = row['TotalJobs'] || 0;
        const cost = row['TotalCost'] || 0;
        const avg = jobs > 0 ? cost / jobs : 0;
        
        const revenue = row['JobRevenue'] || 0;
        const profit = row['Profit'] || 0;
        const profitPercent = revenue !== 0 ? (profit / revenue) * 100 : 0;

        return {
            ...row,
            avgJobValue: avg,
            profitPercent: profitPercent
        };
    });

    return (
        <Box sx={{ p: 0, height: '100%', bgcolor: 'background.paper', borderRadius: 2, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                <Typography variant="h6" fontWeight="bold" color="text.primary">
                    {title}
                </Typography>
            </Box>
            
            <TableContainer sx={{ flex: 1, overflow: 'auto' }}>
                <Table size="small" stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold', bgcolor: 'primary.main', color: 'common.white' }}>{segmentName}</TableCell>
                            {metrics.map(m => (
                                <TableCell key={m} align="right" sx={{ fontWeight: 'bold', bgcolor: 'primary.main', color: 'common.white' }}>{m}</TableCell>
                            ))}
                            {hasJobs && hasCost && (
                                <TableCell align="right" sx={{ fontWeight: 'bold', bgcolor: 'primary.main', color: 'common.white' }}>Avg Job Value</TableCell>
                            )}
                            {showProfitPercent && (
                                <TableCell align="right" sx={{ fontWeight: 'bold', bgcolor: 'primary.main', color: 'common.white' }}>Profit %</TableCell>
                            )}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {processedData.map((row, idx) => (
                            <TableRow 
                                key={idx} 
                                hover
                                onClick={() => props.onRowClick && props.onRowClick(row)}
                                sx={{ 
                                    cursor: props.onRowClick ? 'pointer' : 'default',
                                    '&:hover': {
                                        bgcolor: props.onRowClick ? 'action.hover' : undefined
                                    }
                                }}
                            >
                                <TableCell sx={{ fontWeight: 500 }}>{row[segmentName]}</TableCell>
                                {metrics.map(m => (
                                    <TableCell key={m} align="right">
                                        {m.includes('Cost') || m.includes('Sales') || m.includes('Revenue') || m.includes('Profit')
                                            ? formatter.as_currency(row[m]) 
                                            : formatter.with_commas(row[m], 0)}
                                    </TableCell>
                                ))}
                                {hasJobs && hasCost && (
                                    <TableCell align="right">
                                        {formatter.as_currency(row.avgJobValue)}
                                    </TableCell>
                                )}
                                {showProfitPercent && (
                                    <TableCell align="right" sx={{ width: 120 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
                                            <Typography variant="body2" fontWeight="bold">
                                                {row.profitPercent.toFixed(2)}%
                                            </Typography>
                                            {/* Simple visual bar */}
                                            <Box sx={{ width: 50, height: 8, bgcolor: 'grey.200', borderRadius: 1, overflow: 'hidden' }}>
                                                <Box sx={{ 
                                                    width: `${Math.min(Math.max(row.profitPercent, 0), 100)}%`, 
                                                    height: '100%', 
                                                    bgcolor: row.profitPercent >= 0 ? 'success.main' : 'error.main' 
                                                }} />
                                            </Box>
                                        </Box>
                                    </TableCell>
                                )}
                            </TableRow>
                        ))}
                         {processedData.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={metrics.length + (hasJobs && hasCost ? 2 : 1) + (showProfitPercent ? 1 : 0)} align="center" sx={{ py: 3 }}>
                                    <Typography variant="body2" color="text.secondary">No data available</Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default TableTile;
