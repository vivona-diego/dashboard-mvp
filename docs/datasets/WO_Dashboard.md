# Dataset: WO_Dashboard
Work Order Dashboard - Status, Priority, Costs by Unit, Company, Yard

## SQL Base
```sql
SELECT wo.WoCode AS WorkOrderNumber, ws.Description AS WOStatus, wp.Description AS WOPriority, wr.Reason AS WOReason, u.UnitCode, ut.Description AS UnitType, c.Name AS Company, ym.YardName AS Yard, cust.Name1 AS Customer, wo.DateIssued AS WODate, dd.Year, dd.MonthName AS Month, dd.Month AS MonthNumber, ISNULL(labor.TotalLaborHours, 0) AS LaborHours, ISNULL(labor.TotalLaborCost, 0) AS LaborCost, ISNULL(mat.TotalMaterialCost, 0) AS MaterialCost, ISNULL(labor.TotalLaborCost, 0) + ISNULL(mat.TotalMaterialCost, 0) AS TotalWOCost, ISNULL(emp.EmployeeCount, 0) AS EmployeeCount FROM FMS_WORKORDER_MASTER wo INNER JOIN FMS_UNITS u ON wo.UnitCode = u.UnitCode LEFT JOIN FMS_WORKORDER_STATUS ws ON wo.WorkStatus = ws.WoStatusCode LEFT JOIN FMS_WORKORDER_PRIORITY wp ON wo.PriorityID = wp.WoPriorityID LEFT JOIN FMS_WORKORDER_REASON wr ON wo.WoReasonID = wr.WoReasonID LEFT JOIN FMS_UNIT_TYPES ut ON u.UnitTypeID = ut.UnitTypeID LEFT JOIN FMS_COMPANIES c ON wo.CompanyCode = c.CompanyCode LEFT JOIN FMS_YARD_MASTER ym ON wo.YardCode = ym.YardCode LEFT JOIN FMS_CUSTOMERS cust ON wo.CustCode = cust.CustCode LEFT JOIN FMS_DATE_DIMENSION dd ON CAST(wo.DateIssued AS DATE) = dd.Date LEFT JOIN (SELECT WoCode, SUM(WorkedHrs) AS TotalLaborHours, SUM(Amount) AS TotalLaborCost FROM FMS_LABOR_DETAILS GROUP BY WoCode) labor ON wo.WoCode = labor.WoCode LEFT JOIN (SELECT WoCode, SUM(Amount) AS TotalMaterialCost FROM FMS_MAT_TRANS GROUP BY WoCode) mat ON wo.WoCode = mat.WoCode LEFT JOIN (SELECT WoCode, COUNT(DISTINCT EmpID) AS EmployeeCount FROM FMS_WORKORDER_EMPLOYEE GROUP BY WoCode) emp ON wo.WoCode = emp.WoCode
```

## Segments
- WOStatus
- WOPriority
- WOReason
- UnitCode
- UnitType
- Company
- Yard
- Customer
- Year
- Month
- WorkOrderNumber

## Metrics
- LaborHours
- LaborCost
- MaterialCost
- TotalWOCost
- EmployeeCount
- WOCount
