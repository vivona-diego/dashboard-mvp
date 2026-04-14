'use client';

import { Box, Typography, MenuItem, Select, TextField, Stack } from '@mui/material';

export default function WOSummaryFilterPanel() {
  return (
    <Box sx={{ width: '100%', bgcolor: 'background.paper', display: 'flex', flexDirection: 'row', gap: 2, alignItems: 'flex-start', py: 1.5, px: 3, borderBottom: '1px solid #E0E0E0', flexWrap: 'wrap' }}>
        
        {/* Company */}
        <Box sx={{ minWidth: 160, flex: 1 }}>
            <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'text.secondary', display: 'block', mb: 0.5 }}>
                 Company
            </Typography>
            <Select size="small" fullWidth value="All" sx={{ bgcolor: 'white', '& .MuiSelect-select': { py: 0.5 } }}>
                 <MenuItem value="All">All</MenuItem>
            </Select>
        </Box>

        {/* Yard */}
        <Box sx={{ minWidth: 120, flex: 1 }}>
            <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'text.secondary', display: 'block', mb: 0.5 }}>
                 Yard
            </Typography>
            <Select size="small" fullWidth value="All" sx={{ bgcolor: 'white', '& .MuiSelect-select': { py: 0.5 } }}>
                 <MenuItem value="All">All</MenuItem>
            </Select>
        </Box>

        {/* Schedule Type... */}
        <Box sx={{ minWidth: 160, flex: 1 }}>
            <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'text.secondary', display: 'block', mb: 0.5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                 Schedule Type, UnitType, Uni...
            </Typography>
            <Select size="small" fullWidth value="All" sx={{ bgcolor: 'white', '& .MuiSelect-select': { py: 0.5 } }}>
                 <MenuItem value="All">All</MenuItem>
            </Select>
        </Box>

        {/* Activity */}
        <Box sx={{ minWidth: 140, flex: 1 }}>
            <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'text.secondary', display: 'block', mb: 0.5 }}>
                 Activity
            </Typography>
            <Select size="small" fullWidth value="All" sx={{ bgcolor: 'white', '& .MuiSelect-select': { py: 0.5 } }}>
                 <MenuItem value="All">All</MenuItem>
            </Select>
        </Box>

        {/* Date Range */}
        <Box sx={{ minWidth: 200, flex: 1 }}>
            <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'text.secondary', display: 'block', mb: 0.5 }}>
                 Date
            </Typography>
            <Stack direction="row" spacing={1}>
                <TextField size="small" value="01/01/2026" fullWidth sx={{ bgcolor: 'white', '& input': { py: 0.5, fontSize: '0.75rem' } }} />
                <TextField size="small" value="31/01/2026" fullWidth sx={{ bgcolor: 'white', '& input': { py: 0.5, fontSize: '0.75rem' } }} />
            </Stack>
        </Box>

    </Box>
  );
}
