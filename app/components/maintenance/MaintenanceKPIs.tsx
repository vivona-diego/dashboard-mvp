'use client';

import { Box, Typography } from '@mui/material';

export default function MaintenanceKPIs() {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', py: 2, width: '100%' }}>
      
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h3" sx={{ fontWeight: 'normal', color: 'text.primary', mb: 0.5 }}>
          23
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Past Due Activities
        </Typography>
      </Box>

      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h3" sx={{ fontWeight: 'normal', color: 'text.primary', mb: 0.5 }}>
          85
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Avg Past Due Days
        </Typography>
      </Box>

      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h3" sx={{ fontWeight: 'normal', color: 'text.primary', mb: 0.5 }}>
          139.25
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Avg Past Due Hours
        </Typography>
      </Box>
      
    </Box>
  );
}
