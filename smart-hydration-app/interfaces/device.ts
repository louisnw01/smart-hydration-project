export interface DeviceInfo {
    id: string;
    name: string;
    capacity: number;
    charging: boolean;
    battery: number;
    temperature: number;
    water_level: number;
    last_seen: number;
}

export interface TrendsInfo {
    time: string;
    amount: number;
    id: string;
}
