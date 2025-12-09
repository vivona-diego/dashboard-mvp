'use client'

import { Box, styled } from '@mui/material';

export const DarkBox = styled(Box)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
    borderRadius: 8,
}));
