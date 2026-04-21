# Dataset: jobs_profit_loss
Jobs Profit and Loss Analysis

## SQL Base
```sql
SELECT j.JobCode, j.CompanyCode, j.YardCode, j.DeptCode, j.CustCode, j.SpersonCode, j.Status AS JobStatusCode, j.JobSdate, j.JobEdate, j.CreatedDate AS JobCreatedDate, YEAR(j.JobSdate) AS JobYear, MONTH(j.JobSdate) AS JobMonth, DATEPART(QUARTER, j.JobSdate) AS JobQuarter, y.YardName, y.RegionID, c.Name1 AS CustomerName, c.City AS CustomerCity, c.StateCode AS CustomerState, CONCAT(sp.FName, ' ' , sp.LName) AS SalespersonName, js.Description AS JobStatusDescription, COALESCE(inv.JobRevenue, 0) AS JobRevenue, COALESCE(lab.LaborHours, 0) AS LaborHours, COALESCE(lab.LaborExpenses, 0) AS LaborExpenses, COALESCE(lab.LaborBurden, 0) AS LaborBurden, COALESCE(lab.LaborWC, 0) AS LaborWC, COALESCE(lab.LaborUnion, 0) AS LaborUnion, COALESCE(mat.MaterialsExpenses, 0) AS MaterialsExpenses, COALESCE(mat.MaterialsBurden, 0) AS MaterialsBurden, COALESCE(inv.JobRevenue, 0) - (COALESCE(lab.LaborExpenses, 0) + COALESCE(lab.LaborBurden, 0) + COALESCE(lab.LaborWC, 0) + COALESCE(lab.LaborUnion, 0) + COALESCE(mat.MaterialsExpenses, 0) + COALESCE(mat.MaterialsBurden, 0)) AS Profit FROM FMS_JOB_MASTER j LEFT JOIN FMS_YARD_MASTER y ON j.YardCode = y.YardCode LEFT JOIN FMS_CUSTOMERS c ON j.CustCode = c.CustCode LEFT JOIN FMS_SALES_PERSON sp ON j.SpersonCode = sp.SpersonCode LEFT JOIN FMS_JOB_STATUS js ON j.Status = js.JobStatusCode LEFT JOIN (SELECT JobCode, SUM(COALESCE(InvoiceBeforeTax, 0)) AS JobRevenue FROM FMS_INVOICE_MASTER WHERE JobCode IS NOT NULL GROUP BY JobCode) inv ON j.JobCode = inv.JobCode LEFT JOIN (SELECT JobCode, SUM(COALESCE(WorkedHrs, 0)) AS LaborHours, SUM(COALESCE(Amount, 0)) AS LaborExpenses, SUM(COALESCE(BurdenAmt, 0)) AS LaborBurden, SUM(COALESCE(WcAmt, 0)) AS LaborWC, SUM(COALESCE(UnionAmt, 0)) AS LaborUnion FROM FMS_LABOR_DETAILS WHERE JobCode IS NOT NULL GROUP BY JobCode) lab ON j.JobCode = lab.JobCode LEFT JOIN (SELECT JobCode, SUM(COALESCE(Amount, 0)) AS MaterialsExpenses, SUM(COALESCE(BurdenAmt, 0)) AS MaterialsBurden FROM FMS_MAT_TRANS WHERE JobCode IS NOT NULL GROUP BY JobCode) mat ON j.JobCode = mat.JobCode
```

## Segments
- Yard
- SalesPerson
- Customer
- CustomerState
- JobStatus
- JobCode
- Company
- Region
- JobYear
- JobMonth
- JobQuarter
- JobStartDate

## Metrics
- JobRevenue
- LaborHours
- LaborExpenses
- LaborBurden
- LaborWC
- LaborUnion
- MaterialsExpenses
- MaterialsBurden
- Profit
- JobCount
