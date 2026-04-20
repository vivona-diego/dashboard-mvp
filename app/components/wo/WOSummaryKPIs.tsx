'use client';

import { Box, Typography } from '@mui/material';

interface WOSummaryKPIsProps {
  woAmountCY: number;
  woAmountPY: number;
  totalWOCY: number;
  totalWOPY: number;
}

export default function WOSummaryKPIs({
  woAmountCY, woAmountPY, totalWOCY, totalWOPY
}: WOSummaryKPIsProps) {
  const kpis = [
    { label: 'WO Amount CY', value: `$${(woAmountCY / 1000).toFixed(0)}K`, color: '#00BCD4' },
    { label: 'WO Amount PY', value: `$${(woAmountPY / 1000).toFixed(0)}K`, color: '#00BCD4' },
    { label: 'Total WO', value: totalWOCY.toString(), color: '#00BCD4' },
    { label: 'Total WO PY', value: totalWOPY.toString(), color: '#00BCD4' },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'center', py: 4, height: '100%', justifyContent: 'center' }}>
      {kpis.map((kpi, idx) => (
        <Box key={idx} sx={{ textAlign: 'center' }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'text.primary', mb: 0.5 }}>
            {kpi.value}
          </Typography>
          <Typography variant="subtitle2" sx={{ color: kpi.color, fontWeight: 'bold', textTransform: 'none' }}>
            {kpi.label}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}
