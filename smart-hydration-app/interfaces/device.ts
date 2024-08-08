export interface DeviceInfo {
    id: string;
    name: string;
    jugUserId: number;
    capacity: number;
    charging: boolean;
    battery: number;
    temperature: number;
    water_level: number;
    last_seen: number;
}

export interface ITimeSeries {
    time: number;
    value: number;
}
