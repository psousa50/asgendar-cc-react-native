import React, { useState } from "react"
import { AppModalScreen, AppScreenProps } from "../../components/common/AppScreen"
import { ButtonIcons } from "../../components/common/ToolbarIcons"
import { useGlobalState } from "../../GlobalStateProvider"
import { IrnTableRefineFilterLocation } from "../../state/models"
import { globalStateSelectors } from "../../state/selectors"
import { navigate } from "../screens"
import { SelectAnotherLocationView } from "./SelectAnotherLocationView"

export const SelectAnotherLocationScreen: React.FunctionComponent<AppScreenProps> = props => {
  const navigation = navigate(props.navigation)
  const [globalState, globalDispatch] = useGlobalState()
  const stateSelectors = globalStateSelectors(globalState)
  const initialLocation: IrnTableRefineFilterLocation = {}
  const [location, setLocation] = useState(initialLocation)

  const updateRefineFilter = (newFilter: Partial<IrnTableRefineFilterLocation>) => {
    globalDispatch({
      type: "IRN_TABLES_SET_REFINE_FILTER",
      payload: { filter: newFilter },
    })
  }

  const onLocationChange = (newLocation: Partial<IrnTableRefineFilterLocation>, isLast: boolean) => {
    if (isLast) {
      updateRefineFilter(newLocation)
      navigation.goBack()
    } else {
      setLocation(newLocation)
    }
  }

  const updateRefineFilterAndGoBack = () => {
    updateRefineFilter(location)
    navigation.goBack()
  }

  const selectAnotherLocationViewProps = {
    irnTables: stateSelectors.getIrnTables,
    location,
    referenceData: stateSelectors,
    onLocationChange,
  }

  return (
    <AppModalScreen {...props} right={() => ButtonIcons.Checkmark(() => updateRefineFilterAndGoBack())}>
      <SelectAnotherLocationView {...selectAnotherLocationViewProps} />
    </AppModalScreen>
  )
}
