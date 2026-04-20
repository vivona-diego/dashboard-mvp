'use client';

import { Box, Typography, MenuItem, Select, FormControlLabel, Checkbox, FormGroup } from '@mui/material';
import SegmentSelector from '@/app/components/dashboard/SegmentSelector';

interface MaintenanceDetailFilterPanelProps {
  scheduleTypes: string[];
  selectedScheduleType: string | null;
  onScheduleTypeChange: (val: string | null) => void;
  
  unitTypes: string[];
  selectedUnitType: string | null;
  onUnitTypeChange: (val: string | null) => void;
  
  unitCodes: string[];
  selectedUnitCode: string | null;
  onUnitCodeChange: (val: string | null) => void;

  activities: string[];
  selectedActivity: string | null;
  onActivityChange: (val: string | null) => void;

  loadingFilters?: boolean;
}

export default function MaintenanceDetailFilterPanel({
  scheduleTypes, selectedScheduleType, onScheduleTypeChange,
  unitTypes, selectedUnitType, onUnitTypeChange,
  unitCodes, selectedUnitCode, onUnitCodeChange,
  activities, selectedActivity, onActivityChange,
  loadingFilters
}: MaintenanceDetailFilterPanelProps) {
  return (
    <Box sx={{ width: '100%', bgcolor: 'background.paper', display: 'flex', flexDirection: 'row', gap: 4, alignItems: 'flex-start', py: 2, px: 3, borderBottom: '1px solid #E0E0E0' }}>
        
        {/* Schedule Type */}
        <Box sx={{ flex: 1 }}>
             <SegmentSelector 
                 label='Schedule Type'
                 segments={scheduleTypes} 
                 selectedSegment={selectedScheduleType} 
                 onSelect={onScheduleTypeChange}
                 loading={loadingFilters}
             />
        </Box>

        {/* Unit Type */}
        <Box sx={{ flex: 1 }}>
             <SegmentSelector 
                 label='Unit Type'
                 segments={unitTypes} 
                 selectedSegment={selectedUnitType} 
                 onSelect={onUnitTypeChange}
                 loading={loadingFilters}
             />
        </Box>

        {/* UnitCode */}
        <Box sx={{ flex: 1 }}>
             <SegmentSelector 
                 label='Unit Code'
                 segments={unitCodes} 
                 selectedSegment={selectedUnitCode} 
                 onSelect={onUnitCodeChange}
                 loading={loadingFilters}
             />
        </Box>

        {/* Activity */}
        <Box sx={{ flex: 1 }}>
             <SegmentSelector 
                 label='Activity'
                 segments={activities} 
                 selectedSegment={selectedActivity} 
                 onSelect={onActivityChange}
                 loading={loadingFilters}
             />
        </Box>

        {/* Past Due Checkboxes */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'text.primary', mb: 0 }}>
                 Past Due
            </Typography>
            <FormGroup sx={{ mt: -0.5 }}>
              <FormControlLabel control={<Checkbox size="small" />} label={<Typography variant="body2">Select all</Typography>} sx={{ height: 24 }} />
              <FormControlLabel control={<Checkbox size="small" defaultChecked sx={{ color: 'black', '&.Mui-checked': { color: 'black' } }} />} label={<Typography variant="body2">0</Typography>} sx={{ height: 24 }} />
              <FormControlLabel control={<Checkbox size="small" />} label={<Typography variant="body2">1</Typography>} sx={{ height: 24 }} />
            </FormGroup>
        </Box>

    </Box>
  );
}
