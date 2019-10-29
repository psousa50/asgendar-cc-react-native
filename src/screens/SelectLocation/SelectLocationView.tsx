import { Text, View } from "native-base"
import { isNil, sort } from "ramda"
import React, { useMemo } from "react"
import { KeyboardAvoidingView, StyleSheet } from "react-native"
import SegmentedControlTab from "react-native-segmented-control-tab"
import { SearchableItem, SearchableTextInputLocation } from "../../components/common/SearchableTextInputLocation"
import { County } from "../../irnTables/models"
import { i18n } from "../../localization/i18n"
import { IrnPlacesProxy } from "../../state/irnPlacesSlice"
import { allRegions, IrnTableFilterLocation, Region, regionNames } from "../../state/models"
import { ReferenceDataProxy } from "../../state/referenceDataSlice"
import { appTheme } from "../../utils/appTheme"
import { getDistrictName } from "../../utils/location"
import { responsiveFontScale as rfs, responsiveScale as rs } from "../../utils/responsive"
import { searchNormalizer } from "../../utils/strings"

const colorSecondary = appTheme.brandSecondary
const colorSecondaryText = appTheme.secondaryText

interface SearchableLocation extends SearchableItem {
  item: {
    countyId?: number
    districtId: number
    region: Region
  }
}

type SearchableCounty = SearchableLocation
type SearchableIrnPlace = SearchableLocation

interface SelectLocationViewProps {
  location: IrnTableFilterLocation
  irnPlacesProxy: IrnPlacesProxy
  referenceDataProxy: ReferenceDataProxy
  onLocationChange: (location: IrnTableFilterLocation) => void
  onSelectDistrictCountyOnMap: () => void
  onSelectIrnPlaceOnMap: () => void
}

export const SelectLocationView: React.FC<SelectLocationViewProps> = ({
  location,
  referenceDataProxy,
  irnPlacesProxy,
  onLocationChange,
  onSelectDistrictCountyOnMap,
  onSelectIrnPlaceOnMap,
}) => {
  const { countyId, districtId, region } = location

  const searchableCounties = useMemo(() => buildSearchableCounties(referenceDataProxy), [])
  const searchableIrnPlaces = useMemo(() => buildSearchableIrnPlaces(referenceDataProxy, irnPlacesProxy), [])

  const onRegionTabPress = (index: number) => {
    onLocationChange({ region: allRegions[index] })
  }

  const clearCounty = () => {
    onLocationChange({ ...location, districtId: undefined, countyId: undefined, placeName: undefined })
  }

  const fetchDistrictCounties = (text: string) =>
    searchableCounties.filter(
      sc =>
        (isNil(location.region) || sc.item.region === location.region) &&
        sc.searchText.includes(searchNormalizer(text)),
    )

  const onCountyPressed = (item: SearchableItem) => {
    const sc = item as SearchableCounty
    onLocationChange(sc.item)
  }
  const selectedDistricts = searchableCounties.filter(sc => sc.item.districtId === districtId)
  const selectedCounty =
    selectedDistricts.length === 1 ? selectedDistricts[0] : selectedDistricts.find(sc => sc.item.countyId === countyId)
  const districtCountyText = selectedCounty && selectedCounty.displayText

  const selectedPlaceNames = searchableIrnPlaces.filter(
    p => (isNil(districtId) || p.item.districtId === districtId) && (isNil(countyId) || p.item.countyId === countyId),
  )

  const clearPlaceName = () => {
    onLocationChange({ ...location, placeName: undefined })
  }
  const fetchPlaceName = (text: string) =>
    searchableIrnPlaces.filter(
      sp =>
        (isNil(region) || sp.item.region === region) &&
        (isNil(districtId) || sp.item.districtId === districtId) &&
        (isNil(countyId) || sp.item.countyId === countyId) &&
        sp.searchText.includes(searchNormalizer(text)),
    )

  const onIrnPlacePressed = (item: SearchableItem) => {
    onLocationChange({ placeName: item.displayText })
  }

  return (
    <KeyboardAvoidingView style={styles.container}>
      <Text style={styles.title}>{i18n.t("Where.Region")}</Text>
      <View style={styles.regionContainer}>
        <SegmentedControlTab
          activeTabStyle={styles.activeTabStyle}
          activeTabTextStyle={styles.activeTabTextStyle}
          tabStyle={styles.tabStyle}
          tabTextStyle={styles.tabTextStyle}
          values={allRegions.map(r => regionNames[r])}
          selectedIndex={allRegions.findIndex(r => r === region) || 0}
          onTabPress={onRegionTabPress}
        />
      </View>
      <Text style={styles.title}>{i18n.t("Where.DistrictCounty")}</Text>
      <SearchableTextInputLocation
        fontSize={rs(14)}
        initialText={districtCountyText}
        placeHolder={i18n.t("Where.LookDistrictCounty")}
        fetchItems={fetchDistrictCounties}
        onClear={clearCounty}
        onItemPressed={onCountyPressed}
        onSelectOnMap={onSelectDistrictCountyOnMap}
      />
      <Text style={styles.title}>{i18n.t("Where.Place")}</Text>
      <SearchableTextInputLocation
        fontSize={rs(10)}
        initialText={location.placeName}
        placeHolder={i18n.t("Where.LookPlace")}
        fetchItems={fetchPlaceName}
        onClear={clearPlaceName}
        onItemPressed={onIrnPlacePressed}
        onSelectOnMap={selectedPlaceNames.length > 1 ? onSelectIrnPlaceOnMap : undefined}
      />
    </KeyboardAvoidingView>
  )
}

