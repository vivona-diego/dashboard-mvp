'use client';

import { Box, Typography, Grid } from '@mui/material';
import WOSummaryFilterPanel from '@/app/components/wo/WOSummaryFilterPanel';
import WOSummaryChart from '@/app/components/wo/WOSummaryChart';
import WOSummaryTable from '@/app/components/wo/WOSummaryTable';
import WOSummaryKPIs from '@/app/components/wo/WOSummaryKPIs';

export default function WOSummaryPage() {
  return (
    <Box sx={{ bgcolor: '#F5F5F5', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Top Header & Filters Panel */}
      <Box sx={{ px: 4, pt: 3 }}>
        <Grid container alignItems="center" spacing={2}>
          <Grid size={{ xs: 12, md: 3 }}>
            <Typography variant="h5" fontWeight="bold" sx={{ color: '#212121' }}>
              WO Summary CY Vs. PY
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 9 }}>
            <WOSummaryFilterPanel />
          </Grid>
        </Grid>
      </Box>

      {/* Main Content Area */}
      <Box sx={{ p: 4, flexGrow: 1 }}>
        <Grid container spacing={4}>
          
          {/* Left Column: Chart and Table */}
          <Grid size={{ xs: 12, md: 9 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ bgcolor: 'background.paper', borderRadius: 1, boxShadow: 1, overflow: 'hidden' }}>
                <WOSummaryChart />
              </Box>
              <Box sx={{ bgcolor: 'background.paper', borderRadius: 1, boxShadow: 1, overflow: 'hidden' }}>
                <WOSummaryTable />
              </Box>
            </Box>
          </Grid>

          {/* Right Column: KPIs */}
          <Grid size={{ xs: 12, md: 3 }}>
            <Box sx={{ height: '100%', minHeight: 600 }}>
               <WOSummaryKPIs />
            </Box>
          </Grid>

        </Grid>
      </Box>

    </Box>
  );
}
