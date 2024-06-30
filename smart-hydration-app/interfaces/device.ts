export interface DeviceInfo {
    name: string,
    capacity: number,
    charging: boolean,
    battery: number,
    temperature: number,
    water_level: number,
}

export interface TrendsInfo {
    time: string,
    amount: number,
    id: string,
}
