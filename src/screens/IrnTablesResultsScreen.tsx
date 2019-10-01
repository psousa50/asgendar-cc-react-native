import { Button, Text, View } from "native-base"
import React, { useState } from "react"
import { StyleSheet } from "react-native"
import { AppScreen, AppScreenProps, renderContentOrLoading } from "../common/AppScreen"
import { IrnTableResultView } from "../common/IrnTableResultView"
import { useIrnDataFetch } from "../dataFetch/useIrnDataFetch"
import { useGlobalState } from "../GlobalStateProvider"
import {
  filterTable,
  getIrnTableResultSummary,
  irnTableResultsAreEqual,
  selectOneIrnTableResultByClosestDate,
  selectOneIrnTableResultByClosestPlace,
} from "../irnTables/main"
import { GpsLocation } from "../irnTables/models"
import { globalStateSelectors } from "../state/selectors"
import { useCurrentGpsLocation } from "../utils/hooks"
import { navigate } from "./screens"

export const IrnTablesResultsScreen: React.FunctionComponent<AppScreenProps> = props => {
  const navigation = navigate(props.navigation)
  const [globalState] = useGlobalState()
  const { irnTablesData } = useIrnDataFetch()
  const [, setCurrentGpsLocation] = useState(undefined as GpsLocation | undefined)

  useCurrentGpsLocation(setCurrentGpsLocation)

  const stateSelectors = globalStateSelectors(globalState)

  const irnFilter = stateSelectors.getIrnTablesFilter
  const irnTables = irnTablesData.irnTables.filter(filterTable(irnFilter))

  const irnTableResultByClosestDate = selectOneIrnTableResultByClosestDate(stateSelectors)(irnTables, irnFilter)
  const irnTableResultByClosestPlace = selectOneIrnTableResultByClosestPlace(stateSelectors)(irnTables, irnFilter)

  const irnTableResultSummary = getIrnTableResultSummary(irnTables)

  const renderContent = () => {
    const closestAreTheSame =
      irnTableResultByClosestDate && irnTableResultByClosestPlace
        ? irnTableResultsAreEqual(irnTableResultByClosestDate, irnTableResultByClosestPlace)
        : false
    return (
      <View style={styles.container}>
        <Text>{`Resultados encontrados: ${irnTables.length}`}</Text>
        {irnTableResultByClosestDate ? (
          <View style={styles.container}>
            <Text>{`Mais rápido${closestAreTheSame ? " e mais próximo" : ""}:`}</Text>
            <IrnTableResultView {...irnTableResultByClosestDate} />
          </View>
        ) : null}
        {irnTableResultByClosestPlace && !closestAreTheSame ? (
          <View style={styles.container}>
            <Text>{"Mais próximo:"}</Text>
            <IrnTableResultView {...irnTableResultByClosestPlace} />
          </View>
        ) : null}
        <Button onPress={() => navigation.goTo("IrnTablesResultsMapScreen")}>
          <Text>{"See Map"}</Text>
        </Button>
        <Button onPress={() => navigation.goTo("IrnTablesByDateScreen")}>
          <Text>{"Select Date"}</Text>
        </Button>
        <Button onPress={() => navigation.goTo("MapLocationSelectorScreen")}>
          <Text>{"Select Place"}</Text>
        </Button>
        <Text>{JSON.stringify(irnFilter, null, 2)}</Text>
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
