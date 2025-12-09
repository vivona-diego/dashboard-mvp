'use client'

import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import RemoveIcon from '@mui/icons-material/Remove';
import {
    Stack,
    Typography
} from '@mui/material';

interface PercentageChangeProps {
    value: number | 'inf';
}

const PercentageChange = ({ value }: PercentageChangeProps) => {
    let Icon;
    let text_color;
    let icon_color: "success" | "error" | "action";
    let final_value;

    if (value === 'inf') {
        Icon = ArrowDropUpIcon;
        icon_color = 'success';
        text_color = 'success.main';
        final_value = '∞';
    } else if (typeof value === 'number' && value > 0) {
        Icon = ArrowDropUpIcon;
        icon_color = 'success';
        text_color = 'success.main';
        final_value = `${value.toFixed(2)}%`;
    } else if (typeof value === 'number' && value < 0) {
        Icon = ArrowDropDownIcon;
        icon_color = 'error';
        text_color = 'error.main';
        final_value = `${value.toFixed(2)}%`;
    } else {
        Icon = RemoveIcon;
        icon_color = 'action';
        text_color = 'text.secondary';
        final_value = typeof value === 'number' ? `${value.toFixed(2)}%` : value;
    }

    return (
        <Stack direction="row" alignItems="center">
            <Icon color={icon_color} sx={{ fontSize: 36, ml: -1.5 }} />
            <Typography variant="h6" color={text_color} sx={{ fontWeight: 'bold' }}>
                {final_value}
            </Typography>
        </Stack>
    );
};

export default PercentageChange;
