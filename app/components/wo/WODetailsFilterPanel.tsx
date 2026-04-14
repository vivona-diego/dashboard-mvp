'use client';

import { Box, Typography, MenuItem, Select, TextField, Stack } from '@mui/material';

export default function WODetailsFilterPanel() {
  return (
    <Box sx={{ width: '100%', bgcolor: 'background.paper', display: 'flex', flexDirection: 'row', gap: 2, alignItems: 'flex-start', py: 2, px: 3, borderBottom: '1px solid #E0E0E0', flexWrap: 'wrap' }}>
        
        {/* Company */}
        <Box sx={{ minWidth: 200, flex: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'text.primary', mb: 1 }}>
                 Company
            </Typography>
            <Select size="small" fullWidth value="All" sx={{ bgcolor: 'white' }}>
                 <MenuItem value="All">All</MenuItem>
            </Select>
        </Box>

        {/* Yard */}
        <Box sx={{ minWidth: 150, flex: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'text.primary', mb: 1 }}>
                 Yard
            </Typography>
            <Select size="small" fullWidth value="All" sx={{ bgcolor: 'white' }}>
                 <MenuItem value="All">All</MenuItem>
            </Select>
        </Box>

        {/* Employee */}
        <Box sx={{ minWidth: 150, flex: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'text.primary', mb: 1 }}>
                 Employee
            </Typography>
            <Select size="small" fullWidth value="All" sx={{ bgcolor: 'white' }}>
                 <MenuItem value="All">All</MenuItem>
            </Select>
        </Box>

        {/* Activity */}
        <Box sx={{ minWidth: 200, flex: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'text.primary', mb: 1 }}>
                 Activity
            </Typography>
            <Select size="small" fullWidth value="All" sx={{ bgcolor: 'white' }}>
                 <MenuItem value="All">All</MenuItem>
            </Select>
        </Box>

        {/* Date Range */}
        <Box sx={{ minWidth: 250, flex: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'text.primary', mb: 1 }}>
                 Date
            </Typography>
            <Stack direction="row" spacing={1}>
                <TextField size="small" value="01/01/2026" fullWidth sx={{ bgcolor: 'white' }} />
                <TextField size="small" value="31/01/2026" fullWidth sx={{ bgcolor: 'white' }} />
            </Stack>
        </Box>

    </Box>
  );
}
