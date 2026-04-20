'use client';

import { Box, Typography } from '@mui/material';
import SegmentSelector from '@/app/components/dashboard/SegmentSelector';

interface WOSummaryFilterPanelProps {
  companies: string[];
  selectedCompany: string | null;
  onCompanyChange: (val: string | null) => void;

  yards: string[];
  selectedYard: string | null;
  onYardChange: (val: string | null) => void;

  unitTypes: string[];
  selectedUnitType: string | null;
  onUnitTypeChange: (val: string | null) => void;

  activities: string[];
  selectedActivity: string | null;
  onActivityChange: (val: string | null) => void;

  loadingFilters?: boolean;
}

export default function WOSummaryFilterPanel({
  companies, selectedCompany, onCompanyChange,
  yards, selectedYard, onYardChange,
  unitTypes, selectedUnitType, onUnitTypeChange,
  activities, selectedActivity, onActivityChange,
  loadingFilters
}: WOSummaryFilterPanelProps) {
  return (
    <Box sx={{ width: '100%', bgcolor: 'background.paper', display: 'flex', flexDirection: 'row', gap: 2, alignItems: 'flex-start', py: 1.5, px: 3, borderBottom: '1px solid #E0E0E0', flexWrap: 'wrap' }}>
        
        <Box sx={{ minWidth: 160, flex: 1 }}>
             <SegmentSelector 
                 label='Company'
                 segments={companies} 
                 selectedSegment={selectedCompany} 
                 onSelect={onCompanyChange}
                 loading={loadingFilters}
             />
        </Box>

        <Box sx={{ minWidth: 120, flex: 1 }}>
             <SegmentSelector 
                 label='Yard'
                 segments={yards} 
                 selectedSegment={selectedYard} 
                 onSelect={onYardChange}
                 loading={loadingFilters}
             />
        </Box>

        <Box sx={{ minWidth: 160, flex: 1 }}>
             <SegmentSelector 
                 label='Unit Type'
                 segments={unitTypes} 
                 selectedSegment={selectedUnitType} 
                 onSelect={onUnitTypeChange}
                 loading={loadingFilters}
             />
        </Box>

        <Box sx={{ minWidth: 140, flex: 1 }}>
             <SegmentSelector 
                 label='Activity / Reason'
                 segments={activities} 
                 selectedSegment={selectedActivity} 
                 onSelect={onActivityChange}
                 loading={loadingFilters}
             />
        </Box>

        {/* Date disabled as custom date filter depends on new component */}
    </Box>
  );
}
