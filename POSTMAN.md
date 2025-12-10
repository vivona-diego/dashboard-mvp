# Documentation - FCC Jobs API Analytics

Esta colección de Postman demuestra el flujo completo para una API de analítica de datos (BI). Permite configurar fuentes de datos, definir datasets y ejecutar consultas complejas para obtener tablas, gráficos y KPIs.

**Base URL:** `{{baseUrl}}` (Default: `env.BASE_URL`)

---

## 1. Setup - Segments
Definición de las dimensiones (segmentos) utilizadas para agrupar y filtrar datos.

### 1.1 Create Segment: Customer
* **Method:** `POST`
* **URL:** `{{baseUrl}}/bi/segments`
* **Body:**
  ```json
  {
    "segmentName": "Customer",
    "segmentType": "string",
    "description": "Customer name",
    "category": "Entity",
    "isFilterable": true,
    "isGroupable": true
  }


### 1.2 Create Segment: Yard

  * **Method:** `POST`
  * **URL:** `{{baseUrl}}/bi/segments`
  * **Body:**
    ```json
    {
      "segmentName": "Yard",
      "segmentType": "string",
      "description": "Yard location",
      "category": "Location",
      "isFilterable": true,
      "isGroupable": true
    }
    ```

### 1.3 Create Segment: Month

  * **Method:** `POST`
  * **URL:** `{{baseUrl}}/bi/segments`
  * **Body:**
    ```json
    {
      "segmentName": "Month",
      "segmentType": "number",
      "description": "Month number (1-12)",
      "category": "Time",
      "isFilterable": true,
      "isGroupable": true
    }
    ```

### 1.4 Create Segment: Year

  * **Method:** `POST`
  * **URL:** `{{baseUrl}}/bi/segments`
  * **Body:**
    ```json
    {
      "segmentName": "Year",
      "segmentType": "number",
      "description": "Year",
      "category": "Time",
      "isFilterable": true,
      "isGroupable": true
    }
    ```

### 1.5 Create Segment: JobType

  * **Method:** `POST`
  * **URL:** `{{baseUrl}}/bi/segments`
  * **Body:**
    ```json
    {
      "segmentName": "JobType",
      "segmentType": "string",
      "description": "Type of job",
      "category": "Entity",
      "isFilterable": true,
      "isGroupable": true
    }
    ```

### 1.6 Create Segment: Status

  * **Method:** `POST`
  * **URL:** `{{baseUrl}}/bi/segments`
  * **Body:**
    ```json
    {
      "segmentName": "Status",
      "segmentType": "string",
      "description": "Job status",
      "category": "Entity",
      "isFilterable": true,
      "isGroupable": true
    }
    ```

-----

## 2\. Setup - DataSource

Configuración de la conexión a la base de datos física.

### 2.1 Create DataSource: FCC

Registra los credenciales de conexión.

  * **Method:** `POST`
  * **URL:** `{{baseUrl}}/bi/datasources`
  * **Body:**
    ```json
    {
      "name": "FCC",
      "description": "FCC Database (Demo Mode)",
      "host": "demo-host",
      "database": "demo-db",
      "username": "demo",
      "password": "demo"
    }
    ```

### 2.2 Test Connection: FCC

Verifica la conectividad con la fuente de datos.

  * **Method:** `POST`
  * **URL:** `{{baseUrl}}/bi/datasources/FCC/test`

### 2.3 List All DataSources

Lista todas las conexiones disponibles.

  * **Method:** `GET`
  * **URL:** `{{baseUrl}}/bi/datasources`

-----

## 3\. Setup - Dataset FCC\_Jobs

Crea la capa lógica que mapea la consulta SQL a los Segmentos y Métricas definidos.

### 3.1 Create Dataset: FCC\_Jobs

  * **Method:** `POST`
  * **URL:** `{{baseUrl}}/bi/datasets`
  * **Body:**
    ```json
    {
      "name": "FCC_Jobs",
      "description": "Jobs data from FCC database",
      "sourceConnectionName": "FCC",
      "baseSQL": "SELECT * FROM Jobs WHERE IsDeleted = 0",
      "baseSQLType": "query",
      "segments": [
        {"segmentName": "Customer", "columnName": "CustomerName"},
        {"segmentName": "Yard", "columnName": "YardName"},
        {"segmentName": "Month", "columnName": "JobMonth"},
        {"segmentName": "Year", "columnName": "JobYear"},
        {"segmentName": "JobType", "columnName": "JobTypeName"},
        {"segmentName": "Status", "columnName": "StatusName"}
      ],
      "metrics": [
        {"metricName": "TotalJobs", "columnName": "JobID", "aggregationType": "COUNT", "displayFormat": "number"},
        {"metricName": "TotalCost", "columnName": "TotalCost", "aggregationType": "SUM", "displayFormat": "currency", "prefix": "$"},
        {"metricName": "TotalLaborHours", "columnName": "LaborHours", "aggregationType": "SUM", "displayFormat": "number", "suffix": " hrs"},
        {"metricName": "TotalMaterialCost", "columnName": "MaterialCost", "aggregationType": "SUM", "displayFormat": "currency", "prefix": "$"},
        {"metricName": "TotalLaborCost", "columnName": "LaborCost", "aggregationType": "SUM", "displayFormat": "currency", "prefix": "$"},
        {"metricName": "AvgJobCost", "columnName": "TotalCost", "aggregationType": "AVG", "displayFormat": "currency", "prefix": "$"}
      ]
    }
    ```

### 3.2 Get Dataset Details

  * **Method:** `GET`
  * **URL:** `{{baseUrl}}/bi/datasets/FCC_Jobs`

### 3.3 List All Datasets

  * **Method:** `GET`
  * **URL:** `{{baseUrl}}/bi/datasets`

-----

## 4\. Queries - Basic

Consultas analíticas básicas agrupando por un solo segmento.

### 4.1 Query: Total Cost by Customer

  * **Method:** `POST`
  * **URL:** `{{baseUrl}}/bi/query`
  * **Body:**
    ```json
    {
      "datasetName": "FCC_Jobs",
      "groupBySegments": ["Customer"],
      "metrics": [
        {"metricName": "TotalCost"},
        {"metricName": "TotalJobs"}
      ],
      "orderBy": [{"field": "TotalCost", "direction": "DESC"}]
    }
    ```

### 4.2 Query: Jobs by Yard

  * **Method:** `POST`
  * **URL:** `{{baseUrl}}/bi/query`
  * **Body:**
    ```json
    {
      "datasetName": "FCC_Jobs",
      "groupBySegments": ["Yard"],
      "metrics": [
        {"metricName": "TotalJobs"},
        {"metricName": "TotalLaborHours"}
      ],
      "orderBy": [{"field": "TotalJobs", "direction": "DESC"}]
    }
    ```

### 4.3 Query: Cost by Month

  * **Method:** `POST`
  * **URL:** `{{baseUrl}}/bi/query`
  * **Body:**
    ```json
    {
      "datasetName": "FCC_Jobs",
      "groupBySegments": ["Month"],
      "metrics": [
        {"metricName": "TotalCost"},
        {"metricName": "TotalJobs"}
      ],
      "orderBy": [{"field": "Month", "direction": "ASC"}]
    }
    ```

### 4.4 Query: Jobs by JobType

  * **Method:** `POST`
  * **URL:** `{{baseUrl}}/bi/query`
  * **Body:**
    ```json
    {
      "datasetName": "FCC_Jobs",
      "groupBySegments": ["JobType"],
      "metrics": [
        {"metricName": "TotalJobs"},
        {"metricName": "AvgJobCost"}
      ]
    }
    ```

### 4.5 Query: Jobs by Status

  * **Method:** `POST`
  * **URL:** `{{baseUrl}}/bi/query`
  * **Body:**
    ```json
    {
      "datasetName": "FCC_Jobs",
      "groupBySegments": ["Status"],
      "metrics": [
        {"metricName": "TotalJobs"},
        {"metricName": "TotalCost"}
      ]
    }
    ```

-----

## 5\. Queries - Multi-Segment

Consultas con agrupación anidada (Drill-down).

### 5.1 Query: Customer + Month

  * **Method:** `POST`
  * **URL:** `{{baseUrl}}/bi/query`
  * **Body:**
    ```json
    {
      "datasetName": "FCC_Jobs",
      "groupBySegments": ["Customer", "Month"],
      "metrics": [{"metricName": "TotalCost"}],
      "orderBy": [
        {"field": "Customer", "direction": "ASC"},
        {"field": "Month", "direction": "ASC"}
      ]
    }
    ```

### 5.2 Query: Yard + JobType

  * **Method:** `POST`
  * **URL:** `{{baseUrl}}/bi/query`
  * **Body:**
    ```json
    {
      "datasetName": "FCC_Jobs",
      "groupBySegments": ["Yard", "JobType"],
      "metrics": [
        {"metricName": "TotalJobs"},
        {"metricName": "TotalLaborHours"}
      ],
      "orderBy": [{"field": "TotalJobs", "direction": "DESC"}]
    }
    ```

### 5.3 Query: Customer + Yard

  * **Method:** `POST`
  * **URL:** `{{baseUrl}}/bi/query`
  * **Body:**
    ```json
    {
      "datasetName": "FCC_Jobs",
      "groupBySegments": ["Customer", "Yard"],
      "metrics": [
        {"metricName": "TotalCost"},
        {"metricName": "TotalJobs"}
      ],
      "orderBy": [{"field": "TotalCost", "direction": "DESC"}]
    }
    ```

-----

## 6\. Queries - With Filters

Uso de operadores lógicos para filtrar datos.

### 6.1 Filter: Specific Customers (IN)

  * **Method:** `POST`
  * **URL:** `{{baseUrl}}/bi/query`
  * **Body:**
    ```json
    {
      "datasetName": "FCC_Jobs",
      "groupBySegments": ["Customer", "Month"],
      "metrics": [{"metricName": "TotalCost"}],
      "filters": [
        {
          "segmentName": "Customer",
          "operator": "in",
          "value": ["Acme Corp", "Tech Industries"]
        }
      ],
      "orderBy": [{"field": "Month", "direction": "ASC"}]
    }
    ```

### 6.2 Filter: Completed Jobs Only (EQ)

  * **Method:** `POST`
  * **URL:** `{{baseUrl}}/bi/query`
  * **Body:**
    ```json
    {
      "datasetName": "FCC_Jobs",
      "groupBySegments": ["Customer"],
      "metrics": [{"metricName": "TotalJobs"}, {"metricName": "TotalCost"}],
      "filters": [
        {
          "segmentName": "Status",
          "operator": "eq",
          "value": "Completed"
        }
      ],
      "orderBy": [{"field": "TotalCost", "direction": "DESC"}]
    }
    ```

### 6.3 Filter: Exclude Cancelled (NEQ)

  * **Method:** `POST`
  * **URL:** `{{baseUrl}}/bi/query`
  * **Body:**
    ```json
    {
      "datasetName": "FCC_Jobs",
      "groupBySegments": ["Status"],
      "metrics": [{"metricName": "TotalJobs"}],
      "filters": [
        {
          "segmentName": "Status",
          "operator": "neq",
          "value": "Cancelled"
        }
      ]
    }
    ```

### 6.4 Filter: Months 1-6 (BETWEEN)

  * **Method:** `POST`
  * **URL:** `{{baseUrl}}/bi/query`
  * **Body:**
    ```json
    {
      "datasetName": "FCC_Jobs",
      "groupBySegments": ["Month"],
      "metrics": [{"metricName": "TotalCost"}, {"metricName": "TotalJobs"}],
      "filters": [
        {
          "segmentName": "Month",
          "operator": "between",
          "value": 1,
          "secondValue": 6
        }
      ],
      "orderBy": [{"field": "Month", "direction": "ASC"}]
    }
    ```

### 6.5 Filter: JobType = Maintenance

  * **Method:** `POST`
  * **URL:** `{{baseUrl}}/bi/query`
  * **Body:**
    ```json
    {
      "datasetName": "FCC_Jobs",
      "groupBySegments": ["Customer"],
      "metrics": [{"metricName": "TotalJobs"}, {"metricName": "TotalLaborHours"}],
      "filters": [
        {
          "segmentName": "JobType",
          "operator": "eq",
          "value": "Maintenance"
        }
      ],
      "orderBy": [{"field": "TotalJobs", "direction": "DESC"}]
    }
    ```

### 6.6 Filter: Multiple Conditions

  * **Method:** `POST`
  * **URL:** `{{baseUrl}}/bi/query`
  * **Body:**
    ```json
    {
      "datasetName": "FCC_Jobs",
      "groupBySegments": ["Customer"],
      "metrics": [{"metricName": "TotalCost"}],
      "filters": [
        {"segmentName": "Status", "operator": "eq", "value": "Completed"},
        {"segmentName": "JobType", "operator": "in", "value": ["Repair", "Maintenance"]},
        {"segmentName": "Month", "operator": "gte", "value": 3}
      ],
      "orderBy": [{"field": "TotalCost", "direction": "DESC"}]
    }
    ```

-----

## 7\. Charts

Endpoints que retornan `chartConfig` para visualización en frontend.

### 7.1 Chart: Bar - Cost by Customer

  * **Method:** `POST`
  * **URL:** `{{baseUrl}}/bi/chart`
  * **Body:**
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

### 7.2 Chart: Line - Monthly Trend

  * **Method:** `POST`
  * **URL:** `{{baseUrl}}/bi/chart`
  * **Body:**
    ```json
    {
      "datasetName": "FCC_Jobs",
      "groupBySegments": ["Month"],
      "metrics": [{"metricName": "TotalCost"}, {"metricName": "TotalJobs"}],
      "orderBy": [{"field": "Month", "direction": "ASC"}],
      "chartConfig": {
        "chartType": "line",
        "xAxis": "Month",
        "yAxis": ["TotalCost", "TotalJobs"],
        "colors": ["#10b981", "#f59e0b"],
        "showLegend": true
      }
    }
    ```

### 7.3 Chart: Pie - Jobs by Status

  * **Method:** `POST`
  * **URL:** `{{baseUrl}}/bi/chart`
  * **Body:**
    ```json
    {
      "datasetName": "FCC_Jobs",
      "groupBySegments": ["Status"],
      "metrics": [{"metricName": "TotalJobs"}],
      "chartConfig": {
        "chartType": "pie",
        "showLegend": true
      }
    }
    ```

### 7.4 Chart: Pie - Cost by JobType

  * **Method:** `POST`
  * **URL:** `{{baseUrl}}/bi/chart`
  * **Body:**
    ```json
    {
      "datasetName": "FCC_Jobs",
      "groupBySegments": ["JobType"],
      "metrics": [{"metricName": "TotalCost"}],
      "chartConfig": {
        "chartType": "pie",
        "showLegend": true
      }
    }
    ```

### 7.5 Chart: Bar - Jobs by Yard

  * **Method:** `POST`
  * **URL:** `{{baseUrl}}/bi/chart`
  * **Body:**
    ```json
    {
      "datasetName": "FCC_Jobs",
      "groupBySegments": ["Yard"],
      "metrics": [{"metricName": "TotalJobs"}, {"metricName": "TotalLaborHours"}],
      "chartConfig": {
        "chartType": "bar",
        "xAxis": "Yard",
        "yAxis": ["TotalJobs", "TotalLaborHours"],
        "colors": ["#8b5cf6", "#ec4899"],
        "showLegend": true
      }
    }
    ```

-----

## 8\. KPIs

Indicadores de alto nivel (Valores únicos).

### 8.1 KPIs: All Main Metrics

  * **Method:** `POST`
  * **URL:** `{{baseUrl}}/bi/kpis`
  * **Body:**
    ```json
    {
      "datasetName": "FCC_Jobs",
      "metrics": [
        {"metricName": "TotalJobs"},
        {"metricName": "TotalCost"},
        {"metricName": "TotalLaborHours"},
        {"metricName": "AvgJobCost"}
      ]
    }
    ```

### 8.2 KPIs: Completed Jobs Only

  * **Method:** `POST`
  * **URL:** `{{baseUrl}}/bi/kpis`
  * **Body:**
    ```json
    {
      "datasetName": "FCC_Jobs",
      "metrics": [{"metricName": "TotalJobs"}, {"metricName": "TotalCost"}],
      "filters": [
        {"segmentName": "Status", "operator": "eq", "value": "Completed"}
      ]
    }
    ```

### 8.3 KPIs: Maintenance Jobs

  * **Method:** `POST`
  * **URL:** `{{baseUrl}}/bi/kpis`
  * **Body:**
    ```json
    {
      "datasetName": "FCC_Jobs",
      "metrics": [
        {"metricName": "TotalJobs"},
        {"metricName": "TotalLaborHours"},
        {"metricName": "AvgJobCost"}
      ],
      "filters": [
        {"segmentName": "JobType", "operator": "eq", "value": "Maintenance"}
      ]
    }
    ```

-----

## 9\. Segment Values

Listas de valores para dropdowns y filtros de UI.

### 9.1 Get Customer Values

  * **Method:** `GET`
  * **URL:** `{{baseUrl}}/bi/segment-values?datasetName=FCC_Jobs&segmentName=Customer&includeCount=true`

### 9.2 Get Yard Values

  * **Method:** `GET`
  * **URL:** `{{baseUrl}}/bi/segment-values?datasetName=FCC_Jobs&segmentName=Yard&includeCount=true`

### 9.3 Get JobType Values

  * **Method:** `GET`
  * **URL:** `{{baseUrl}}/bi/segment-values?datasetName=FCC_Jobs&segmentName=JobType&includeCount=true`

### 9.4 Get Status Values

  * **Method:** `GET`
  * **URL:** `{{baseUrl}}/bi/segment-values?datasetName=FCC_Jobs&segmentName=Status&includeCount=true`

-----

## 10\. Cache Management

Administración de la memoria caché.

### 10.1 Invalidate FCC\_Jobs Cache

  * **Method:** `POST`
  * **URL:** `{{baseUrl}}/bi/cache/invalidate`
  * **Body:**
    ```json
    {
      "datasetName": "FCC_Jobs"
    }
    ```

### 10.2 Cleanup Expired Cache

  * **Method:** `POST`
  * **URL:** `{{baseUrl}}/bi/cache/cleanup`

-----

## 11\. Cleanup (Optional)

Eliminación de datos de prueba.

### 11.1 Delete Dataset: FCC\_Jobs

  * **Method:** `DELETE`
  * **URL:** `{{baseUrl}}/bi/datasets/FCC_Jobs`

### 11.2 Delete DataSource: FCC

  * **Method:** `DELETE`
  * **URL:** `{{baseUrl}}/bi/datasources/FCC`

<!-- end list -->

```
```