
import React from 'react';
import { Autocomplete, TextField, Box, Typography, CircularProgress, Paper } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

interface SegmentSelectorProps {
  segments: string[] | any;
  selectedSegment: string | null;
  onSelect: (segment: string | null) => void;
  loading?: boolean;
  label?: string;
  orientation?:string;
}

export default function SegmentSelector({
  segments,
  selectedSegment,
  onSelect,
  loading = false,
  label = "Segment By:",
  orientation = "horizontal"
}: SegmentSelectorProps) {
  return (
    <Box sx={{ display: 'flex', flexDirection: orientation === "horizontal" ? "row" : "column", alignItems: 'center', gap: 1 }}>
      <Typography 
        variant="subtitle2" 
        color="text.secondary" 
        fontWeight="bold" 
        sx={{ 
          textTransform: 'uppercase', 
          letterSpacing: 0.5,
          fontSize: '0.75rem'
        }}
      >
        {label}
      </Typography>
      
      <Autocomplete
        options={segments}
        value={selectedSegment}
        onChange={(_, newValue) => onSelect(newValue)}
        loading={loading}
        disabled={loading}
        popupIcon={<KeyboardArrowDownIcon fontSize="small" />}
        sx={{ 
          width: '100%',
          minWidth: 200,
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
            backgroundColor: 'background.paper',
            paddingRight: '30px !important', // Fix arrow overlap
            transition: 'all 0.2s',
            boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)',
            '&:hover': {
               boxShadow: '0 2px 4px 0 rgba(0,0,0,0.1)',
            },
            '&.Mui-focused': {
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
            }
          } 
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            size="small"
            placeholder={loading ? "Loading..." : "Select segment"}
            slotProps={{
                input: {
                    ...params.InputProps,
                    endAdornment: (
                        <React.Fragment>
                        {loading ? <CircularProgress color="inherit" size={16} /> : null}
                        {params.InputProps.endAdornment}
                        </React.Fragment>
                    ),
                    style: { fontSize: '0.875rem', fontWeight: 500 }
                }
            }}
          />
        )}
        renderOption={(props, option) => {
             // Extract key to avoid prop spreading issues if any
             const { key, ...otherProps } = props;
             return (
              <Box
                component="li"
                key={key}
                {...otherProps}
                sx={{
                  typography: 'body2',
                  borderRadius: '6px',
                  mx: 1,
                  my: 0.5,
                  '&:hover': {
                    bgcolor: 'action.hover',
                  },
                  '&[aria-selected="true"]': { // Customize selected state
                     bgcolor: 'primary.lighter',
                     color: 'primary.main',
                     fontWeight: 'bold',
                  }
                }}
              >
                {option}
              </Box>
            );
        }}
        PaperComponent={(props) => (
            <Paper 
                {...props} 
                elevation={4} 
                sx={{ 
                    mt: 1, 
                    borderRadius: '12px', 
                    overflow: 'hidden',
                    border: '1px solid',
                    borderColor: 'divider',
                }} 
            />
        )}
      />
    </Box>
  );
}
