'use client';

import { Box, Typography, Grid } from '@mui/material';
import PastDueUnitTypeChart from '@/app/components/maintenance/PastDueUnitTypeChart';
import PastDueActivitiesPieChart from '@/app/components/maintenance/PastDueActivitiesPieChart';
import MaintenanceKPIs from '@/app/components/maintenance/MaintenanceKPIs';
import PastDueDaysTable from '@/app/components/maintenance/PastDueDaysTable';
import PastDueHoursTable from '@/app/components/maintenance/PastDueHoursTable';

export default function MaintenancePage() {
  return (
    <Box sx={{ p: 4, bgcolor: '#F5F5F5', minHeight: '100vh', display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Page Title */}
      <Box sx={{ pb: 1, borderBottom: '1px solid #E0E0E0' }}>
        <Typography variant="h5" fontWeight="bold" sx={{ color: '#212121' }}>
          Preventive Maintenance - Past Due
        </Typography>
      </Box>

      {/* Main Content Grid */}
      <Grid container spacing={3}>
        {/* Top Left: Bar Chart */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Box sx={{ height: 350 }}>
            <PastDueUnitTypeChart />
          </Box>
        </Grid>

        {/* Top Right: Pie Chart & KPIs */}
        <Grid size={{ xs: 12, md: 6 }}>
           <Box sx={{ height: 350,  display: 'flex', flexDirection: 'column', bgcolor: 'background.paper', borderRadius: 2, overflow: 'hidden' }}>
              <Box sx={{ flexGrow: 1 }}>
                <PastDueActivitiesPieChart />
              </Box>
              <Box sx={{ mt: -2, pb: 2 }}>
                <MaintenanceKPIs />
              </Box>
           </Box>
        </Grid>

        {/* Bottom Left: Days Table */}
        <Grid size={{ xs: 12, md: 5 }}>
           <Box sx={{ height: '100%' }}>
             <PastDueDaysTable />
           </Box>
        </Grid>

        {/* Bottom Right: Hours Table */}
        <Grid size={{ xs: 12, md: 7 }}>
           <Box sx={{ height: '100%' }}>
             <PastDueHoursTable />
           </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
