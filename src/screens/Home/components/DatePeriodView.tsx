import React from "react"
import { i18n } from "../../../localization/i18n"
import { DatePeriod } from "../../../state/models"
import { DateString } from "../../../utils/dates"
import { formatDateLocale } from "../../../utils/formaters"
import { PeriodRow } from "./PeriodRow"

interface DatePeriodViewProps {
  startDate?: DateString
  endDate?: DateString
  onDatePeriodChange: (datePeriod: DatePeriod) => void
  onDatePeriodEdit?: () => void
}

export const DatePeriodView: React.FC<DatePeriodViewProps> = ({
  startDate,
  endDate,
  onDatePeriodChange,
  onDatePeriodEdit,
}) => {
  const clearStartDate = () =>
    onDatePeriodChange({ startDate: undefined, endDate })
  const clearEndDate = () =>
    onDatePeriodChange({ startDate, endDate: undefined })

  return (
    <>
      <PeriodRow
        active={!!startDate}
        title={i18n.t("DatePeriod.From")}
        value={formatDateLocale(startDate)}
        onEdit={onDatePeriodEdit}
        onClear={clearStartDate}
      />
      <PeriodRow
        active={!!endDate}
        title={i18n.t("DatePeriod.To")}
        value={formatDateLocale(endDate)}
        onEdit={onDatePeriodEdit}
        onClear={clearEndDate}
      />
    </>
  )
}
