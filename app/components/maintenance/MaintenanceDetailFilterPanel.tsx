'use client';

import { Box, Typography, MenuItem, Select, FormControlLabel, Checkbox, FormGroup } from '@mui/material';

export default function MaintenanceDetailFilterPanel() {
  return (
    <Box sx={{ width: '100%', bgcolor: 'background.paper', display: 'flex', flexDirection: 'row', gap: 4, alignItems: 'flex-start', py: 2, px: 3, borderBottom: '1px solid #E0E0E0' }}>
        
        {/* Schedule Type */}
        <Box sx={{ flex: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'text.primary', mb: 1 }}>
                 Schedule Type
            </Typography>
            <Select size="small" fullWidth value="All" sx={{ bgcolor: 'white' }}>
                 <MenuItem value="All">All</MenuItem>
            </Select>
        </Box>

        {/* Unit Type */}
        <Box sx={{ flex: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'text.primary', mb: 1 }}>
                 Unit Type
            </Typography>
            <Select size="small" fullWidth value="All" sx={{ bgcolor: 'white' }}>
                 <MenuItem value="All">All</MenuItem>
            </Select>
        </Box>

        {/* UnitCode */}
        <Box sx={{ flex: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'text.primary', mb: 1 }}>
                 UnitCode
            </Typography>
            <Select size="small" fullWidth value="All" sx={{ bgcolor: 'white' }}>
                 <MenuItem value="All">All</MenuItem>
            </Select>
        </Box>

        {/* Activity */}
        <Box sx={{ flex: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'text.primary', mb: 1 }}>
                 Activity
            </Typography>
            <Select size="small" fullWidth value="All" sx={{ bgcolor: 'white' }}>
                 <MenuItem value="All">All</MenuItem>
            </Select>
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
