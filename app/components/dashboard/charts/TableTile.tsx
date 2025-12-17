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
    filters?: Array<{ segmentName: string; operator: string; value?: any }>;
}

const TableTile = (props: TableTileProps) => {
    const { title, datasetName, groupBySegments, metrics, filters } = props;

    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
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

                const res = await api.post('/bi/query', requestBody);

                if (res.data?.success && res.data?.data?.data) {
                    setData(res.data.data.data);
                } else {
                    setData([]);
                }
            } catch (err: any) {
                console.error('Error fetching table tile data:', err);
                setError('Failed to load data');
                setData([]);
            } finally {
                setLoading(false);
            }
        };

        if (datasetName && groupBySegments.length > 0 && metrics.length > 0) {
            fetchData();
        }
    }, [datasetName, groupBySegments, metrics, filters]);

    if (loading) {
        return (
             <Box sx={{ p: 2, height: '100%', bgcolor: 'background.paper', borderRadius: 2, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>{title}</Typography>
                <TableSkeleton rows={5} columns={metrics.length + 1} />
             </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 2, height: '100%', bgcolor: 'background.paper', borderRadius: 2, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography color="error">{error}</Typography>
            </Box>
        );
    }

    // Prepare columns
    // We expect: Segment, Metric 1, Metric 2, Calculated Metric... (Avg Job Value)
    
    // Check if we have TotalJobs and TotalCost to calculate Avg
    const hasJobs = metrics.includes('TotalJobs');
    const hasCost = metrics.includes('TotalCost');
    const segmentName = groupBySegments[0];

    const processedData = data.map(row => {
        const jobs = row['TotalJobs'] || 0;
        const cost = row['TotalCost'] || 0;
        const avg = jobs > 0 ? cost / jobs : 0;
        return {
            ...row,
            avgJobValue: avg
        };
    });

    return (
        <Box sx={{ p: 2, height: '100%', bgcolor: 'background.paper', borderRadius: 2, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" fontWeight="bold" color="text.primary" gutterBottom>
                {title}
            </Typography>
            
            <TableContainer sx={{ flex: 1, overflow: 'auto' }}>
                <Table size="small" stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>{segmentName}</TableCell>
                            {metrics.map(m => (
                                <TableCell key={m} align="right" sx={{ fontWeight: 'bold' }}>{m}</TableCell>
                            ))}
                            {hasJobs && hasCost && (
                                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Avg Job Value</TableCell>
                            )}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {processedData.map((row, idx) => (
                            <TableRow key={idx} hover>
                                <TableCell>{row[segmentName]}</TableCell>
                                {metrics.map(m => (
                                    <TableCell key={m} align="right">
                                        {m.includes('Cost') || m.includes('Sales') 
                                            ? formatter.as_currency(row[m]) 
                                            : formatter.with_commas(row[m], 0)}
                                    </TableCell>
                                ))}
                                {hasJobs && hasCost && (
                                    <TableCell align="right">
                                        {formatter.as_currency(row.avgJobValue)}
                                    </TableCell>
                                )}
                            </TableRow>
                        ))}
                         {processedData.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={metrics.length + (hasJobs && hasCost ? 2 : 1)} align="center" sx={{ py: 3 }}>
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
