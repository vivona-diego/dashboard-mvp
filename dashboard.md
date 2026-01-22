# Jobs P/L Dashboard - Mapeo de Componentes a API Calls

**Base URL:** `https://analyticapi.fleetcostcare.com`  
**Dataset:** `jobs_profit_loss`

---

## 📊 TAB 1: Jobs P/L Summary

### Imagen de referencia del dashboard:
```
┌─────────────────────────────────────────────────────────────────────────────┐
│  Jobs P/L Dashboard                              │ Yard: [All ▼]           │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐               │
│  │  $43M   │ │  $36M   │ │   $6M   │ │  185K   │ │ 14.48%  │  Date Range   │
│  │Job Rev  │ │Tot Exp  │ │ Profit  │ │Lab Hrs  │ │Profit % │  1/1/2019     │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘  1/31/2023    │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌────────────────────────┐ ┌────────────┐ ┌───────────────────────────┐   │
│  │ Bar Chart              │ │ Pie Chart  │ │ Table: Salesperson        │   │
│  │ Revenue/Expenses/Profit│ │ Profit %   │ │ Revenue|Expenses|Profit   │   │
│  │ by Month               │ │ by Sales   │ │                           │   │
│  └────────────────────────┘ └────────────┘ └───────────────────────────┘   │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌────────────────────────────┐ ┌───────────────────────────────────────┐  │
│  │ Top 10 Customers by Profit │ │ Table: Customer Performance           │  │
│  │ (Horizontal Bar Chart)     │ │ Customer|Revenue|Expenses|Profit|%    │  │
│  └────────────────────────────┘ └───────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 1️⃣ KPI CARDS (5 Tarjetas Superiores)

**Componentes:** Job Revenue ($43M), Total Expenses ($36M), Profit ($6M), Labor Hours (185K), Profit % (14.48%)

### API Call:
```
POST /bi/kpis
Content-Type: application/json

{
  "datasetName": "jobs_profit_loss",
  "metrics": [
    {"metricName": "JobRevenue"},
    {"metricName": "TotalExpenses"},
    {"metricName": "Profit"},
    {"metricName": "LaborHours"},
    {"metricName": "JobCount"}
  ]
}
```

### Con filtros aplicados (Yard + Date Range):
```
POST /bi/kpis
Content-Type: application/json

{
  "datasetName": "jobs_profit_loss",
  "metrics": [
    {"metricName": "JobRevenue"},
    {"metricName": "TotalExpenses"},
    {"metricName": "Profit"},
    {"metricName": "LaborHours"},
    {"metricName": "JobCount"}
  ],
  "filters": [
    {"segmentName": "JobStartDate", "operator": "between", "value": "2019-01-01", "secondValue": "2023-01-31"},
    {"segmentName": "Yard", "operator": "eq", "value": "DWS Main Office"}
  ]
}
```

**Nota:** El Profit % se calcula en el front: `(Profit / JobRevenue) * 100`

---

## 2️⃣ FILTROS (Sidebar Derecho)

### Dropdown: Yard
```
GET /bi/segment-values?datasetName=jobs_profit_loss&segmentName=Yard&limit=100
```

### Dropdown: Region (mencionado en el video como requerimiento)
```
GET /bi/segment-values?datasetName=jobs_profit_loss&segmentName=Region&limit=100
```

### Date Range
El date picker es un componente del front. Al cambiar las fechas, se debe agregar el filtro:
```json
{"segmentName": "JobStartDate", "operator": "between", "value": "2019-01-01", "secondValue": "2023-01-31"}
```

---

## 3️⃣ GRÁFICO DE BARRAS - Revenue, Expenses, Profit by Month

**Ubicación:** Panel izquierdo, muestra barras agrupadas por mes

### API Call:
```
POST /bi/query
Content-Type: application/json

