'use client';

import { Box, Typography } from '@mui/material';
import MaintenanceDetailFilterPanel from '@/app/components/maintenance/MaintenanceDetailFilterPanel';
import MaintenanceDetailTable from '@/app/components/maintenance/MaintenanceDetailTable';

export default function MaintenanceDetailReportPage() {
  return (
    <Box sx={{ bgcolor: '#F5F5F5', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Page Title */}
      <Box sx={{ p: 4, pb: 2, bgcolor: '#E0E0E0' }}>
        <Typography variant="h5" fontWeight="bold" sx={{ color: '#212121' }}>
          Preventive Maintenance - Detail Report
        </Typography>
      </Box>

      {/* Main Content Area */}
      <Box sx={{ p: 0, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Top Filters */}
        <MaintenanceDetailFilterPanel />

        {/* Data Table */}
        <Box sx={{ mt: 4, px: 4 }}>
           <MaintenanceDetailTable />
        </Box>
      </Box>

    </Box>
  );
}
