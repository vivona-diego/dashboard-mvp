'use client';

import { Box, Typography } from '@mui/material';
import WODetailsFilterPanel from '@/app/components/wo/WODetailsFilterPanel';
import WODetailsTable from '@/app/components/wo/WODetailsTable';
import WOActivitiesTable from '@/app/components/wo/WOActivitiesTable';

export default function WODetailsPage() {
  return (
    <Box sx={{ bgcolor: '#EEEEEE', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Top Section with Title and Filters */}
      <Box sx={{ display: 'flex', alignItems: 'center', p: 3, pb: 0, gap: 4 }}>
         {/* Page Title */}
         <Typography variant="h5" fontWeight="bold" sx={{ color: '#212121', whiteSpace: 'nowrap' }}>
            Work Order Details
         </Typography>

         {/* Inline Filter Panel */}
         <Box sx={{ flexGrow: 1 }}>
             <WODetailsFilterPanel />
         </Box>
      </Box>

      {/* Main Content Area */}
      <Box sx={{ p: 4, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Data Tables */}
        <WODetailsTable />
        
        <WOActivitiesTable />
      </Box>

    </Box>
  );
}
