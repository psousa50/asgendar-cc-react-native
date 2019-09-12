import { isNil } from "ramda"
import { GlobalState } from "./models"

export const getDistricts = (state: GlobalState) => state.staticData.districts
export const getDistrict = (state: GlobalState) => (districtId: number) =>
  state.staticData.districts.find(d => d.districtId === districtId)

export const getCounties = (state: GlobalState) => (districtId?: number) =>
  state.staticData.counties.filter(c => isNil(districtId) || c.districtId === districtId)
export const getCounty = (state: GlobalState) => (countyId: number) =>
  state.staticData.counties.find(c => c.countyId === countyId)
