'use client';

import { Box, Typography } from '@mui/material';

export default function WOSummaryKPIs() {
  const kpis = [
    { label: 'WO Amount CY', value: '$22K', color: '#00BCD4' },
    { label: 'WO Amount PY', value: '$36K', color: '#00BCD4' },
    { label: 'Total WO', value: '23', color: '#00BCD4' },
    { label: 'Total WO PY', value: '26', color: '#00BCD4' },
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
