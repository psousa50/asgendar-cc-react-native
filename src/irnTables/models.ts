export type TimeSlot = string

export interface GpsLocation {
  latitude: number
  longitude: number
}
export type IrnService = {
  id: number
  name: string
}
export type IrnServices = IrnService[]

export type District = {
  districtId: number
  name: string
  gpsLocation?: GpsLocation
}
export type Districts = District[]

export type County = {
  districtId: number
  countyId: number
  name: string
  gpsLocation?: GpsLocation
}
export type Counties = County[]

export type IrnRepositoryTable = {
  serviceId: number
  districtId: number
  countyId: number
  placeName: string
  tableNumber: string
  address: string
  postalCode: string
  phone: string
  date: Date
  timeSlots: TimeSlot[]
}
export type IrnRepositoryTables = IrnRepositoryTable[]

export type DaySchedule = {
  date: Date
  timeSlots: TimeSlot[]
}

export type PlaceSchedule = {
  placeName: string
  timeSlots: TimeSlot[]
}

export interface IrnTableGrouped {
  serviceId: number
  districtId: number
  countyId: number
  address: string
  postalCode: string
  phone: string
}

export interface IrnTableLocationSchedules extends IrnTableGrouped {
  placeName: string
  daySchedules: DaySchedule[]
}

export interface IrnTableDateSchedules extends IrnTableGrouped {
  date: Date
  placeSchedules: PlaceSchedule[]
}

export type GetTableParams = Partial<{
  serviceId: number
  districtId: number
  countyId: number
  startDate: Date
  endDate: Date
  startTime: TimeSlot
  endTime: TimeSlot
}>
