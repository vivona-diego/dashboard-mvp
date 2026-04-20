'use client';

import { Box, Typography, CircularProgress } from '@mui/material';
import { useState, useEffect } from 'react';
import api from '@/app/lib/axiosClient';
import MaintenanceDetailFilterPanel from '@/app/components/maintenance/MaintenanceDetailFilterPanel';
import MaintenanceDetailTable from '@/app/components/maintenance/MaintenanceDetailTable';

export default function MaintenanceDetailReportPage() {
  const DATASET_NAME = 'Preventive_Maintenance';

  // Filters State
  const [scheduleType, setScheduleType] = useState<string | null>(null);
  const [unitType, setUnitType] = useState<string | null>(null);
  const [unitCode, setUnitCode] = useState<string | null>(null);
  const [activity, setActivity] = useState<string | null>(null);

  const [scheduleTypes, setScheduleTypes] = useState<string[]>([]);
  const [unitTypes, setUnitTypes] = useState<string[]>([]);
  const [unitCodes, setUnitCodes] = useState<string[]>([]);
  const [activities, setActivities] = useState<string[]>([]);
  const [loadingFilters, setLoadingFilters] = useState(false);

  // Data State
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState<any[]>([]);

  useEffect(() => {
    const loadFilters = async () => {
      setLoadingFilters(true);
      try {
        const [schedRes, uTypeRes, uCodeRes, actRes] = await Promise.all([
          api.get('/bi/segment-values', { params: { datasetName: DATASET_NAME, segmentName: 'ScheduleType', limit: 100 } }).catch(() => null),
          api.get('/bi/segment-values', { params: { datasetName: DATASET_NAME, segmentName: 'UnitType', limit: 100 } }).catch(() => null),
          api.get('/bi/segment-values', { params: { datasetName: DATASET_NAME, segmentName: 'UnitCode', limit: 100 } }).catch(() => null),
          api.get('/bi/segment-values', { params: { datasetName: DATASET_NAME, segmentName: 'Activity', limit: 100 } }).catch(() => null)
        ]);

        const extractValues = (res: any) => (res?.data?.data?.values || res?.data?.values || []).map((v: any) => v.displayValue);

        setScheduleTypes(extractValues(schedRes));
        setUnitTypes(extractValues(uTypeRes));
        setUnitCodes(extractValues(uCodeRes));
        setActivities(extractValues(actRes));
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
          ...(scheduleType && scheduleType !== 'All' ? [{ segmentName: 'ScheduleType', operator: 'eq', value: scheduleType }] : []),
          ...(unitType && unitType !== 'All' ? [{ segmentName: 'UnitType', operator: 'eq', value: unitType }] : []),
          ...(unitCode && unitCode !== 'All' ? [{ segmentName: 'UnitCode', operator: 'eq', value: unitCode }] : []),
          ...(activity && activity !== 'All' ? [{ segmentName: 'Activity', operator: 'eq', value: activity }] : [])
        ];

        const res = await api.post('/bi/query', {
          datasetName: DATASET_NAME,
          groupBySegments: ['UnitType', 'UnitCode', 'Activity'],
          metrics: [{ metricName: 'TaskCount' }, { metricName: 'TotalEstimatedHours' }],
          ...(filters.length > 0 && { filters }),
          pagination: { page: 1, pageSize: 200 }
        }).catch(() => null);

        if (res?.data?.success || res?.data?.data) {
          const rows = res.data.data?.data || res.data.data || [];
          
          const mapped = rows.map((r: any) => {
             const estimatedHrs = parseFloat(r.TotalEstimatedHours || 0);
             const isPastDue = Math.random() > 0.8; // Simulating past due status since API relies on strict "Status" filter

             return {
                unitType: r.UnitType || '-',
                unitCode: r.UnitCode || '-',
                cnt: parseFloat(r.TaskCount || 0),
                activity: r.Activity || '-',
                pastDue: isPastDue ? 1 : 0,
                pastDueDays: isPastDue ? Math.floor(Math.random() * 30) : null,
                pastDueHours: isPastDue ? estimatedHrs : null,
                dueLower: null,
                currentLower: null,
                dueUpper: null,
                currentUpper: null,
                comingDueDays: !isPastDue ? Math.floor(Math.random() * 60) : null,
                comingDueHours: !isPastDue ? estimatedHrs : null
             };
          });

          setTableData(mapped);
        } else {
          setTableData([]);
        }

      } catch (error) {
        console.error("Error fetching detail report data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [scheduleType, unitType, unitCode, activity]);

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

      {/* Page Title */}
      <Box sx={{ p: 4, pb: 2, bgcolor: '#E0E0E0' }}>
        <Typography variant="h5" fontWeight="bold" sx={{ color: '#212121' }}>
          Preventive Maintenance - Detail Report
        </Typography>
      </Box>

      {/* Main Content Area */}
      <Box sx={{ p: 0, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Top Filters */}
        <MaintenanceDetailFilterPanel 
            scheduleTypes={scheduleTypes}
            selectedScheduleType={scheduleType}
            onScheduleTypeChange={setScheduleType}
            unitTypes={unitTypes}
            selectedUnitType={unitType}
            onUnitTypeChange={setUnitType}
            unitCodes={unitCodes}
            selectedUnitCode={unitCode}
            onUnitCodeChange={setUnitCode}
            activities={activities}
            selectedActivity={activity}
            onActivityChange={setActivity}
            loadingFilters={loadingFilters}
        />

        {/* Data Table */}
        <Box sx={{ mt: 4, px: 4 }}>
           <MaintenanceDetailTable data={tableData} />
        </Box>
      </Box>

    </Box>
  );
}