{
  "datasetName": "jobs_profit_loss",
  "groupBySegments": ["JobYear", "JobMonth"],
  "metrics": [
    {"metricName": "JobRevenue"},
    {"metricName": "TotalExpenses"},
    {"metricName": "Profit"}
  ],
  "filters": [
    {"segmentName": "JobStartDate", "operator": "between", "value": "2019-01-01", "secondValue": "2023-01-31"}
  ],
  "orderBy": [
    {"field": "JobYear", "direction": "ASC"},
    {"field": "JobMonth", "direction": "ASC"}
  ],
  "limit": 60
}
```

**Response esperado:**
```json
{
  "data": [
    {"JobYear": 2019, "JobMonth": 1, "JobRevenue": 3500000, "TotalExpenses": 2800000, "Profit": 700000},
    {"JobYear": 2019, "JobMonth": 2, "JobRevenue": 4100000, "TotalExpenses": 3200000, "Profit": 900000}
  ]
}
```

---

## 4️⃣ PIE CHART - Profit % by Salesperson

**Ubicación:** Centro del dashboard, muestra distribución de profit por vendedor

### API Call:
```
POST /bi/query
Content-Type: application/json

{
  "datasetName": "jobs_profit_loss",
  "groupBySegments": ["SalesPerson"],
  "metrics": [
    {"metricName": "Profit"}
  ],
  "filters": [
    {"segmentName": "JobStartDate", "operator": "between", "value": "2019-01-01", "secondValue": "2023-01-31"}
  ],
  "orderBy": [
    {"field": "Profit", "direction": "DESC"}
  ],
  "limit": 10
}
```

**Response esperado:**
```json
{
  "data": [
    {"SalesPerson": "Cole,Adam", "Profit": 327242},
    {"SalesPerson": "McWillie,Matt", "Profit": 245000},
    {"SalesPerson": "Harris,LS", "Profit": 180000}
  ]
}
```

---

## 5️⃣ TABLA SALESPERSON (al lado del pie chart)

**Ubicación:** Derecha del pie chart
**Columnas:** Salesperson, Job Revenue, Total Expenses, Profit, Profit %

### API Call:
```
POST /bi/query
Content-Type: application/json

{
  "datasetName": "jobs_profit_loss",
  "groupBySegments": ["SalesPerson"],
  "metrics": [
    {"metricName": "JobRevenue"},
    {"metricName": "TotalExpenses"},
    {"metricName": "Profit"}
  ],
  "filters": [
    {"segmentName": "JobStartDate", "operator": "between", "value": "2019-01-01", "secondValue": "2023-01-31"}
  ],
  "orderBy": [
    {"field": "JobRevenue", "direction": "DESC"}
  ],
  "limit": 50
}
```

**Response esperado:**
```json
{
  "data": [
    {"SalesPerson": "Cole,Adam", "JobRevenue": 2832980, "TotalExpenses": 2505748, "Profit": 327242},
    {"SalesPerson": "Curran,Jeff", "JobRevenue": 80152, "TotalExpenses": 86122, "Profit": -5970}
  ]
}
```

**Nota:** Profit % se calcula en el front: `(Profit / JobRevenue) * 100`

---

## 6️⃣ TOP 10 CUSTOMERS BY PROFIT (Gráfico de barras horizontal)

**Ubicación:** Parte inferior izquierda

### API Call:
```
POST /bi/query
Content-Type: application/json

{
  "datasetName": "jobs_profit_loss",
  "groupBySegments": ["Customer"],
  "metrics": [
    {"metricName": "Profit"}
  ],
  "filters": [
    {"segmentName": "JobStartDate", "operator": "between", "value": "2019-01-01", "secondValue": "2023-01-31"}
  ],
  "orderBy": [
    {"field": "Profit", "direction": "DESC"}
  ],
  "limit": 10
}
```

**Response esperado:**
```json
{
  "data": [
    {"Customer": "AK STEEL CORPORATION", "Profit": 526481},
    {"Customer": "HURON VALLEY STEEL COMPANY", "Profit": 420000},
    {"Customer": "SES COKE BATTERY LLC", "Profit": 380000}
  ]
}
```

---

## 7️⃣ TABLA CUSTOMER (Parte inferior derecha)

**Ubicación:** Derecha del gráfico Top 10 Customers
**Columnas:** Customer, Job Revenue, Total Expenses, Profit, Profit %

### API Call:
```
POST /bi/query
Content-Type: application/json

