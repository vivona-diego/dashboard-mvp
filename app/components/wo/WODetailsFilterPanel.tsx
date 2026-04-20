'use client';

import { Box, Typography } from '@mui/material';
import SegmentSelector from '@/app/components/dashboard/SegmentSelector';

interface WODetailsFilterPanelProps {
  companies: string[];
  selectedCompany: string | null;
  onCompanyChange: (val: string | null) => void;

  yards: string[];
  selectedYard: string | null;
  onYardChange: (val: string | null) => void;

  statuses: string[];
  selectedStatus: string | null;
  onStatusChange: (val: string | null) => void;

  priorities: string[];
  selectedPriority: string | null;
  onPriorityChange: (val: string | null) => void;

  loadingFilters?: boolean;
}

export default function WODetailsFilterPanel({
  companies, selectedCompany, onCompanyChange,
  yards, selectedYard, onYardChange,
  statuses, selectedStatus, onStatusChange,
  priorities, selectedPriority, onPriorityChange,
  loadingFilters
}: WODetailsFilterPanelProps) {
  return (
    <Box sx={{ width: '100%', bgcolor: 'background.paper', display: 'flex', flexDirection: 'row', gap: 2, alignItems: 'flex-start', py: 2, px: 3, borderBottom: '1px solid #E0E0E0', flexWrap: 'wrap' }}>
        
        <Box sx={{ minWidth: 200, flex: 1 }}>
             <SegmentSelector 
                 label='Company'
                 segments={companies} 
                 selectedSegment={selectedCompany} 
                 onSelect={onCompanyChange}
                 loading={loadingFilters}
             />
        </Box>

        <Box sx={{ minWidth: 150, flex: 1 }}>
             <SegmentSelector 
                 label='Yard'
                 segments={yards} 
                 selectedSegment={selectedYard} 
                 onSelect={onYardChange}
                 loading={loadingFilters}
             />
        </Box>

        <Box sx={{ minWidth: 150, flex: 1 }}>
             <SegmentSelector 
                 label='WO Status'
                 segments={statuses} 
                 selectedSegment={selectedStatus} 
                 onSelect={onStatusChange}
                 loading={loadingFilters}
             />
        </Box>

        <Box sx={{ minWidth: 200, flex: 1 }}>
             <SegmentSelector 
                 label='WO Priority'
                 segments={priorities} 
                 selectedSegment={selectedPriority} 
                 onSelect={onPriorityChange}
                 loading={loadingFilters}
             />
        </Box>

    </Box>
  );
}
