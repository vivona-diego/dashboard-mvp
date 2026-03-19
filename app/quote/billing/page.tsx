'use client';

import { Box, Typography } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import BillingFilters from '@/app/components/quote/billing/BillingFilters';
import BillingGrid, { BillingGridData } from '@/app/components/quote/billing/BillingGrid';
import api from '@/app/lib/axiosClient';

export default function BillingPage() {
    const [filters, setFilters] = useState({
        billingCode: 'All',
        measure: 'All'
    });

    const handleFilterChange = (key: string, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [rows, setRows] = useState<any[]>([]);

    useEffect(() => {
        const fetch = async () => {
            try {
                setLoading(true);
                setError(null);

                // Usamos BillingDescription + Measure porque el dataset no trae
                // fechas efectivas de billing code. Calculamos costos "por unidad"
                // usando Quantity cuando exista.
                const requestBody = {
                    datasetName: 'quote_profit_forecast',
                    groupBySegments: ['BillingDescription', 'Measure', 'BillingCodeID'],
                    metrics: [
                        { metricName: 'Quantity' },
                        { metricName: 'EquipmentExpense' },
                        { metricName: 'LaborExpense' },
                        { metricName: 'UnionExpense' },
                        { metricName: 'WCExpense' },
                        { metricName: 'MatExpense' },
                        { metricName: 'DirectExpense' },
                        { metricName: 'IndirectExpense' },
                        { metricName: 'TotalExpense' },
                    ],
                    limit: 2000,
                };

                const res = await api.post('/bi/query', requestBody);
                if (!res.data?.success || !res.data?.data?.data) {
                    throw new Error('Invalid response from BI query');
                }
                setRows(res.data.data.data);
            } catch (err: any) {
                console.error('Error fetching billing data:', err);
                setError(err.response?.data?.message || err.message || 'Failed to load billing data');
                setRows([]);
            } finally {
                setLoading(false);
            }
        };

        fetch();
    }, []);

    const gridData: BillingGridData[] = useMemo(() => {
        const matchBilling = filters.billingCode !== 'All' ? filters.billingCode : null;
        const matchMeasure = filters.measure !== 'All' ? filters.measure : null;

        const safeDiv = (a: number, b: number) => (b !== 0 ? a / b : 0);

        const mapped = rows
            .filter((r) => (matchBilling ? r.BillingDescription === matchBilling : true))
            .filter((r) => (matchMeasure ? r.Measure === matchMeasure : true))
            .map((r, idx) => {
                const qty = Number(r.Quantity ?? 0);

                const equipment = Number(r.EquipmentExpense ?? 0);
                const labor = Number(r.LaborExpense ?? 0);
                const union = Number(r.UnionExpense ?? 0);
                const wc = Number(r.WCExpense ?? 0);
                const mat = Number(r.MatExpense ?? 0);

                const direct = Number(r.DirectExpense ?? 0);
                const indirect = Number(r.IndirectExpense ?? 0);
                const total = Number(r.TotalExpense ?? (direct + indirect));

                return {
                    id: String(idx),
                    billingCodeId: Number(r.BillingCodeID ?? 0),
                    billingCode: r.BillingDescription ?? '',
                    measure: r.Measure ?? '',
                    effStartDt: '',
                    effEndDt: '',
                    equipmentHourly: safeDiv(equipment, qty),
                    laborHourly: safeDiv(labor, qty),
                    unionHourly: safeDiv(union, qty),
                    wcHourly: safeDiv(wc, qty),
                    directCost: safeDiv(direct, qty),
                    materialBurden: safeDiv(mat, qty),
                    laborBurden: safeDiv(indirect, qty),
                    totalCost: safeDiv(total, qty),
                };
            });

        // Ordenar por billingCode (texto) y limitar por performance
        return mapped
            .sort((a, b) => (a.billingCode || '').localeCompare(b.billingCode || ''))
            .slice(0, 300);
    }, [rows, filters.billingCode, filters.measure]);

    return (
        <Box sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column', gap: 4 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
                Billing Codes, Costs & Calculations
            </Typography>

            {error && (
                <Typography color="error" variant="body2">
                    {error}
                </Typography>
            )}
            {loading && (
                <Typography variant="body2" color="text.secondary">
                    Cargando...
                </Typography>
            )}

            {/* Filters and Explanatory Text */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 2fr' }, gap: 4 }}>
                <BillingFilters
                    filters={filters}
                    onFilterChange={handleFilterChange}
                />
                
                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                        <strong>Direct Costs (Total)</strong> = Equipment + Labor + Union + WC Costs (Represented hourly, measure conversion applied for totals)
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        <strong>Indirect Cost</strong> = Burden Cost
                    </Typography>
                     <Typography variant="body2" color="text.secondary">
                        <strong>Gross Profit $</strong> = Estimate - Direct Costs
                    </Typography>
                     <Typography variant="body2" color="text.secondary">
                        <strong>Net Profit</strong> = Estimate - (Direct Costs + Indirect Cost)
                    </Typography>
                </Box>
            </Box>

            {/* Grid */}
            <Box sx={{ flexGrow: 1 }}>
                <BillingGrid data={gridData} />
            </Box>
        </Box>
    );
}
