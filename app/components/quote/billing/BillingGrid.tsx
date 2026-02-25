'use client';

import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from '@mui/material';
import formatter from '@/app/helpers/formatter';

export interface BillingGridData {
    id: string;
    billingCodeId: number;
    billingCode: string;
    measure: string;
    effStartDt: string;
    effEndDt: string;
    equipmentHourly: number;
    laborHourly: number;
    unionHourly: number;
    wcHourly: number;
    directCost: number;
    materialBurden: number;
    laborBurden: number;
    totalCost: number;
}

interface BillingGridProps {
    data: BillingGridData[];
}

export default function BillingGrid({ data }: BillingGridProps) {
    // Calculate totals
    const totalRow = data.reduce((acc, curr) => ({
        equipmentHourly: acc.equipmentHourly + curr.equipmentHourly,
        laborHourly: acc.laborHourly + curr.laborHourly,
        unionHourly: acc.unionHourly + curr.unionHourly,
        wcHourly: acc.wcHourly + curr.wcHourly,
        directCost: acc.directCost + curr.directCost,
        materialBurden: acc.materialBurden + curr.materialBurden,
        laborBurden: acc.laborBurden + curr.laborBurden,
        totalCost: acc.totalCost + curr.totalCost,
    }), {
        equipmentHourly: 0,
        laborHourly: 0,
        unionHourly: 0,
        wcHourly: 0,
        directCost: 0,
        materialBurden: 0,
        laborBurden: 0,
        totalCost: 0,
    });

  return (
    <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
      <Table aria-label="billing table" size="small" stickyHeader>
        <TableHead>
          <TableRow> 
            <TableCell sx={{ fontWeight: 'bold', fontSize: '0.75rem', bgcolor: 'primary.main', color: 'common.white', whiteSpace: 'nowrap' }}>Billing CodeID</TableCell>
            <TableCell sx={{ fontWeight: 'bold', fontSize: '0.75rem', bgcolor: 'primary.main', color: 'common.white' }}>Billing Code</TableCell>
            <TableCell sx={{ fontWeight: 'bold', fontSize: '0.75rem', bgcolor: 'primary.main', color: 'common.white' }}>Measure</TableCell>
            <TableCell sx={{ fontWeight: 'bold', fontSize: '0.75rem', bgcolor: 'primary.main', color: 'common.white', whiteSpace: 'nowrap' }}>Eff. Start Dt</TableCell>
            <TableCell sx={{ fontWeight: 'bold', fontSize: '0.75rem', bgcolor: 'primary.main', color: 'common.white', whiteSpace: 'nowrap' }}>Eff. End Dt</TableCell>
            <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '0.75rem', bgcolor: 'primary.main', color: 'common.white' }}>Equipment Hourly</TableCell>
            <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '0.75rem', bgcolor: 'primary.main', color: 'common.white' }}>Labor Hourly</TableCell>
            <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '0.75rem', bgcolor: 'primary.main', color: 'common.white' }}>Union Hourly</TableCell>
            <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '0.75rem', bgcolor: 'primary.main', color: 'common.white' }}>WC Hourly</TableCell>
            <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '0.75rem', bgcolor: 'primary.main', color: 'common.white' }}>Direct Cost</TableCell>
            <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '0.75rem', bgcolor: 'primary.main', color: 'common.white' }}>Material Burden</TableCell>
            <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '0.75rem', bgcolor: 'primary.main', color: 'common.white' }}>Labor Burden</TableCell>
            <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '0.75rem', bgcolor: 'primary.main', color: 'common.white' }}>Total Cost</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { bgcolor: 'action.hover' } }}>
               <TableCell align="right" sx={{ fontSize: '0.75rem' }}>{row.billingCodeId}</TableCell>
               <TableCell sx={{ fontSize: '0.75rem' }}>{row.billingCode}</TableCell>
               <TableCell sx={{ fontSize: '0.75rem' }}>{row.measure}</TableCell>
               <TableCell sx={{ fontSize: '0.75rem' }}>{row.effStartDt}</TableCell>
               <TableCell sx={{ fontSize: '0.75rem' }}>{row.effEndDt}</TableCell>
               
               <TableCell align="right" sx={{ fontSize: '0.75rem' }}>{formatter.as_currency(row.equipmentHourly, false)}</TableCell>
               <TableCell align="right" sx={{ fontSize: '0.75rem' }}>{formatter.as_currency(row.laborHourly, false)}</TableCell>
               <TableCell align="right" sx={{ fontSize: '0.75rem' }}>{formatter.as_currency(row.unionHourly, false)}</TableCell>
               <TableCell align="right" sx={{ fontSize: '0.75rem' }}>{formatter.as_currency(row.wcHourly, false)}</TableCell>
               <TableCell align="right" sx={{ fontSize: '0.75rem' }}>{formatter.as_currency(row.directCost, false)}</TableCell>
               <TableCell align="right" sx={{ fontSize: '0.75rem' }}>{formatter.as_currency(row.materialBurden, false)}</TableCell>
               <TableCell align="right" sx={{ fontSize: '0.75rem' }}>{formatter.as_currency(row.laborBurden, false)}</TableCell>
               <TableCell align="right" sx={{ fontSize: '0.75rem' }}>{formatter.as_currency(row.totalCost, false)}</TableCell>
            </TableRow>
          ))}
          {/* Total Row */}
           <TableRow sx={{ bgcolor: 'background.default' }}>
                <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}>Total</TableCell>
                <TableCell colSpan={4} />
                <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}>{formatter.as_currency(totalRow.equipmentHourly, false)}</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}>{formatter.as_currency(totalRow.laborHourly, false)}</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}>{formatter.as_currency(totalRow.unionHourly, false)}</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}>{formatter.as_currency(totalRow.wcHourly, false)}</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}>{formatter.as_currency(totalRow.directCost, false)}</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}>{formatter.as_currency(totalRow.materialBurden, false)}</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}>{formatter.as_currency(totalRow.laborBurden, false)}</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}>{formatter.as_currency(totalRow.totalCost, false)}</TableCell>
           </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}