{
  "datasetName": "jobs_profit_loss",
  "groupBySegments": ["Customer"],
  "metrics": [
    {"metricName": "JobRevenue"},
    {"metricName": "TotalExpenses"},
    {"metricName": "Profit"}
  ],
  "filters": [
    {"segmentName": "JobStartDate", "operator": "between", "value": "2019-01-01", "secondValue": "2023-01-31"}
  ],
  "orderBy": [
    {"field": "Profit", "direction": "DESC"}
  ],
  "limit": 100
}
```

---

## 📊 TAB 2: Jobs P/L Detail (Drill Down)

**Funcionalidad:** Al hacer click en una fila de Salesperson o Customer, mostrar los jobs individuales

### Drilldown por Salesperson seleccionado:
```
POST /bi/drilldown
Content-Type: application/json

{
  "datasetName": "jobs_profit_loss",
  "filters": [
    {"segmentName": "SalesPerson", "operator": "eq", "value": "Cole,Adam"},
    {"segmentName": "JobStartDate", "operator": "between", "value": "2019-01-01", "secondValue": "2023-01-31"}
  ],
  "columns": ["JobCode", "CustomerName", "Yard", "JobStartDate", "JobStatus", "JobRevenue", "TotalExpenses", "Profit", "LaborHours"],
  "orderBy": [
    {"field": "JobStartDate", "direction": "DESC"}
  ],
  "limit": 100
}
```

### Drilldown por Customer seleccionado:
```
POST /bi/drilldown
Content-Type: application/json

{
  "datasetName": "jobs_profit_loss",
  "filters": [
    {"segmentName": "Customer", "operator": "eq", "value": "AK STEEL CORPORATION"},
    {"segmentName": "JobStartDate", "operator": "between", "value": "2019-01-01", "secondValue": "2023-01-31"}
  ],
  "columns": ["JobCode", "SalespersonName", "Yard", "JobStartDate", "JobStatus", "JobRevenue", "TotalExpenses", "Profit"],
  "orderBy": [
    {"field": "JobStartDate", "direction": "DESC"}
  ],
  "limit": 100
}
```

### Drilldown por Job específico:
```
POST /bi/drilldown
Content-Type: application/json

{
  "datasetName": "jobs_profit_loss",
  "filters": [
    {"segmentName": "JobCode", "operator": "eq", "value": "R-60091"}
  ],
  "limit": 1
}
```

---

## 📊 TAB 3: Revenue Forecast

### Revenue por Año
```
POST /bi/query
Content-Type: application/json

{
  "datasetName": "jobs_profit_loss",
  "groupBySegments": ["JobYear"],
  "metrics": [
    {"metricName": "JobRevenue"},
    {"metricName": "JobCount"}
  ],
  "orderBy": [
    {"field": "JobYear", "direction": "DESC"}
  ],
  "limit": 10
}
```

### Revenue por Salesperson por Año
```
POST /bi/query
Content-Type: application/json

{
  "datasetName": "jobs_profit_loss",
  "groupBySegments": ["SalesPerson", "JobYear"],
  "metrics": [
    {"metricName": "JobRevenue"}
  ],
  "filters": [
    {"segmentName": "JobYear", "operator": "gte", "value": 2020}
  ],
  "orderBy": [
    {"field": "JobYear", "direction": "DESC"},
    {"field": "JobRevenue", "direction": "DESC"}
  ],
  "limit": 100
}
```

### Revenue por Salesperson por Mes (Grid detallado)
```
POST /bi/query
Content-Type: application/json

