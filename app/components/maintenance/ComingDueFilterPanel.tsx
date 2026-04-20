'use client';

import { Box, Typography, TextField } from '@mui/material';
import SegmentSelector from '@/app/components/dashboard/SegmentSelector';

interface ComingDueFilterPanelProps {
  scheduleTypes: string[];
  selectedScheduleType: string | null;
  onScheduleTypeChange: (val: string | null) => void;
  activities: string[];
  selectedActivity: string | null;
  onActivityChange: (val: string | null) => void;
  loadingFilters?: boolean;
}

export default function ComingDueFilterPanel({
  scheduleTypes,
  selectedScheduleType,
  onScheduleTypeChange,
  activities,
  selectedActivity,
  onActivityChange,
  loadingFilters
}: ComingDueFilterPanelProps) {
  return (
    <Box sx={{ width: '100%', height: '100%', bgcolor: 'background.default', display: 'flex', flexDirection: 'column' }}>
      {/* Header Strip */}
      <Box sx={{ 
        bgcolor: '#CFD8DC', 
        py: 0.5, 
        px: 2, 
        mb: 2, 
        display: 'flex',
        justifyContent: 'flex-start'
      }}>
        <Typography variant="subtitle2" sx={{ color: '#455A64', fontSize: '0.8rem' }}>
          Filters
        </Typography>
      </Box>

      {/* Filter Content */}
      <Box sx={{ px: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
        
        {/* Days Filter */}
        <Box>
            <Typography variant="body2" sx={{ fontWeight: 'normal', color: 'text.primary', mb: 1 }}>
                Coming Due Days
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
                 <TextField size="small" variant="outlined" value="0" InputProps={{ readOnly: true }} sx={{ bgcolor: 'white', '& input': { p: 0.5, textAlign: 'center' } }} />
                 <TextField size="small" variant="outlined" value="60" InputProps={{ readOnly: true }} sx={{ bgcolor: 'white', '& input': { p: 0.5, textAlign: 'center' } }} />
            </Box>
        </Box>

        {/* Hours Filter */}
        <Box>
            <Typography variant="body2" sx={{ fontWeight: 'normal', color: 'text.primary', mb: 1 }}>
                Coming Due Hours
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
                 <TextField size="small" variant="outlined" value="0" InputProps={{ readOnly: true }} sx={{ bgcolor: 'white', '& input': { p: 0.5, textAlign: 'center' } }} />
                 <TextField size="small" variant="outlined" value="300" InputProps={{ readOnly: true }} sx={{ bgcolor: 'white', '& input': { p: 0.5, textAlign: 'center' } }} />
            </Box>
        </Box>

        {/* Schedule Type */}
        <Box>
             <SegmentSelector 
                 label='Schedule Type'
                 segments={scheduleTypes} 
                 selectedSegment={selectedScheduleType} 
                 onSelect={onScheduleTypeChange}
                 loading={loadingFilters}
             />
        </Box>

        {/* Activity */}
        <Box>
             <SegmentSelector 
                 label='Activity'
                 segments={activities} 
                 selectedSegment={selectedActivity} 
                 onSelect={onActivityChange}
                 loading={loadingFilters}
             />
        </Box>

      </Box>
    </Box>
  );
}
