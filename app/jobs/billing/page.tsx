'use client';

import { Box, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import SegmentSelector from '../../components/dashboard/SegmentSelector';
import JobsUnbilledTable, { JobsUnbilledData } from '../../components/dashboard/JobsUnbilledTable';

export default function JobsBilledUnbilledRecurringPage() {
    // Filter States
    const [yard, setYard] = useState<string | null>('Kensington');
    const [jobNo, setJobNo] = useState<string | null>('All');
    const [jobStatus, setJobStatus] = useState<string | null>('All');
    const [salesperson, setSalesperson] = useState<string | null>('All');

    // Mock Data
    const tableData: JobsUnbilledData[] = [
        { jobNo: 'C-33650', jobStatus: 'Finished', customer: 'SHOULDICE INDUSTRIAL MANUFACTURES AND CONTRACTORS', jobStart: '10/06/2023', jobEnd: '12/20/2023', salesperson: 'McVittie, Matt', lastInvDate: '', totalToBeBilled: 186508.28, billedTillNow: 211060.92, remToBilled: -24552.64 },
        { jobNo: 'C-33773', jobStatus: 'Finished', customer: 'SPECIALIZED CONSTRUCTION SERVICES', jobStart: '03/26/2024', jobEnd: '04/24/2024', salesperson: 'McVittie, Matt', lastInvDate: '', totalToBeBilled: 181435.30, billedTillNow: 189112.47, remToBilled: -7677.17 },
        { jobNo: 'C-33218', jobStatus: 'Finished', customer: 'Fessler & Bowman Inc.', jobStart: '04/18/2023', jobEnd: '10/06/2023', salesperson: 'McVittie, Matt', lastInvDate: '', totalToBeBilled: 139814.00, billedTillNow: 163667.05, remToBilled: -23853.05 },
        { jobNo: 'C-33934', jobStatus: 'Cancelled', customer: 'FONTANESI & KANN CO.', jobStart: '08/30/2024', jobEnd: '09/02/2024', salesperson: 'Gentner, Brian', lastInvDate: '', totalToBeBilled: 94464.24, billedTillNow: 0, remToBilled: 94464.24 },
        { jobNo: 'C-35455', jobStatus: 'Finished', customer: 'BRANDENBURG INDUSTRIAL SERVICE', jobStart: '08/05/2025', jobEnd: '08/18/2025', salesperson: 'McVittie, Matt', lastInvDate: '', totalToBeBilled: 86182.00, billedTillNow: 82758.50, remToBilled: 3423.50 },
        { jobNo: 'C-33907', jobStatus: 'Finished', customer: 'PEAKER SERVICES INC.', jobStart: '01/08/2024', jobEnd: '01/11/2024', salesperson: 'Gentner, Brian', lastInvDate: '', totalToBeBilled: 82002.42, billedTillNow: 82632.82, remToBilled: -630.40 },
        { jobNo: 'C-33718', jobStatus: 'Cancelled', customer: 'Fessler & Bowman Inc.', jobStart: '08/21/2023', jobEnd: '11/21/2023', salesperson: 'McVittie, Matt', lastInvDate: '', totalToBeBilled: 68392.00, billedTillNow: 0, remToBilled: 68392.00 },
        { jobNo: 'C-33578', jobStatus: 'Finished', customer: 'PEAKER SERVICES INC.', jobStart: '10/23/2023', jobEnd: '10/30/2023', salesperson: 'Gentner, Brian', lastInvDate: '', totalToBeBilled: 60397.14, billedTillNow: 60829.14, remToBilled: -432.00 },
        { jobNo: 'C-33223', jobStatus: 'Cancelled', customer: 'Fessler & Bowman Inc.', jobStart: '10/17/2023', jobEnd: '12/17/2023', salesperson: 'McVittie, Matt', lastInvDate: '', totalToBeBilled: 52839.00, billedTillNow: 0, remToBilled: 52839.00 },
        { jobNo: 'C-33320', jobStatus: 'Finished', customer: 'M & W Crane Service', jobStart: '03/13/2023', jobEnd: '03/17/2023', salesperson: 'McComas, Chad', lastInvDate: '', totalToBeBilled: 51060.83, billedTillNow: 42262.56, remToBilled: 8798.27 },
        { jobNo: 'C-33444', jobStatus: 'Cancelled', customer: 'Kafael Building Group', jobStart: '04/01/2024', jobEnd: '06/02/2024', salesperson: 'McVittie, Matt', lastInvDate: '', totalToBeBilled: 50286.00, billedTillNow: 0, remToBilled: 50286.00 },
        { jobNo: 'C-34121', jobStatus: 'Finished', customer: 'LARAMIE INC', jobStart: '02/07/2024', jobEnd: '02/09/2024', salesperson: 'McVittie, Matt', lastInvDate: '', totalToBeBilled: 42791.68, billedTillNow: 41801.84, remToBilled: 989.84 },
        { jobNo: 'C-33995', jobStatus: 'Finished', customer: 'Phoenix Equipment Corporation', jobStart: '12/11/2023', jobEnd: '12/13/2023', salesperson: 'McVittie, Matt', lastInvDate: '', totalToBeBilled: 42609.53, billedTillNow: 43096.88, remToBilled: -487.35 },
        { jobNo: 'C-34075', jobStatus: 'Finished', customer: 'The Berg Group', jobStart: '01/22/2024', jobEnd: '04/06/2024', salesperson: 'McVittie, Matt', lastInvDate: '', totalToBeBilled: 42352.44, billedTillNow: 47379.30, remToBilled: -5026.86 },
        { jobNo: 'C-33677', jobStatus: 'Finished', customer: 'Fessler & Bowman Inc.', jobStart: '08/02/2023', jobEnd: '09/14/2023', salesperson: 'McVittie, Matt', lastInvDate: '', totalToBeBilled: 41354.50, billedTillNow: 47382.21, remToBilled: -6027.71 },
        { jobNo: 'C-34024', jobStatus: 'Finished', customer: 'SAV\'S WELDING', jobStart: '01/16/2024', jobEnd: '02/08/2024', salesperson: 'McComas, Chad', lastInvDate: '', totalToBeBilled: 36184.05, billedTillNow: 38535.30, remToBilled: -2351.25 },
        { jobNo: 'C-33552', jobStatus: 'Finished', customer: 'IDEAL CONTRACTING L.L.C.', jobStart: '06/09/2023', jobEnd: '06/20/2023', salesperson: 'Gentner, Brian', lastInvDate: '', totalToBeBilled: 33140.00, billedTillNow: 31794.00, remToBilled: 1346.00 },
        { jobNo: 'C-35548', jobStatus: 'Confirmed', customer: 'LEE INDUSTRIAL CONTRACTING', jobStart: '01/19/2026', jobEnd: '03/20/2026', salesperson: 'McVittie, Matt', lastInvDate: '', totalToBeBilled: 31875.00, billedTillNow: 0, remToBilled: 31875.00 },
        { jobNo: 'C-33640', jobStatus: 'Finished', customer: 'Fessler & Bowman Inc.', jobStart: '08/28/2023', jobEnd: '10/02/2023', salesperson: 'McVittie, Matt', lastInvDate: '', totalToBeBilled: 31803.60, billedTillNow: 42726.59, remToBilled: -10922.99 },
        { jobNo: 'C-34069', jobStatus: 'Finished', customer: 'DSP Constructors', jobStart: '02/02/2024', jobEnd: '03/14/2024', salesperson: 'Gentner, Brian', lastInvDate: '', totalToBeBilled: 31395.00, billedTillNow: 45176.81, remToBilled: -13781.81 },
        { jobNo: 'C-33355', jobStatus: 'Finished', customer: 'AIR SYSTEMS DESIGN, Inc.', jobStart: '10/06/2023', jobEnd: '10/08/2023', salesperson: 'Gentner, Brian', lastInvDate: '', totalToBeBilled: 31067.00, billedTillNow: 31886.24, remToBilled: -819.24 },
        { jobNo: 'C-33683', jobStatus: 'Finished', customer: 'DURR SYSTEMS INC PAINT FINISHINGS', jobStart: '09/08/2023', jobEnd: '09/17/2023', salesperson: 'Gentner, Brian', lastInvDate: '', totalToBeBilled: 30328.35, billedTillNow: 59813.99, remToBilled: -29485.64 },
    ];

    return (
        <Box sx={{ height: 'calc(100vh - 100px)', display: 'flex', flexDirection: 'column', p: 3, bgcolor: 'background.default', overflow: 'hidden' }}>
            <Stack spacing={3} sx={{ height: '100%' }}>
                {/* Header & Filters */}
                <Box sx={{ flexShrink: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
                    <Box sx={{ py: 1, px: 2, bgcolor: '#e0e0e0', borderRadius: 1 }}> {/* Grey background as in image */}
                        <Typography variant="h6" fontWeight="bold" color="text.primary">
                            Jobs Billed/Unbilled/Recurring Summary
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                        <Box>
                            <Typography variant="caption" display="block" color="text.secondary" mb={0.5}>Yard</Typography>
                            <SegmentSelector 
                                segments={['Kensington', 'Detroit', 'Toledo']} 
                                selectedSegment={yard} 
                                onSelect={setYard}
                            />
                        </Box>
                        <Box>
                            <Typography variant="caption" display="block" color="text.secondary" mb={0.5}>Job No</Typography>
                            <SegmentSelector 
                                segments={['All']} 
                                selectedSegment={jobNo} 
                                onSelect={setJobNo}
                            />
                        </Box>
                         <Box>
                            <Typography variant="caption" display="block" color="text.secondary" mb={0.5}>Job Status</Typography>
                            <SegmentSelector 
                                segments={['All', 'Finished', 'Cancelled', 'Confirmed']} 
                                selectedSegment={jobStatus} 
                                onSelect={setJobStatus}
                            />
                        </Box>
                         <Box>
                            <Typography variant="caption" display="block" color="text.secondary" mb={0.5}>Salesperson</Typography>
                            <SegmentSelector 
                                segments={['All', 'McVittie, Matt', 'Gentner, Brian', 'McComas, Chad', 'Weber, Trever']} 
                                selectedSegment={salesperson} 
                                onSelect={setSalesperson}
                            />
                        </Box>
                    </Box>
                </Box>

                {/* Table */}
                <Box sx={{ flexGrow: 1, overflow: 'hidden', minHeight: 0 }}>
                    <JobsUnbilledTable data={tableData} />
                </Box>
            </Stack>
        </Box>
    );
}
