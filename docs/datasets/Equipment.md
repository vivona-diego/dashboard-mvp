# Dataset: Equipment
Equipment Utilization and Downtime by Unit, Company, Yard

## SQL Base
```sql
SELECT th.UnitCode, ut.Description AS UnitType, c.Name AS Company, ym.YardName AS Yard, YEAR(th.DimDate) AS Year, th.MonthName AS Month, MONTH(th.DimDate) AS MonthNumber, th.TargetMonthHrs AS TargetHours, ISNULL(ds.DaysDown, 0) AS DowntimeDays, ISNULL(ds.DownHours, 0) AS DowntimeHours, th.TargetMonthHrs - ISNULL(ds.DownHours, 0) AS AvailableHours, CASE WHEN th.TargetMonthHrs > 0 THEN ((th.TargetMonthHrs - ISNULL(ds.DownHours, 0)) / th.TargetMonthHrs) * 100 ELSE 0 END AS UtilizationPercent FROM FMS_VW_PBI_UNIT_TARGET_HOURS th INNER JOIN FMS_UNITS u ON th.UnitCode = u.UnitCode LEFT JOIN FMS_UNIT_TYPES ut ON u.UnitTypeID = ut.UnitTypeID LEFT JOIN FMS_COMPANIES c ON u.CompanyCode = c.CompanyCode LEFT JOIN FMS_YARD_MASTER ym ON u.YardCode = ym.YardCode LEFT JOIN FMS_VW_Down_Equip_Monthly_Summary ds ON th.UnitCode = ds.UnitCode AND YEAR(th.DimDate) = ds.Year AND th.MonthName = ds.MonthName
```

## Segments
- UnitCode
- UnitType
- Company
- Yard
- Year
- Month

## Metrics
- TargetHours
- DowntimeDays
- DowntimeHours
- AvailableHours
- AvgUtilization
- UnitCount
