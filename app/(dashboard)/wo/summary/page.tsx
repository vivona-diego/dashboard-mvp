'use client';

import { Box, Typography, Grid, CircularProgress } from '@mui/material';
import { useState, useEffect } from 'react';
import api from '@/app/lib/axiosClient';
import WOSummaryFilterPanel from '@/app/components/wo/WOSummaryFilterPanel';
import WOSummaryChart from '@/app/components/wo/WOSummaryChart';
import WOSummaryTable, { WOSummaryRow } from '@/app/components/wo/WOSummaryTable';
import WOSummaryKPIs from '@/app/components/wo/WOSummaryKPIs';

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function WOSummaryPage() {
  const DATASET_NAME = 'WO_Dashboard';

  const [company, setCompany] = useState<string | null>(null);
  const [yard, setYard] = useState<string | null>(null);
  const [unitType, setUnitType] = useState<string | null>(null);
  const [activity, setActivity] = useState<string | null>(null);

  const [companies, setCompanies] = useState<string[]>([]);
  const [yards, setYards] = useState<string[]>([]);
  const [unitTypes, setUnitTypes] = useState<string[]>([]);
  const [activities, setActivities] = useState<string[]>([]);
  const [loadingFilters, setLoadingFilters] = useState(false);

  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState<WOSummaryRow[]>([]);
  
  // KPI state
  const [woAmountCY, setWoAmountCY] = useState(0);
  const [woAmountPY, setWoAmountPY] = useState(0);
  const [totalWOCY, setTotalWOCY] = useState(0);
  const [totalWOPY, setTotalWOPY] = useState(0);

  useEffect(() => {
    const loadFilters = async () => {
       setLoadingFilters(true);
       try {
          const [cRes, yRes, utRes, aRes] = await Promise.all([
             api.get('/bi/segment-values', { params: { datasetName: DATASET_NAME, segmentName: 'Company', limit: 100 } }).catch(()=>null),
             api.get('/bi/segment-values', { params: { datasetName: DATASET_NAME, segmentName: 'Yard', limit: 100 } }).catch(()=>null),
             api.get('/bi/segment-values', { params: { datasetName: DATASET_NAME, segmentName: 'UnitType', limit: 100 } }).catch(()=>null),
             api.get('/bi/segment-values', { params: { datasetName: DATASET_NAME, segmentName: 'WOReason', limit: 100 } }).catch(()=>null)
          ]);
          const ex = (res: any) => (res?.data?.data?.values || res?.data?.values || []).map((v:any)=>v.displayValue);
          setCompanies(ex(cRes));
          setYards(ex(yRes));
          setUnitTypes(ex(utRes));
          setActivities(ex(aRes));
       } finally {
          setLoadingFilters(false);
       }
    };
    loadFilters();
  }, []);

  useEffect(() => {
     const fetchData = async () => {
         setLoading(true);
         try {
            const filters = [
               ...(company && company !== 'All' ? [{ segmentName: 'Company', operator: 'eq', value: company }] : []),
               ...(yard && yard !== 'All' ? [{ segmentName: 'Yard', operator: 'eq', value: yard }] : []),
               ...(unitType && unitType !== 'All' ? [{ segmentName: 'UnitType', operator: 'eq', value: unitType }] : []),
               ...(activity && activity !== 'All' ? [{ segmentName: 'WOReason', operator: 'eq', value: activity }] : []),
            ];

            const res = await api.post('/bi/query', {
               datasetName: DATASET_NAME,
               groupBySegments: ['Year', 'Month', 'WOStatus'],
               metrics: [
                   { metricName: 'WOCount' },
                   { metricName: 'TotalWOCost' }
               ],
               ...(filters.length > 0 && { filters }),
               pagination: { page: 1, pageSize: 200 }
            }).catch(() => null);

            let mapped: WOSummaryRow[] = [];
            let cyAmt = 0, pyAmt = 0, cyCnt = 0, pyCnt = 0;

            if (res?.data?.success || res?.data?.data) {
                const rows = res.data.data?.data || res.data.data || [];
                
                // Find Years
                const years = Array.from(new Set(rows.map((r:any) => parseInt(r.Year)))).filter(y => !isNaN(y as number)) as number[];
                const CY = years.length > 0 ? Math.max(...years) : new Date().getFullYear();
                const PY = CY - 1;

                const monthsData: Record<number, WOSummaryRow> = {};
                for (let i = 1; i <= 12; i++) {
                    monthsData[i] = {
                        month: MONTH_NAMES[i - 1],
                        totalWO: 0, totalWOPY: 0,
                        totalAmount: 0, totalAmountPY: 0,
                        closed: 0, closedPY: 0,
                        open: 0, openPY: 0
                    };
                }

                rows.forEach((r: any) => {
                    const yr = parseInt(r.Year);
                    const mo = parseInt(r.Month);
                    const woCnt = parseFloat(r.WOCount || 0);
                    const woCost = parseFloat(r.TotalWOCost || 0);
                    const isClosed = r.WOStatus === 'Closed' || r.WOStatus === 'Work Finished';
                    
                    if (mo >= 1 && mo <= 12) {
                        const mData = monthsData[mo];
                        if (yr === CY) {
                            mData.totalWO += woCnt;
                            mData.totalAmount += woCost;
                            if (isClosed) mData.closed += woCnt;
                            else mData.open += woCnt;

                            cyAmt += woCost;
                            cyCnt += woCnt;
                        } else if (yr === PY) {
                            mData.totalWOPY += woCnt;
                            mData.totalAmountPY += woCost;
                            if (isClosed) mData.closedPY += woCnt;
                            else mData.openPY += woCnt;

                            pyAmt += woCost;
                            pyCnt += woCnt;
                        }
                    }
                });

                mapped = Object.values(monthsData);
            }

            setTableData(mapped);
            setWoAmountCY(cyAmt);
            setWoAmountPY(pyAmt);
            setTotalWOCY(cyCnt);
            setTotalWOPY(pyCnt);

         } catch(error) {
             console.error("Failed to load WO Summary Data:", error);
         } finally {
             setLoading(false);
         }
     };

     fetchData();
  }, [company, yard, unitType, activity]);

  const monthsChart = tableData.map(d => d.month);
  const tAmts = tableData.map(d => d.totalAmount / 1000);
  const tAmtsPY = tableData.map(d => d.totalAmountPY / 1000);
  const tWO = tableData.map(d => d.totalWO);
  const tWOPY = tableData.map(d => d.totalWOPY);

  return (
    <Box sx={{ bgcolor: '#F5F5F5', minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      
      {loading && (
          <Box sx={{ 
              position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, 
              display: 'flex', alignItems: 'center', justifyContent: 'center', 
              bgcolor: 'rgba(255,255,255,0.7)', zIndex: 10 
          }}>
              <CircularProgress />
          </Box>
      )}

      {/* Top Header & Filters Panel */}
      <Box sx={{ px: 4, pt: 3 }}>
        <Grid container alignItems="center" spacing={2}>
          <Grid size={{ xs: 12, md: 3 }}>
            <Typography variant="h5" fontWeight="bold" sx={{ color: '#212121' }}>
              WO Summary CY Vs. PY
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 9 }}>
            <WOSummaryFilterPanel 
                 companies={companies}
                 selectedCompany={company}
                 onCompanyChange={setCompany}
                 yards={yards}
                 selectedYard={yard}
                 onYardChange={setYard}
                 unitTypes={unitTypes}
                 selectedUnitType={unitType}
                 onUnitTypeChange={setUnitType}
                 activities={activities}
                 selectedActivity={activity}
                 onActivityChange={setActivity}
                 loadingFilters={loadingFilters}
            />
          </Grid>
        </Grid>
      </Box>

      {/* Main Content Area */}
      <Box sx={{ p: 4, flexGrow: 1 }}>
        <Grid container spacing={4}>
          
          {/* Left Column: Chart and Table */}
          <Grid size={{ xs: 12, md: 9 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ bgcolor: 'background.paper', borderRadius: 1, boxShadow: 1, overflow: 'hidden' }}>
                <WOSummaryChart 
                    months={monthsChart}
                    totalWOAmount={tAmts}
                    totalWOAmountPY={tAmtsPY}
                    totalWO={tWO}
                    totalWOPY={tWOPY}
                />
              </Box>
              <Box sx={{ bgcolor: 'background.paper', borderRadius: 1, boxShadow: 1, overflow: 'hidden' }}>
                <WOSummaryTable data={tableData} />
              </Box>
            </Box>
          </Grid>

          {/* Right Column: KPIs */}
          <Grid size={{ xs: 12, md: 3 }}>
            <Box sx={{ height: '100%', minHeight: 600 }}>
               <WOSummaryKPIs 
                   woAmountCY={woAmountCY}
                   woAmountPY={woAmountPY}
                   totalWOCY={totalWOCY}
                   totalWOPY={totalWOPY}
               />
            </Box>
          </Grid>

        </Grid>
      </Box>

    </Box>
  );
}
