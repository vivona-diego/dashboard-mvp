'use client';

import { Box, Typography } from '@mui/material';

export default function ComingDueKPIs() {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', py: 2, width: '100%' }}>
      
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h3" sx={{ fontWeight: 'normal', color: 'text.primary', mb: 0.5 }}>
          79
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Coming Due Units
        </Typography>
      </Box>

      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h3" sx={{ fontWeight: 'normal', color: 'text.primary', mb: 0.5 }}>
          54
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Avg Coming Due Days
        </Typography>
      </Box>

      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h3" sx={{ fontWeight: 'normal', color: 'text.primary', mb: 0.5 }}>
          31
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Avg Coming Due Hours
        </Typography>
      </Box>
      
    </Box>
  );
}
