import { Counties, Districts, IrnRepositoryTables } from "../irnTables/models"

export interface StaticDataState {
  counties: Counties
  districts: Districts
  error: Error | null
  loaded: boolean
  loading: boolean
}

export interface IrnFilterState {
  countyId?: number
  districtId?: number
  startDate?: Date
  endDate?: Date
  selectedDate?: Date
}

export interface IrnTablesDataState {
  filter: IrnFilterState
  lastUsedFilter: IrnFilterState
  irnTables: IrnRepositoryTables
  error: Error | null
  loading: boolean
}

export interface GlobalState {
  staticData: StaticDataState
  irnTablesData: IrnTablesDataState
}

export const initialGlobalState: GlobalState = {
  staticData: {
    districts: [],
    counties: [],
    error: null,
    loaded: false,
    loading: false,
  },
  irnTablesData: {
    filter: {},
    lastUsedFilter: {},
    irnTables: [],
    error: null,
    loading: false,
  },
}
