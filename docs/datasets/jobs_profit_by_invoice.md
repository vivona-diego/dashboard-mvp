# Dataset: jobs_profit_by_invoice
Jobs Profit/Loss by Invoice Date

## SQL Base
```sql
SELECT JobCode, JobSdate, JobEdate, JobStatus, Department, YardName, SalesPersonName, State, CompanyName, CustName, LocationName, WorkDescription, RevAmount, LabAct AS LaborExpense, MatAct AS MaterialExpense, LabActHrs AS LaborHours, LaborOverHeadAmt + LaborBurdenAmt + LaborWcAmt + LaborUnionAmt AS LaborBurden, MatOverHead AS MaterialOverhead, OverHead AS Overhead, EquipAmt AS EquipmentExpense, WoExpenses, RevAmount - (LabAct + MatAct + ISNULL(LaborOverHeadAmt,0) + ISNULL(LaborBurdenAmt,0) + ISNULL(LaborWcAmt,0) + ISNULL(LaborUnionAmt,0) + ISNULL(MatOverHead,0) + ISNULL(EquipAmt,0) + ISNULL(WoExpenses,0)) AS NetProfit FROM FMS_VW_PBI_Jobs_Profit_Loss_By_InvoiceDate
```

## Segments
- JobCode
- JobStatus
- Yard
- Department
- Customer
- Company
- SalesPerson
- State
- Location
- JobStartDate
- JobEndDate

## Metrics
- Revenue
- LaborExpense
- MaterialExpense
- LaborBurden
- MaterialOverhead
- Overhead
- EquipmentExpense
- WoExpenses
- LaborHours
- NetProfit
- JobCount