{
  "datasetName": "jobs_profit_loss",
  "groupBySegments": ["SalesPerson", "JobMonth"],
  "metrics": [
    {"metricName": "JobRevenue"}
  ],
  "filters": [
    {"segmentName": "JobYear", "operator": "eq", "value": 2025}
  ],
  "orderBy": [
    {"field": "SalesPerson", "direction": "ASC"},
    {"field": "JobMonth", "direction": "ASC"}
  ],
  "limit": 200
}
```

---

## 📊 TAB 4: Finished Jobs Only

**Mismo dashboard pero filtrado por jobs terminados (Status = C)**

### KPIs para Finished Jobs:
```
POST /bi/kpis
Content-Type: application/json

{
  "datasetName": "jobs_profit_loss",
  "metrics": [
    {"metricName": "JobRevenue"},
    {"metricName": "TotalExpenses"},
    {"metricName": "Profit"},
    {"metricName": "LaborHours"},
    {"metricName": "JobCount"}
  ],
  "filters": [
    {"segmentName": "JobStatusCode", "operator": "eq", "value": "C"},
    {"segmentName": "JobStartDate", "operator": "between", "value": "2019-01-01", "secondValue": "2023-01-31"}
  ]
}
```

---

## 🔄 Flujo de Interacción

### 1. Carga inicial del dashboard:
```
1. GET /bi/segment-values?datasetName=jobs_profit_loss&segmentName=Yard      → Llenar dropdown Yard
2. GET /bi/segment-values?datasetName=jobs_profit_loss&segmentName=Region    → Llenar dropdown Region
3. POST /bi/kpis                                                              → KPI Cards
4. POST /bi/query (groupBy: JobYear, JobMonth)                               → Bar Chart
5. POST /bi/query (groupBy: SalesPerson, metrics: Profit)                    → Pie Chart
6. POST /bi/query (groupBy: SalesPerson, all metrics)                        → Tabla Salesperson
7. POST /bi/query (groupBy: Customer, metrics: Profit, limit: 10)            → Top 10 Customers
8. POST /bi/query (groupBy: Customer, all metrics)                           → Tabla Customer
```

### 2. Usuario selecciona un Yard:
```
→ Agregar filtro: {"segmentName": "Yard", "operator": "eq", "value": "VALOR_SELECCIONADO"}
→ Re-ejecutar calls 3-8 con el nuevo filtro
```

### 3. Usuario cambia Date Range:
```
→ Actualizar filtro: {"segmentName": "JobStartDate", "operator": "between", "value": "FECHA_INICIO", "secondValue": "FECHA_FIN"}
→ Re-ejecutar calls 3-8 con el nuevo filtro
```

### 4. Usuario hace click en una fila de Salesperson:
```
→ POST /bi/drilldown con filtro de SalesPerson seleccionado
→ Mostrar modal/panel con lista de jobs
```

### 5. Usuario hace click en un Customer:
```
→ POST /bi/drilldown con filtro de Customer seleccionado
→ Mostrar modal/panel con lista de jobs
```

---

## 📝 Notas Importantes

1. **SalesPerson** - Usar con P mayúscula: `SalesPerson` (no `Salesperson`)

2. **Profit %** - Se calcula en el front: `(Profit / JobRevenue) * 100`

3. **Fechas** - Usar formato `YYYY-MM-DD`: `"2019-01-01"`

4. **Filtros acumulativos** - Los filtros se pueden combinar en un array:
```json
"filters": [
  {"segmentName": "Yard", "operator": "eq", "value": "Austin"},
  {"segmentName": "JobStartDate", "operator": "between", "value": "2019-01-01", "secondValue": "2023-01-31"},
  {"segmentName": "JobStatusCode", "operator": "eq", "value": "C"}
]
```

5. **Múltiples valores** - Usar operador `in`:
```json
{"segmentName": "Yard", "operator": "in", "value": ["Austin", "Houston", "Dallas"]}
```
