'use client'

import LastLabel from './LastLabel';
import PercentageChange from './PercentageChange';
import {
    Box,
    Divider,
    Stack
} from '@mui/material';

interface ComparisonRowProps {
    date_range: string;
    prev_change: number | 'inf';
    stack_change: number | 'inf';
}

const ComparisonRow = ({ date_range, prev_change, stack_change }: ComparisonRowProps) => {
    return (
        <Box>
            <Divider sx={{ my: 2 }} />
            <Stack direction="row">
                <Box
                    flex={1}
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                >
                    <LastLabel date_range={date_range} />
                    <PercentageChange value={prev_change} />
                </Box>
                <Box
                    flex={1}
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                >
                    <h4>vs. Last Year</h4>
                    <PercentageChange value={stack_change} />
                </Box>
            </Stack>
        </Box>
    )
};

export default ComparisonRow;
