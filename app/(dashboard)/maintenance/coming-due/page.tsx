'use client';

import { Box, Typography, Grid } from '@mui/material';
import ComingDueFilterPanel from '@/app/components/maintenance/ComingDueFilterPanel';
import ComingDueUnitTypeChart from '@/app/components/maintenance/ComingDueUnitTypeChart';
import ComingDueActivitiesPieChart from '@/app/components/maintenance/ComingDueActivitiesPieChart';
import ComingDueKPIs from '@/app/components/maintenance/ComingDueKPIs';
import ComingDueDaysTable from '@/app/components/maintenance/ComingDueDaysTable';
import ComingDueHoursTable from '@/app/components/maintenance/ComingDueHoursTable';

export default function ComingDuePage() {
  return (
    <Box sx={{ p: 4, bgcolor: '#ebedee', minHeight: '100vh', display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Page Title */}
      <Box sx={{ pb: 1, borderBottom: '1px solid #CFD8DC' }}>
        <Typography variant="h5" fontWeight="bold" sx={{ color: '#212121' }}>
          Preventive Maintenance - Coming Due
        </Typography>
      </Box>

      {/* Main Content Grid */}
      <Grid container spacing={3}>
        {/* Extreme Left: Filters */}
        <Grid size={{ xs: 12, md: 2 }}>
           <Box sx={{ height: '100%' }}>
              <ComingDueFilterPanel />
           </Box>
        </Grid>

        {/* Right side content */}
        <Grid size={{ xs: 12, md: 10 }}>
          <Grid container spacing={3}>
             {/* Top: Charts */}
             <Grid size={{ xs: 12, md: 6 }}>
               <Box sx={{ height: 400 }}>
                 <ComingDueUnitTypeChart />
               </Box>
             </Grid>
             <Grid size={{ xs: 12, md: 6 }}>
               <Box sx={{ height: 400,  display: 'flex', flexDirection: 'column', bgcolor: 'background.paper', borderRadius: 2, overflow: 'hidden' }}>
                  <Box sx={{ flexGrow: 1 }}>
                    <ComingDueActivitiesPieChart />
                  </Box>
                  <Box sx={{ mt: -2, pb: 2 }}>
                    <ComingDueKPIs />
                  </Box>
               </Box>
             </Grid>

             {/* Bottom: Tables */}
             <Grid size={{ xs: 12, md: 5 }}>
                <Box sx={{ height: '100%' }}>
                  <ComingDueDaysTable />
                </Box>
             </Grid>
             <Grid size={{ xs: 12, md: 7 }}>
                <Box sx={{ height: '100%' }}>
                  <ComingDueHoursTable />
                </Box>
             </Grid>
          </Grid>
        </Grid>

      </Grid>
    </Box>
  );
}
