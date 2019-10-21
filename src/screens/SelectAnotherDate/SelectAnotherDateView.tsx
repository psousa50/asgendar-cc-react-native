import moment from "moment"
import { View } from "native-base"
import React from "react"
import { StyleSheet } from "react-native"
import { CalendarList, DateObject } from "react-native-calendars"
import { IrnRepositoryTables } from "../../irnTables/models"
import { groupCollection, max, min } from "../../utils/collections"
import { DateString, toDateString } from "../../utils/dates"

interface SelectAnotherDateViewProps {
  irnTables: IrnRepositoryTables
  onDateSelected: (date: DateString) => void
}
export const SelectAnotherDateView: React.FC<SelectAnotherDateViewProps> = ({ irnTables, onDateSelected }) => {
  const irnTablesByDate = groupCollection(t => t.date, irnTables)
  const dates = irnTablesByDate.map(g => g.key)
  const minDate = min(dates)
  const maxDate = max(dates)
  const currentDate = minDate || new Date(Date.now())
  const diffMonths = maxDate ? moment(new Date(maxDate)).diff(moment(currentDate), "month") : 0

  const markedDates = irnTablesByDate.reduce(
    (acc, cur) => ({
      ...acc,
      [cur.key]: { selected: true },
    }),
    {},
  )

  const onDayPress = (dateObject: DateObject) => {
    const date = toDateString(new Date(dateObject.dateString))
    date && onDateSelected(date)
  }

  return (
    <View style={styles.container}>
      <CalendarList
        current={currentDate}
        pastScrollRange={0}
        futureScrollRange={diffMonths}
        markedDates={markedDates}
        markingType={"simple"}
        onDayPress={onDayPress}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
