import { NavigationParams, NavigationRoute, NavigationScreenProp } from "react-navigation"

export type AppScreenName =
  | "HomeScreen"
  | "IrnDateFilterScreen"
  | "IrnLocationFilterScreen"
  | "IrnTablesByDateScreen"
  | "IrnTablesDayScheduleScreen"
  | "IrnTablesResultsScreen"
  | "IrnTablesResultsMapScreen"
  | "MapLocationSelectorScreen"
  | "SelectedIrnTableScreen"

export const navigate = (navigation: NavigationScreenProp<NavigationRoute<NavigationParams>, NavigationParams>) => ({
  ...navigation,
  goTo: (screen: AppScreenName) => navigation.navigate(screen),
})
