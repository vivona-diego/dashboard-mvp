# Dataset: Quote_Revenue_Forecast
Quote Revenue Forecast by Month, Year

## SQL Base
```sql
SELECT v.QuoteNumb, v.Month, v.Year, v.QuoteDate, v.QuoteAmount, v.QuoteHrs, ym.YardName AS Yard, sp.FName + ' ' + sp.LName AS SalesPerson FROM FMS_VW_QUOTE_REVENUE_FORECAST v LEFT JOIN FMS_QUOTE_MASTER qm ON v.QuoteNumb = qm.QuoteNumb LEFT JOIN FMS_YARD_MASTER ym ON qm.YardCode = ym.YardCode LEFT JOIN FMS_SALES_PERSON sp ON qm.SpersonCode = sp.SpersonCode
```

## Segments
- Month
- Year
- QuoteDate
- Yard
- SalesPerson
- QuoteNumber

## Metrics
- QuoteAmount
- QuoteHours
- QuoteCount
- AvgQuoteAmount
