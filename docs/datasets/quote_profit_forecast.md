# Dataset: quote_profit_forecast
Quote Profit Forecast with Yard and Sales Person

## SQL Base
```sql
SELECT v.*, ym.YardName AS Yard, CONCAT(sp.FName, ' ' , sp.LName) AS SalesPerson FROM FMS_VW_PBI_QUOTE_PROFIT v LEFT JOIN FMS_QUOTE_MASTER qm ON v.QuoteNumb = qm.QuoteNumb LEFT JOIN FMS_YARD_MASTER ym ON qm.YardCode = ym.YardCode LEFT JOIN FMS_SALES_PERSON sp ON qm.SpersonCode = sp.SpersonCode
```

## Segments
- QuoteNumber
- BillingCode
- BillingDescription
- Measure
- Item
- CreatedDate
- CreatedBy
- Yard
- SalesPerson

## Metrics
- Revenue
- TotalExpense
- LaborExpense
- MaterialExpense
- EquipmentExpense
- IndirectExpense
- DirectExpense
- Quantity
- QuoteCount
- LineCount
