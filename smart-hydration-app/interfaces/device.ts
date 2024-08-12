export enum StaleWarningType {
    NOT_STALE,
    CLOSE_TO_STALE,
    STALE,
}

export interface Warnings {
    stale: StaleWarningType;
    // battery: BatteryWarningType
}

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
    warnings: Warnings;
}

export interface ITimeSeries {
    time: number;
    value: number;
}
