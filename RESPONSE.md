# Documentación de Endpoints de Gráficos (BI Charts)

**Base URL:** `{{env.BASE_URL}}/bi/chart`
**Método:** `POST`

-----

## 1\. Cost by Customer (Bar Chart)

**Descripción:** Visualización de costos totales agrupados por cliente, ordenados de forma descendente.

### 📥 Request Body

```json
{
  "datasetName": "FCC_Jobs",
  "groupBySegments": ["Customer"],
  "metrics": [{"metricName": "TotalCost"}],
  "orderBy": [{"field": "TotalCost", "direction": "DESC"}],
  "chartConfig": {
    "chartType": "bar",
    "xAxis": "Customer",
    "yAxis": ["TotalCost"],
    "colors": ["#3b82f6"],
    "showLegend": true
  }
}
```

### 📤 Response

```json
{
  "success": true,
  "data": {
    "success": true,
    "data": [
      { "Customer": "Local Shop", "TotalCost": 30900 },
      { "Customer": "Global Services", "TotalCost": 25150 },
      { "Customer": "Acme Corp", "TotalCost": 17150 },
      { "Customer": "Tech Industries", "TotalCost": 11300 }
    ],
    "metadata": {
      "datasetName": "FCC_Jobs",
      "totalRows": 4,
      "executionTimeMs": 1165,
      "cacheHit": false,
      "segments": ["Customer"],
      "metrics": ["TotalCost"]
    },
    "chartData": {
      "labels": ["Local Shop", "Global Services", "Acme Corp", "Tech Industries"],
      "datasets": [
        {
          "label": "TotalCost",
          "data": [30900, 25150, 17150, 11300],
          "backgroundColor": "#3b82f6",
          "borderColor": "#3b82f6"
        }
      ]
    }
  },
  "timestamp": "2025-12-09T19:22:32.694Z"
}
```

-----

## 2\. Monthly Trend (Line Chart)

**Descripción:** Análisis de tendencia mensual comparando Costo Total y Cantidad de Trabajos.

### 📥 Request Body

```json
{
  "datasetName": "FCC_Jobs",
  "groupBySegments": ["Month"],
  "metrics": [
    { "metricName": "TotalCost" },
    { "metricName": "TotalJobs" }
  ],
  "orderBy": [{ "field": "Month", "direction": "ASC" }],
  "chartConfig": {
    "chartType": "line",
    "xAxis": "Month",
    "yAxis": ["TotalCost", "TotalJobs"],
    "colors": ["#10b981", "#f59e0b"],
    "showLegend": true
  }
}
```

### 📤 Response

```json
{
  "success": true,
  "data": {
    "success": true,
    "data": [
      { "Month": 1, "TotalCost": 8900, "TotalJobs": 3 },
      { "Month": 2, "TotalCost": 13000, "TotalJobs": 3 },
      { "Month": 3, "TotalCost": 17700, "TotalJobs": 4 },
      { "Month": 4, "TotalCost": 9600, "TotalJobs": 2 },
      { "Month": 5, "TotalCost": 3900, "TotalJobs": 2 },
      { "Month": 6, "TotalCost": 11550, "TotalJobs": 3 },
      { "Month": 7, "TotalCost": 15250, "TotalJobs": 2 },
      { "Month": 8, "TotalCost": 4600, "TotalJobs": 1 }
    ],
    "metadata": {
      "datasetName": "FCC_Jobs",
      "totalRows": 8,
      "executionTimeMs": 1621,
      "cacheHit": false,
      "segments": ["Month"],
      "metrics": ["TotalCost", "TotalJobs"]
    },
    "chartData": {
      "labels": ["1", "2", "3", "4", "5", "6", "7", "8"],
      "datasets": [
        {
          "label": "TotalCost",
          "data": [8900, 13000, 17700, 9600, 3900, 11550, 15250, 4600],
          "backgroundColor": "#10b981",
          "borderColor": "#10b981"
        },
        {
          "label": "TotalJobs",
          "data": [3, 3, 4, 2, 2, 3, 2, 1],
          "backgroundColor": "#f59e0b",
          "borderColor": "#f59e0b"
        }
      ]
    }
  },
  "timestamp": "2025-12-09T19:24:35.380Z"
}
```

-----

## 3\. Jobs by Status (Pie Chart)

**Descripción:** Distribución porcentual de los trabajos según su estado actual.

### 📥 Request Body

