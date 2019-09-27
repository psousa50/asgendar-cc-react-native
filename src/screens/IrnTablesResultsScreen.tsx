import { Text, View } from "native-base"
import React, { useState } from "react"
import { StyleSheet } from "react-native"
import { AppScreen, AppScreenProps, renderContentOrLoading } from "../common/AppScreen"
import { IrnTableResultView } from "../common/IrnTableResultView"
import { useIrnDataFetch } from "../dataFetch/useIrnDataFetch"
import { useGlobalState } from "../GlobalStateProvider"
import {
  getIrnTableResultSummary,
  irnTableResultsAreEqual,
  selectOneIrnTableResultByClosestDate,
  selectOneIrnTableResultByClosestPlace,
} from "../irnTables/main"
import { GpsLocation } from "../irnTables/models"
import { globalStateSelectors } from "../state/selectors"
import { useCurrentGpsLocation } from "../utils/hooks"

export const IrnTablesResultsScreen: React.FunctionComponent<AppScreenProps> = props => {
  const [globalState] = useGlobalState()
  const { irnTablesData } = useIrnDataFetch()
  const [, setCurrentGpsLocation] = useState(null as GpsLocation | null)

  useCurrentGpsLocation(setCurrentGpsLocation)

  const stateSelectors = globalStateSelectors(globalState)

  const irnFilter = stateSelectors.getIrnTablesFilter

  const irnTableResultByClosestDate = selectOneIrnTableResultByClosestDate(stateSelectors)(
    irnTablesData.irnTables,
    irnFilter,
  )
  const irnTableResultByClosestPlace = selectOneIrnTableResultByClosestPlace(stateSelectors)(
    irnTablesData.irnTables,
    irnFilter,
  )

  const irnTableResultSummary = getIrnTableResultSummary(irnTablesData.irnTables)

  const renderContent = () => {
    const closestAreSame =
      irnTableResultByClosestDate && irnTableResultByClosestPlace
        ? irnTableResultsAreEqual(irnTableResultByClosestDate, irnTableResultByClosestPlace)
        : false
    return (
      <View style={styles.container}>
        <Text>{`Resultados encontrados: ${irnTablesData.irnTables.length}`}</Text>
        {irnTableResultByClosestDate ? (
          <View style={styles.container}>
            <Text>{`Mais rápido${closestAreSame ? " e mais próximo" : ""}:`}</Text>
            <IrnTableResultView {...irnTableResultByClosestDate} />
          </View>
        ) : null}
        {irnTableResultByClosestPlace && !closestAreSame ? (
          <View style={styles.container}>
            <Text>{"Mais próximo:"}</Text>
            <IrnTableResultView {...irnTableResultByClosestPlace} />
          </View>
        ) : null}
        <Text>{`Di = ${irnTableResultSummary.districtIds.length}`}</Text>
        <Text>{`Ct = ${irnTableResultSummary.countyIds.length}`}</Text>
        <Text>{`Pl = ${irnTableResultSummary.irnPlaceNames.length}`}</Text>
        <Text>{`Dt = ${irnTableResultSummary.dates.length}`}</Text>
        <Text>{`Ts = ${irnTableResultSummary.timeSlots.length}`}</Text>
      </View>
    )
  }

  return (
    <AppScreen
      {...props}
      content={renderContentOrLoading(irnTablesData.loading, renderContent)}
      title="Resultados"
      showAds={false}
    />
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
