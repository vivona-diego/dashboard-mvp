'use client';

import { useEffect, useState } from 'react';
import api from '../api/axiosClient';
import { Select, MenuItem, FormControl, InputLabel, OutlinedInput, Box } from '@mui/material';

export default function Page() {
  const [dataSets, setDataSets] = useState<any>(null);
  const [selectedDataset, setSelectedDataset] = useState<any>(null);
  const [datasetDetails, setDatasetDetails] = useState<any>(null);
  const [segments, setSegments] = useState<any>(null);
  const [metrics, setMetrics] = useState<any>(null);

  const [selectedSegments, setSelectedSegments] = useState<string[]>([]);
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
  const [queryResult, setQueryResult] = useState<any>(null);

  const [loading, setLoading] = useState(false);

  const getDatasets = async () => {
    setLoading(true);
    try {
      const res = await api.get('/bi/datasets');
      const data = res.data.data;
      console.log(data.datasets);
      const datasets = data.datasets;
      setDataSets(datasets);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const getDatasetDetails = async (datasetName: string) => {
    if (!datasetName) return;
    try {
      const res = await api.get(`/bi/datasets/${datasetName}`);
      const data = res.data.data;
      console.log('Dataset Details:', data);
      setDatasetDetails(data);
      if (data) {
        setSegments(data.segments);
        setMetrics(data.metrics);
        // Reset selections when dataset changes
        setSelectedSegments([]);
        setSelectedMetrics([]);
        setQueryResult(null);
      }
    } catch (error) {
      console.log('Error fetching dataset details:', error);
    }
  };

  const handleRunQuery = async () => {
    if (!selectedDataset || selectedSegments.length === 0 || selectedMetrics.length === 0) {
      alert('Please select a dataset, at least one segment, and at least one metric.');
      return;
    }

    const payload = {
      datasetName: selectedDataset[0],
      groupBySegments: selectedSegments,
      metrics: selectedMetrics.map((m) => ({ metricName: m })),
      orderBy: [{ field: selectedSegments[0], direction: 'ASC' }],
    };

    try {
      setLoading(true);
      const res = await api.post('/bi/query', payload);
      setQueryResult(res.data);
      console.log('Query Result:', res.data);
    } catch (error) {
      console.error('Error running query:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDatasets();
  }, []);

  useEffect(() => {
    if (selectedDataset) {
      getDatasetDetails(selectedDataset);
    }
  }, [selectedDataset]);

  return (
    <div style={{ color: 'black', padding: '20px' }}>
      {loading ? (
        <div>loading</div>
      ) : (
        <>
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Seleccionar Datasets</InputLabel>
            <Select
              multiple
              value={selectedDataset || []}
              onChange={(e) => setSelectedDataset(e.target.value as any)}
              input={<OutlinedInput label="Seleccionar Datasets" />}
            >
              {dataSets?.map((item: any) => (
                <MenuItem key={item.id} value={item.name}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {datasetDetails && (
            <Box sx={{ p: 2, mt: 3 }}>
              <h3>Dataset Details</h3>
              
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Select Segments</InputLabel>
                <Select
                  multiple
                  value={selectedSegments}
                  onChange={(e) => setSelectedSegments(typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value as string[])}
                  input={<OutlinedInput label="Select Segments" />}
                >
                  {segments?.map((seg: any) => (
                    <MenuItem key={seg.segmentId} value={seg.segment.segmentName}>
                      {seg.segment.segmentName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Select Metrics</InputLabel>
                <Select
                  multiple
                  value={selectedMetrics}
                  onChange={(e) => setSelectedMetrics(typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value as string[])}
                  input={<OutlinedInput label="Select Metrics" />}
                >
                  {metrics?.map((met: any) => (
                    <MenuItem key={met.metricId} value={met.metricName}>
                      {met.metricName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <button onClick={handleRunQuery} style={{ padding: '10px 20px', cursor: 'pointer', marginBottom: '20px' }}>
                Run Query
              </button>

              <h3>Detalles del Dataset (Raw)</h3>
              {/* <pre>{JSON.stringify(datasetDetails, null, 2)}</pre> */}
            </Box>
          )}

          {queryResult && (
             <Box sx={{ p: 2, mt: 3, bgcolor: '#f5f5f5' }}>
               <h3>Query Result</h3>
               <pre>{JSON.stringify(queryResult, null, 2)}</pre>
             </Box>
          )}

          <div>
            {dataSets?.map((item: any, idx: number) => (
              <div key={idx}>{item.name}</div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
