
export interface DatasetMetadata {
  datasetId: string;
  name: string;
  segments: string[];
  metrics: string[];
  dateSegment?: string;
}

export const DATASETS_METADATA: Record<string, DatasetMetadata> = {
  // 1. Jobs_By_Status
  Jobs_By_Status: {
    datasetId: 'A4AF1754-0F38-F111-8F4F-7C1E528962B1',
    name: 'Jobs By Status',
    segments: ['SalesPerson', 'Status', 'Customer', 'CustomerLocation', 'Yard', 'JobStartDate', 'JobEndDate', 'CreatedDate'],
    metrics: ['JobCount', 'UniqueCustomers', 'UniqueSalesPeople'],
    dateSegment: 'CreatedDate',
  },
  // 2. jobs_profit_by_invoice
  jobs_profit_by_invoice: {
    datasetId: 'B0AF1754-0F38-F111-8F4F-7C1E528962B1',
    name: 'Jobs Profit by Invoice',
    segments: ['JobCode', 'JobStatus', 'Yard', 'Department', 'Customer', 'Company', 'SalesPerson', 'State', 'Location', 'JobStartDate', 'JobEndDate'],
    metrics: ['Revenue', 'LaborExpense', 'MaterialExpense', 'LaborBurden', 'MaterialOverhead', 'Overhead', 'EquipmentExpense', 'WoExpenses', 'LaborHours', 'NetProfit', 'JobCount'],
    dateSegment: 'JobStartDate',
  },
  // 3. jobs_profit_loss
  jobs_profit_loss: {
    datasetId: 'C8AF1754-0F38-F111-8F4F-7C1E528962B1',
    name: 'Jobs Profit Loss',
    segments: ['Yard', 'SalesPerson', 'Customer', 'CustomerState', 'JobStatus', 'JobCode', 'Company', 'Region', 'JobYear', 'JobMonth', 'JobQuarter', 'JobStartDate'],
    metrics: ['JobRevenue', 'LaborHours', 'LaborExpenses', 'LaborBurden', 'LaborWC', 'LaborUnion', 'MaterialsExpenses', 'MaterialsBurden', 'Profit', 'JobCount'],
    dateSegment: 'JobStartDate',
  },
  // 4. Quotes_By_Status
  Quotes_By_Status: {
    datasetId: 'F2AF1754-0F38-F111-8F4F-7C1E528962B1',
    name: 'Quotes By Status',
    segments: ['Customer', 'CustomerLocation', 'SalesPerson', 'QuoteStatus', 'State', 'Yard', 'JobStartDate', 'JobEndDate'],
    metrics: ['QuoteCount', 'UniqueCustomers', 'UniqueSalesPeople', 'UniqueYards'],
    dateSegment: 'JobStartDate',
  },
  // 5. quote_profit_forecast
  quote_profit_forecast: {
    datasetId: 'D2071A5A-0F38-F111-8F4F-7C1E528962B1',
    name: 'Quote Profit Forecast',
    segments: ['QuoteNumber', 'BillingCode', 'BillingDescription', 'Measure', 'Item', 'CreatedDate', 'CreatedBy', 'Yard', 'SalesPerson'],
    metrics: ['Revenue', 'TotalExpense', 'LaborExpense', 'MaterialExpense', 'EquipmentExpense', 'IndirectExpense', 'DirectExpense', 'Quantity', 'QuoteCount', 'LineCount'],
    dateSegment: 'CreatedDate',
  },
  // 6. Preventive_Maintenance
  Preventive_Maintenance: {
    datasetId: 'FC071A5A-0F38-F111-8F4F-7C1E528962B1',
    name: 'Preventive Maintenance',
    segments: ['UnitCode', 'UnitType', 'Company', 'Yard', 'Activity', 'ScheduleType', 'DueStatus', 'Year', 'Month'],
    metrics: ['TotalActivities', 'PastDueCount', 'ComingDueCount', 'UnitCount'],
    dateSegment: 'Year',
  },
  // 7. WO_Dashboard
  WO_Dashboard: {
    datasetId: '0A081A5A-0F38-F111-8F4F-7C1E528962B1',
    name: 'WO Dashboard',
    segments: ['WOStatus', 'WOPriority', 'WOReason', 'UnitCode', 'UnitType', 'Company', 'Yard', 'Customer', 'Year', 'Month', 'WorkOrderNumber'],
    metrics: ['LaborHours', 'LaborCost', 'MaterialCost', 'TotalWOCost', 'EmployeeCount', 'WOCount'],
    dateSegment: 'Year',
  },
  // 8. Job_Revenue_Forecast
  Job_Revenue_Forecast: {
    datasetId: 'D2E2880D-2838-F111-8F4F-7C1E528962B1',
    name: 'Job Revenue Forecast',
    segments: ['Year', 'Month', 'Company', 'Yard', 'Customer', 'SalesPerson', 'JobSite', 'JobStartDate', 'JobEndDate', 'ForecastDate'],
    metrics: ['ActualRevenue', 'EstimatedRevenue', 'Variance', 'ActualHours', 'EstimatedHours', 'JobCount'],
    dateSegment: 'Year',
  },
  // 9. Equipment
  Equipment: {
    datasetId: 'E44E809B-3038-F111-8F4F-7C1E528962B1',
    name: 'Equipment',
    segments: ['UnitCode', 'UnitType', 'Company', 'Yard', 'Year', 'Month'],
    metrics: ['TargetHours', 'DowntimeDays', 'DowntimeHours', 'AvailableHours', 'AvgUtilization', 'UnitCount'],
    dateSegment: 'Year',
  },
  // 10. Quote_Revenue_Forecast
  Quote_Revenue_Forecast: {
    datasetId: '785A81B9-C638-F111-8F4F-7C1E528962B1',
    name: 'Quote Revenue Forecast',
    segments: ['Month', 'Year', 'QuoteDate', 'Yard', 'SalesPerson', 'QuoteNumber'],
    metrics: ['QuoteAmount', 'QuoteHours', 'QuoteCount', 'AvgQuoteAmount'],
    dateSegment: 'Year',
  },
};
