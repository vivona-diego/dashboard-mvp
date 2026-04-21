'use client';

import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Stack,
  Grid,
  useTheme,
  alpha,
  CircularProgress,
} from '@mui/material';
import { useState, useEffect } from 'react';
import SegmentSelector from '@/app/components/dashboard/SegmentSelector';
import api from '@/app/lib/axiosClient';
import formatter from '@/app/helpers/formatter';

interface EquipmentData {
  unitType: string;
  revenue: number;
  totalExpenses: number;
  profit: number;
  profitPercent: number;
  labor: number;
  materialsExpenses: number;
  overhead: number;
  unionExpenses: number;
  laborBurden: number;
  unitLaborWC: number;
  laborOverhead: number;
  materialsOverhead: number;
}

export default function EquipmentRevenuePage() {
  const theme = useTheme();
  const DATASET_NAME = 'Equipment';

  // Filters
  const [unitType, setUnitType] = useState<string | null>(null);
  const [unitCode, setUnitCode] = useState<string | null>(null);
  const [startDate, setStartDate] = useState('2021-07-01');
  const [endDate, setEndDate] = useState('2021-07-31');

  // Segments
  const [unitTypes, setUnitTypes] = useState<string[]>([]);
  const [unitCodes, setUnitCodes] = useState<string[]>([]);

  // Loading & Data
  const [loadingFilters, setLoadingFilters] = useState(false);
  const [loadingTable, setLoadingTable] = useState(false);
  const [tableData, setTableData] = useState<EquipmentData[]>([]);

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

  useEffect(() => {
    const loadFilters = async () => {
      setLoadingFilters(true);
      await Promise.all([fetchFilterData('UnitType', setUnitTypes), fetchFilterData('UnitCode', setUnitCodes)]);
      setLoadingFilters(false);
    };
    loadFilters();
  }, []);

  useEffect(() => {
    const fetchTableData = async () => {
      setLoadingTable(true);
      try {
        const filters = [
          ...(unitType && unitType !== 'All' ? [{ segmentName: 'UnitType', operator: 'eq', value: unitType }] : []),
          ...(unitCode && unitCode !== 'All' ? [{ segmentName: 'UnitCode', operator: 'eq', value: unitCode }] : []),
          // NOTE: Using InvoiceDate for the date range
          ...(startDate ? [{ segmentName: 'InvoiceDate', operator: 'gte', value: startDate }] : []),
          ...(endDate ? [{ segmentName: 'InvoiceDate', operator: 'lte', value: endDate }] : []),
        ];

        // NOTE: The 'Equipment' dataset does not contain Revenue/Expense metrics.
        // These will be set to 0 for now to prevent 400 errors.
        setTableData([]);
      } catch (error) {
        console.error('Error fetching table data:', error);
        setTableData([]);
      } finally {
        setLoadingTable(false);
      }
    };

    fetchTableData();
  }, [unitType, unitCode, startDate, endDate]);

  const totalRow = tableData.reduce(
    (acc, curr) => ({
      unitType: 'Total',
      revenue: acc.revenue + curr.revenue,
      totalExpenses: acc.totalExpenses + curr.totalExpenses,
      profit: acc.profit + curr.profit,
      profitPercent: 0,
      labor: acc.labor + curr.labor,
      materialsExpenses: acc.materialsExpenses + curr.materialsExpenses,
      overhead: acc.overhead + curr.overhead,
      unionExpenses: acc.unionExpenses + curr.unionExpenses,
      laborBurden: acc.laborBurden + curr.laborBurden,
      unitLaborWC: acc.unitLaborWC + curr.unitLaborWC,
      laborOverhead: acc.laborOverhead + curr.laborOverhead,
      materialsOverhead: acc.materialsOverhead + curr.materialsOverhead,
    }),
    {
      unitType: 'Total',
      revenue: 0,
      totalExpenses: 0,
      profit: 0,
      profitPercent: 0,
      labor: 0,
      materialsExpenses: 0,
      overhead: 0,
      unionExpenses: 0,
      laborBurden: 0,
      unitLaborWC: 0,
      laborOverhead: 0,
      materialsOverhead: 0,
    },
  );
  totalRow.profitPercent = totalRow.revenue !== 0 ? (totalRow.profit / totalRow.revenue) * 100 : 0;

  const getProfitColor = (percent: number) => {
    if (percent >= 30) return '#00BCD4'; // Cyan
    if (percent >= 10) return '#FBC02D'; // Yellow
    return '#EF5350'; // Red
  };

  return (
    <Box sx={{ p: 4, bgcolor: 'background.default', minHeight: '100vh' }}>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 3, color: 'text.primary' }}>
        Equipment Revenue Report
      </Typography>

      {/* Filters Row */}
      <Paper elevation={0} sx={{ p: 2, mb: 4, bgcolor: 'background.paper', borderRadius: 2 }}>
        <Grid container spacing={3} alignItems="flex-end">
          <Grid size={{ xs: 12, md: 3 }}>
            <SegmentSelector
              label="Unit Type"
              segments={unitTypes}
              selectedSegment={unitType}
              onSelect={setUnitType}
              loading={loadingFilters}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <SegmentSelector
              label="Unit Code"
              segments={unitCodes}
              selectedSegment={unitCode}
              onSelect={setUnitCode}
              loading={loadingFilters}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Box>
                <Typography
                  variant="caption"
                  sx={{ fontWeight: 'bold', mb: 0.5, display: 'block', color: 'text.secondary' }}
                >
                  Start Date
                </Typography>
                <TextField
                  type="date"
                  size="small"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  sx={{ width: 160 }}
                />
              </Box>
              <Box>
                <Typography
                  variant="caption"
                  sx={{ fontWeight: 'bold', mb: 0.5, display: 'block', color: 'text.secondary' }}
                >
                  End Date
                </Typography>
                <TextField
                  type="date"
                  size="small"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  sx={{ width: 160 }}
                />
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      {/* Legend */}
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 3, gap: 4 }}>
        <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
          Profit % Legend:
        </Typography>
        <Stack direction="row" spacing={1} alignItems="center">
          <Box sx={{ width: 32, height: 16, bgcolor: '#00BCD4', borderRadius: 0.5 }} />
          <Typography variant="caption" color="text.secondary">
            30% Above
          </Typography>
        </Stack>
        <Stack direction="row" spacing={1} alignItems="center">
          <Box sx={{ width: 32, height: 16, bgcolor: '#FBC02D', borderRadius: 0.5 }} />
          <Typography variant="caption" color="text.secondary">
            10% - 30%
          </Typography>
        </Stack>
        <Stack direction="row" spacing={1} alignItems="center">
          <Box sx={{ width: 32, height: 16, bgcolor: '#EF5350', borderRadius: 0.5 }} />
          <Typography variant="caption" color="text.secondary">
            10% Below
          </Typography>
        </Stack>
      </Box>

      {/* Main Table */}
      <Box sx={{ position: 'relative' }}>
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
        <TableContainer component={Paper} elevation={0} sx={{ overflow: 'hidden' }}>
          <Table
            stickyHeader
            size="small"
            sx={{
              minWidth: 1200,
              '& .MuiTableCell-root': {
                py: 1.5,
                px: 2,
              },
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Unit Type</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                  Revenue
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                  Expenses
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                  Profit $
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold', width: 90 }}>
                  Profit %
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                  Labor
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                  Materials
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                  Overhead
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                  Union
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                  Burden
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                  Labor WC
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                  L_OH
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                  M_OH
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tableData.length === 0 && !loadingTable && (
                <TableRow>
                  <TableCell colSpan={13} align="center">
                    No data available for the selected filters.
                  </TableCell>
                </TableRow>
              )}
              {tableData.map((row, idx) => (
                <TableRow key={idx} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell sx={{ fontWeight: 500, color: 'text.primary' }}>{row.unitType}</TableCell>
                  <TableCell align="right">{formatter.as_currency(row.revenue, false).replace('.00', '')}</TableCell>
                  <TableCell align="right" sx={{ color: row.totalExpenses < 0 ? 'error.main' : 'inherit' }}>
                    {row.totalExpenses < 0
                      ? `(${formatter.as_currency(Math.abs(row.totalExpenses), false).replace('.00', '')})`
                      : formatter.as_currency(row.totalExpenses, false).replace('.00', '')}
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>
                    {formatter.as_currency(row.profit, false).replace('.00', '')}
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      bgcolor: alpha(getProfitColor(row.profitPercent), 0.8),
                      color: 'white',
                      fontWeight: 'bold',
                      borderRadius: '4px',
                      m: 1,
                      display: 'table-cell',
                    }}
                  >
                    {row.profitPercent.toFixed(2)}%
                  </TableCell>
                  <TableCell align="right" color="text.secondary">
                    {row.labor ? formatter.with_commas(row.labor, 0) : '-'}
                  </TableCell>
                  <TableCell align="right" color="text.secondary">
                    {row.materialsExpenses ? formatter.with_commas(row.materialsExpenses, 0) : '-'}
                  </TableCell>
                  <TableCell align="right" color="text.secondary">
                    {row.overhead ? formatter.with_commas(row.overhead, 0) : '-'}
                  </TableCell>
                  <TableCell align="right" color="text.secondary">
                    {row.unionExpenses ? formatter.with_commas(row.unionExpenses, 0) : '-'}
                  </TableCell>
                  <TableCell align="right" color="text.secondary">
                    {row.laborBurden ? formatter.with_commas(row.laborBurden, 0) : '-'}
                  </TableCell>
                  <TableCell align="right" color="text.secondary">
                    {row.unitLaborWC ? formatter.with_commas(row.unitLaborWC, 0) : '-'}
                  </TableCell>
                  <TableCell align="right" color="text.secondary">
                    {row.laborOverhead ? formatter.with_commas(row.laborOverhead, 0) : '-'}
                  </TableCell>
                  <TableCell align="right" color="text.secondary">
                    {row.materialsOverhead ? formatter.with_commas(row.materialsOverhead, 0) : '-'}
                  </TableCell>
                </TableRow>
              ))}
              {/* Total Row */}
              {tableData.length > 0 && (
                <TableRow
                  sx={{
                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                    '& td': { fontWeight: 'bold', color: 'text.primary' },
                  }}
                >
                  <TableCell>TOTAL</TableCell>
                  <TableCell align="right">
                    {formatter.as_currency(totalRow.revenue, false).replace('.00', '')}
                  </TableCell>
                  <TableCell align="right">
                    {totalRow.totalExpenses < 0
                      ? `(${formatter.as_currency(Math.abs(totalRow.totalExpenses), false).replace('.00', '')})`
                      : formatter.as_currency(totalRow.totalExpenses, false).replace('.00', '')}
                  </TableCell>
                  <TableCell align="right">
                    {formatter.as_currency(totalRow.profit, false).replace('.00', '')}
                  </TableCell>
                  <TableCell align="right" sx={{ bgcolor: getProfitColor(totalRow.profitPercent), color: 'white' }}>
                    {totalRow.profitPercent.toFixed(2)}%
                  </TableCell>
                  <TableCell align="right">{formatter.with_commas(totalRow.labor, 0)}</TableCell>
                  <TableCell align="right">{formatter.with_commas(totalRow.materialsExpenses, 0)}</TableCell>
                  <TableCell align="right">{formatter.with_commas(totalRow.overhead, 0)}</TableCell>
                  <TableCell align="right">{formatter.with_commas(totalRow.unionExpenses, 0)}</TableCell>
                  <TableCell align="right">{formatter.with_commas(totalRow.laborBurden, 0)}</TableCell>
                  <TableCell align="right">{formatter.with_commas(totalRow.unitLaborWC, 0)}</TableCell>
                  <TableCell align="right">{formatter.with_commas(totalRow.laborOverhead, 0)}</TableCell>
                  <TableCell align="right">{formatter.with_commas(totalRow.materialsOverhead, 0)}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}
