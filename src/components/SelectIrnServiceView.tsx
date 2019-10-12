import { Text, View } from "native-base"
import React from "react"
import { Image, StyleSheet, TouchableOpacity } from "react-native"
import SegmentedControlTab from "react-native-segmented-control-tab"
import { ccImage, passportImage } from "../assets/images/images"
import { i18n } from "../localization/i18n"

interface SelectIrnServiceViewProps {
  serviceId?: number
  onServiceIdChanged: (serviceId: number) => void
}

export const SelectIrnServiceView: React.FC<SelectIrnServiceViewProps> = ({ serviceId, onServiceIdChanged }) => {
  const onTabPress = (index: number) => {
    const oldServiceId = serviceId || 1
    const newServiceId =
      index === 0 && [2, 4].includes(oldServiceId)
        ? oldServiceId - 1
        : index === 1 && [1, 3].includes(oldServiceId)
        ? oldServiceId + 1
        : oldServiceId
    onServiceIdChanged(newServiceId)
  }

  const onImagePress = (index: number) => {
    const oldServiceId = serviceId || 1
    const newServiceId =
      index === 0 && [3, 4].includes(oldServiceId)
        ? oldServiceId - 2
        : index === 1 && [1, 2].includes(oldServiceId)
        ? oldServiceId + 2
        : oldServiceId
    onServiceIdChanged(newServiceId)
  }

  const serviceIsForCitizenCard = [1, 2].includes(serviceId || 1)
  const serviceIsForPassport = [3, 4].includes(serviceId || 1)
  return (
    <View>
      <SegmentedControlTab
        activeTabStyle={{ backgroundColor: "#46b7df" }}
        tabStyle={{ borderColor: "#46b7df" }}
        values={[i18n.t("Service.Get_renew"), i18n.t("Service.Pickup")]}
        selectedIndex={[1, 3].includes(serviceId || 1) ? 0 : 1}
        onTabPress={onTabPress}
      />
      <View style={styles.serviceImages}>
        <TouchableOpacity
          style={[styles.serviceImageTouch, serviceIsForCitizenCard ? styles.selectedCard : {}]}
          onPress={() => onImagePress(0)}
        >
          <Image style={styles.serviceImage} source={ccImage} />
          <Text style={[styles.cardText, serviceIsForCitizenCard ? styles.cardSelectedText : {}]}>
            {i18n.t("CitizenCard")}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.serviceImageTouch, serviceIsForPassport ? styles.selectedCard : {}]}
          onPress={() => onImagePress(1)}
        >
          <Image style={styles.serviceImage} source={passportImage} />
          <Text style={[styles.cardText, serviceIsForPassport ? styles.cardSelectedText : {}]}>
            {i18n.t("Passport")}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  serviceImages: {
    flexDirection: "row",
    paddingTop: 10,
  },
  serviceImageTouch: {
    width: "50%",
    alignItems: "center",
  },
  serviceImage: {
    width: 70,
    height: 70,
  },
  cardText: {
    marginTop: 5,
    fontSize: 12,
  },
  cardSelectedText: {
    color: "white",
  },
  selectedCard: {
    backgroundColor: "#46b7df",
  },
})