```json
{
  "datasetName": "FCC_Jobs",
  "groupBySegments": ["Status"],
  "metrics": [{ "metricName": "TotalJobs" }],
  "chartConfig": {
    "chartType": "pie",
    "showLegend": true
  }
}
```

### 📤 Response

```json
{
  "success": true,
  "data": {
    "success": true,
    "data": [
      { "Status": "Cancelled", "TotalJobs": 1 },
      { "Status": "Completed", "TotalJobs": 16 },
      { "Status": "In Progress", "TotalJobs": 2 },
      { "Status": "Pending", "TotalJobs": 1 }
    ],
    "metadata": {
      "datasetName": "FCC_Jobs",
      "totalRows": 4,
      "executionTimeMs": 1626,
      "cacheHit": false,
      "segments": ["Status"],
      "metrics": ["TotalJobs"]
    },
    "chartData": {
      "labels": ["Cancelled", "Completed", "In Progress", "Pending"],
      "datasets": [
        {
          "label": "TotalJobs",
          "data": [1, 16, 2, 1],
          "backgroundColor": "#3b82f6",
          "borderColor": "#3b82f6"
        }
      ]
    }
  },
  "timestamp": "2025-12-09T19:27:16.393Z"
}
```

-----

## 4\. Cost by Job Type (Pie Chart)

**Descripción:** Distribución de costos financieros agrupados por tipo de trabajo.

### 📥 Request Body

```json
{
  "datasetName": "FCC_Jobs",
  "groupBySegments": ["JobType"],
  "metrics": [{ "metricName": "TotalCost" }],
  "chartConfig": {
    "chartType": "pie",
    "showLegend": true
  }
}
```

### 📤 Response

```json
{
  "success": true,
  "data": {
    "success": true,
    "data": [
      { "JobType": "Installation", "TotalCost": 60200 },
      { "JobType": "Maintenance", "TotalCost": 5500 },
      { "JobType": "Repair", "TotalCost": 18800 }
    ],
    "metadata": {
      "datasetName": "FCC_Jobs",
      "totalRows": 3,
      "executionTimeMs": 1592,
      "cacheHit": false,
      "segments": ["JobType"],
      "metrics": ["TotalCost"]
    },
    "chartData": {
      "labels": ["Installation", "Maintenance", "Repair"],
      "datasets": [
        {
          "label": "TotalCost",
          "data": [60200, 5500, 18800],
          "backgroundColor": "#3b82f6",
          "borderColor": "#3b82f6"
        }
      ]
    }
  },
  "timestamp": "2025-12-09T19:28:06.055Z"
}
```

-----

## 5\. Jobs by Yard (Bar Chart)

**Descripción:** Comparativa multivariable de Trabajos y Horas Laborales por ubicación (Patio/Yard).

### 📥 Request Body

```json
{
  "datasetName": "FCC_Jobs",
  "groupBySegments": ["Yard"],
  "metrics": [
    { "metricName": "TotalJobs" },
    { "metricName": "TotalLaborHours" }
  ],
  "chartConfig": {
    "chartType": "bar",
    "xAxis": "Yard",
    "yAxis": ["TotalJobs", "TotalLaborHours"],
    "colors": ["#8b5cf6", "#ec4899"],
    "showLegend": true
  }
}
```

### 📤 Response

```json
{
  "success": true,
  "data": {
    "success": true,
    "data": [
      { "Yard": "East Yard", "TotalJobs": 4, "TotalLaborHours": 76 },
      { "Yard": "North Yard", "TotalJobs": 7, "TotalLaborHours": 68 },
      { "Yard": "South Yard", "TotalJobs": 5, "TotalLaborHours": 124 },
      { "Yard": "West Yard", "TotalJobs": 4, "TotalLaborHours": 87 }
    ],
    "metadata": {
      "datasetName": "FCC_Jobs",
      "totalRows": 4,
      "executionTimeMs": 1586,
      "cacheHit": false,
      "segments": ["Yard"],
      "metrics": ["TotalJobs", "TotalLaborHours"]
    },
    "chartData": {
      "labels": ["East Yard", "North Yard", "South Yard", "West Yard"],
      "datasets": [
        {
          "label": "TotalJobs",
          "data": [4, 7, 5, 4],
          "backgroundColor": "#8b5cf6",
          "borderColor": "#8b5cf6"
        },
        {
          "label": "TotalLaborHours",
          "data": [76, 68, 124, 87],
          "backgroundColor": "#ec4899",
          "borderColor": "#ec4899"
        }
      ]
    }
  },
  "timestamp": "2025-12-09T19:29:05.428Z"
}
```