const buildSearchableCounties = (referenceDataProxy: ReferenceDataProxy): SearchableCounty[] => {
  const countyIsNotSingle = (county: County) => referenceDataProxy.getCounties(county.districtId).length > 1
  const countyNames = referenceDataProxy
    .getCounties()
    .filter(countyIsNotSingle)
    .map(county => {
      const district = referenceDataProxy.getDistrict(county.districtId)!
      const displayText = getDistrictName(referenceDataProxy)(district.districtId, county.countyId)!
      return {
        item: {
          countyId: county.countyId,
          districtId: county.districtId,
          region: district.region,
        },
        key: displayText,
        displayText,
        searchText: searchNormalizer(displayText),
      }
    })
  const districtNames = referenceDataProxy.getDistricts().map(district => {
    const displayText = getDistrictName(referenceDataProxy)(district.districtId)!
    const searchText = searchNormalizer(displayText)
    return {
      item: {
        countyId: undefined,
        districtId: district.districtId,
        region: district.region,
      },
      key: displayText,
      displayText,
      searchText,
    }
  })

  return [
    ...sort((n1, n2) => n1.displayText.localeCompare(n2.displayText), districtNames),
    ...sort((n1, n2) => n1.displayText.localeCompare(n2.displayText), countyNames),
  ]
}

export const buildSearchableIrnPlaces = (
  referenceDataProxy: ReferenceDataProxy,
  irnPlacesProxy: IrnPlacesProxy,
): SearchableIrnPlace[] =>
  irnPlacesProxy.getIrnPlaces({}).map(p => ({
    item: {
      countyId: p.countyId,
      districtId: p.districtId,
      region: referenceDataProxy.getDistrict(p.districtId)!.region,
    },
    searchText: searchNormalizer(p.name),
    displayText: p.name,
    key: p.name,
  }))

const styles = StyleSheet.create({
  container: {
    marginTop: rs(6),
    flexDirection: "column",
    paddingHorizontal: rs(12),
  },
  regionContainer: {
    marginTop: rs(2),
    padding: rs(7),
    backgroundColor: "white",
    borderRadius: rs(7),
  },
  activeTabStyle: {
    backgroundColor: colorSecondary,
  },
  activeTabTextStyle: {
    color: colorSecondaryText,
  },
  tabStyle: {
    borderColor: colorSecondary,
  },
  tabTextStyle: {
    paddingVertical: rs(7),
    fontSize: rfs(12),
    flexWrap: "wrap",
  },
  title: {
    marginTop: rs(20),
    marginBottom: rs(10),
  },
})
