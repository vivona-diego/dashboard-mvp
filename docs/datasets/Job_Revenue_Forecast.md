# Dataset: Job_Revenue_Forecast
Job Revenue Forecast - Actual vs Estimated by Job, Customer, Sales Person

## SQL Base
```sql
SELECT Year, Month, CompanyName, YardName, Customer, Salesperson, JobSite, JobSdate, JobEdate, ModifiedDate, JobCode, ActualAmount, EstimatedAmount, ActualHours, EstimatedHrs, ActualAmount - EstimatedAmount AS Variance FROM FMS_VW_JOB_REVENUE_FORECAST
```

## Segments
- Year
- Month
- Company
- Yard
- Customer
- SalesPerson
- JobSite
- JobStartDate
- JobEndDate
- ForecastDate

## Metrics
- ActualRevenue
- EstimatedRevenue
- Variance
- ActualHours
- EstimatedHours
- JobCount
