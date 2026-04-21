# Dataset: Preventive_Maintenance
Preventive Maintenance - Coming Due and Past Due activities by Unit, Company, Yard

## SQL Base
```sql
SELECT cd.UnitCode, ut.Description AS UnitType, c.Name AS Company, ym.YardName AS Yard, act.Description AS Activity, st.Description AS ScheduleType, cd.NextMaintDate, CASE WHEN cd.PastDueFlag = 1 THEN 'Past Due' ELSE 'Coming Due' END AS DueStatus, cd.PastDue, cd.ComingDue, cd.HourLower, cd.HourUpper, cd.MilesKM, cd.Description AS ItemDescription, dd.Year, dd.MonthName AS Month FROM FMS_VW_COMING_DUE_PBI cd LEFT JOIN FMS_UNITS u ON cd.UnitCode = u.UnitCode LEFT JOIN FMS_UNIT_TYPES ut ON cd.UnitTypeID = ut.UnitTypeID LEFT JOIN FMS_COMPANIES c ON cd.CompanyCode = c.CompanyCode LEFT JOIN FMS_YARD_MASTER ym ON cd.YardCode = ym.YardCode LEFT JOIN FMS_ACTIVITIES act ON cd.ActivityCode = act.ActivityCode LEFT JOIN FMS_SCHEDULE_TYPES st ON cd.UnitSchedType = st.UnitSchedCode LEFT JOIN FMS_DATE_DIMENSION dd ON CAST(cd.NextMaintDate AS DATE) = dd.Date
```

## Segments
- UnitCode
- UnitType
- Company
- Yard
- Activity
- ScheduleType
- DueStatus
- Year
- Month

## Metrics
- TotalActivities
- PastDueCount
- ComingDueCount
- UnitCount
