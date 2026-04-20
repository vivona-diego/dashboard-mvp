'use client';

import { Box, Typography, CircularProgress } from '@mui/material';
import { useState, useEffect } from 'react';
import api from '@/app/lib/axiosClient';
import WODetailsFilterPanel from '@/app/components/wo/WODetailsFilterPanel';
import WODetailsTable from '@/app/components/wo/WODetailsTable';
import WOActivitiesTable from '@/app/components/wo/WOActivitiesTable';

export default function WODetailsPage() {
  const DATASET_NAME = 'WO_Dashboard';

  const [company, setCompany] = useState<string | null>(null);
  const [yard, setYard] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [priority, setPriority] = useState<string | null>(null);

  const [companies, setCompanies] = useState<string[]>([]);
  const [yards, setYards] = useState<string[]>([]);
  const [statuses, setStatuses] = useState<string[]>([]);
  const [priorities, setPriorities] = useState<string[]>([]);
  const [loadingFilters, setLoadingFilters] = useState(false);

  const [loading, setLoading] = useState(false);
  const [detailsData, setDetailsData] = useState<any[]>([]);
  const [activitiesData, setActivitiesData] = useState<any[]>([]);

  useEffect(() => {
    const loadFilters = async () => {
      setLoadingFilters(true);
      try {
        const [compRes, yardRes, statRes, prioRes] = await Promise.all([
          api.get('/bi/segment-values', { params: { datasetName: DATASET_NAME, segmentName: 'Company', limit: 100 } }).catch(() => null),
          api.get('/bi/segment-values', { params: { datasetName: DATASET_NAME, segmentName: 'Yard', limit: 100 } }).catch(() => null),
          api.get('/bi/segment-values', { params: { datasetName: DATASET_NAME, segmentName: 'WOStatus', limit: 100 } }).catch(() => null),
          api.get('/bi/segment-values', { params: { datasetName: DATASET_NAME, segmentName: 'WOPriority', limit: 100 } }).catch(() => null)
        ]);

        const extract = (res: any) => (res?.data?.data?.values || res?.data?.values || []).map((v: any) => v.displayValue);

        setCompanies(extract(compRes));
        setYards(extract(yardRes));
        setStatuses(extract(statRes));
        setPriorities(extract(prioRes));
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
          ...(status && status !== 'All' ? [{ segmentName: 'WOStatus', operator: 'eq', value: status }] : []),
          ...(priority && priority !== 'All' ? [{ segmentName: 'WOPriority', operator: 'eq', value: priority }] : [])
        ];

        const [detailsRes, activitiesRes] = await Promise.all([
          api.post('/bi/query', {
            datasetName: DATASET_NAME,
            groupBySegments: ['Company', 'Yard', 'WorkOrderNumber', 'WOStatus'],
            metrics: [{ metricName: 'LaborCost' }],
            ...(filters.length > 0 && { filters }),
            pagination: { page: 1, pageSize: 150 }
          }).catch(() => null),
          
          api.post('/bi/query', {
            datasetName: DATASET_NAME,
            groupBySegments: ['WorkOrderNumber', 'UnitCode', 'WOReason'],
            metrics: [
                { metricName: 'LaborCost' }, 
                { metricName: 'MaterialCost' }, 
                { metricName: 'TotalWOCost' }
            ],
            ...(filters.length > 0 && { filters }),
            pagination: { page: 1, pageSize: 150 }
          }).catch(() => null)
        ]);

        if (detailsRes?.data?.success || detailsRes?.data?.data) {
           const rows = detailsRes.data.data?.data || detailsRes.data.data || [];
           setDetailsData(rows.map((r: any) => ({
              company: r.Company || '-',
              yard: r.Yard || '-',
              wo: r.WorkOrderNumber || '-',
              issueDate: '-', // Not available
              status: r.WOStatus || '-',
              employeeName: '-', // Not available
              laborAmount: parseFloat(r.LaborCost || 0)
           })));
        } else {
            setDetailsData([]);
        }

        if (activitiesRes?.data?.success || activitiesRes?.data?.data) {
           const rows = activitiesRes.data.data?.data || activitiesRes.data.data || [];
           setActivitiesData(rows.map((r: any) => ({
              wo: r.WorkOrderNumber || '-',
              unit: r.UnitCode || '-',
              activityCode: '-',
              activity: r.WOReason || '-',
              comments: '-',
              billable: '-',
              prevMaint: '-',
              price: null,
              partsAmount: parseFloat(r.MaterialCost || 0),
              laborAmount: parseFloat(r.LaborCost || 0),
              totalAmount: parseFloat(r.TotalWOCost || 0)
           })));
        } else {
            setActivitiesData([]);
        }

      } catch (error) {
        console.error("Error fetching WO details data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [company, yard, status, priority]);

  return (
    <Box sx={{ bgcolor: '#EEEEEE', minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      {loading && (
          <Box sx={{ 
              position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, 
              display: 'flex', alignItems: 'center', justifyContent: 'center', 
              bgcolor: 'rgba(255,255,255,0.7)', zIndex: 10 
          }}>
              <CircularProgress />
          </Box>
      )}
      
      {/* Top Section with Title and Filters */}
      <Box sx={{ display: 'flex', alignItems: 'center', p: 3, pb: 0, gap: 4 }}>
         <Typography variant="h5" fontWeight="bold" sx={{ color: '#212121', whiteSpace: 'nowrap' }}>
            Work Order Details
         </Typography>

         <Box sx={{ flexGrow: 1 }}>
             <WODetailsFilterPanel 
                 companies={companies}
                 selectedCompany={company}
                 onCompanyChange={setCompany}
                 yards={yards}
                 selectedYard={yard}
                 onYardChange={setYard}
                 statuses={statuses}
                 selectedStatus={status}
                 onStatusChange={setStatus}
                 priorities={priorities}
                 selectedPriority={priority}
                 onPriorityChange={setPriority}
                 loadingFilters={loadingFilters}
             />
         </Box>
      </Box>

      {/* Main Content Area */}
      <Box sx={{ p: 4, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <WODetailsTable data={detailsData} />
        <WOActivitiesTable data={activitiesData} />
      </Box>

    </Box>
  );
}
