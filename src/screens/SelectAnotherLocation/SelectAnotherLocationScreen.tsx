import React, { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { AppModalScreen, AppScreenProps } from "../../components/common/AppScreen"
import { i18n } from "../../localization/i18n"
import { buildIrnPlacesProxy } from "../../state/irnPlacesSlice"
import { updateRefineFilter } from "../../state/irnTablesSlice"
import { IrnTableRefineFilterLocation } from "../../state/models"
import { buildReferenceDataProxy } from "../../state/referenceDataSlice"
import { RootState } from "../../state/rootReducer"
import { normalizeLocation } from "../../utils/location"
import { enhancedNavigation } from "../screens"
import { SelectAnotherLocationView } from "./SelectAnotherLocationView"

export const SelectAnotherLocationScreen: React.FunctionComponent<AppScreenProps> = props => {
  const navigation = enhancedNavigation(props.navigation)
  const [refineLocation, setRefineLocation] = useState<IrnTableRefineFilterLocation>({})

  const dispatch = useDispatch()

  const { irnTableMatchResult, irnPlacesProxy, referenceDataProxy } = useSelector((state: RootState) => ({
    irnTableMatchResult: state.irnTablesData.irnTableMatchResult,
    irnPlacesProxy: buildIrnPlacesProxy(state.irnPlacesData),
    referenceDataProxy: buildReferenceDataProxy(state.referenceData),
  }))

  const onLocationChange = (newLocation: Partial<IrnTableRefineFilterLocation>) => {
    const normalizedLocation = normalizeLocation(referenceDataProxy, irnPlacesProxy)(newLocation)
    if (normalizedLocation.placeName !== undefined) {
      dispatch(updateRefineFilter(normalizedLocation))
      navigation.goBack()
    } else {
      setRefineLocation(normalizedLocation)
    }
  }

  const selectAnotherLocationViewProps = {
    places: irnTableMatchResult.otherPlaces,
    refineLocation,
    irnPlacesProxy,
    referenceDataProxy,
    onLocationChange,
  }

  return (
    <AppModalScreen {...props} title={i18n.t("Title.SelectAnotherLocation")} noScroll={true}>
      <SelectAnotherLocationView {...selectAnotherLocationViewProps} />
    </AppModalScreen>
  )
}
