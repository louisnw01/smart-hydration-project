import { chartTimeWindowAtom } from "@/atom/nav";
import { historicalPatientJugDataQAtom } from "@/atom/query";
import { unitConverter, unitsAtom } from "@/atom/user";
import { MS_DAY, MS_HOUR, MS_MONTH, MS_WEEK, MS_YEAR } from "@/constants/data";
import { Timeframe } from "@/interfaces/data";
import { ITimeSeries } from "@/interfaces/device";
import { atom } from "jotai";

// returns the floor of a number based on an interval.
// eg 8 jul 13:49 returns 8 jul 00:00 if interval is MS_DAY
// eg 8 jul 13:49 returns 8 jul 13:00 if interval is MS_HOUR
export function getFloorOf(number: number, interval: number) {
    return Math.floor(number / interval) * interval;
}

export function getTodaysStartMS() {
    return getFloorOf(Date.now(), MS_DAY);
}

export function getRelativeTarget(target: number) {
    let timeNow = new Date().getHours();
    if (timeNow < 6) {
        return 0;
    }
    if (timeNow > 22) {
        return target;
    }
    let dayProgress = (timeNow - 6) / (22 - 6);
    return dayProgress * target;
}

export function getAllAggregates(
    data: any[],
    interval: number,
    conditional?: (row: ITimeSeries) => boolean,
) {
    if (!data) return [];
    const aggs: Map<number, number> = new Map();

    for (const row of data) {
        if (conditional && !conditional(row)) continue;

        const rowStartMS = getFloorOf(row.time * 1000, interval);

        if (aggs.has(rowStartMS)) {
            aggs.set(rowStartMS, aggs.get(rowStartMS) + row.value);
        } else {
            aggs.set(rowStartMS, row.value);
        }
    }
    return Array.from(aggs, ([time, value]) => ({ time, value }));
}

export function getTimeInMins(timestamp: number) {
    const datetime = new Date(timestamp);
    return datetime.getHours() * 60 + datetime.getMinutes();
}

export function getAggregates(
    data: any[],
    type: Timeframe,
): { x: number; y: number }[] {
    if (!data || data.length == 0) return [];
    const timeWindowMap = {
        D: MS_HOUR,
        W: MS_DAY,
        M: MS_WEEK,
        Y: MS_MONTH,
    };

    let timeRange = 0;
    let interval = MS_DAY;
    switch (type) {
        case "W":
            timeRange = MS_WEEK;
            break;
        case "D":
            timeRange = MS_DAY;
            interval = MS_HOUR;
            break;
        case "Y":
            timeRange = MS_YEAR * 1.5;
            interval = MS_MONTH;
            break;
        case "M":
            timeRange = MS_MONTH;
            break;
    }
    const roundedTimeNow =
        Math.floor(Date.now() / timeWindowMap[type]) * timeWindowMap[type];

    const dataTimeRange = data[data.length - 1].time - data[0].time;

    const newTimeRange =
        dataTimeRange < timeRange / 1000 ? timeRange / 1000 : dataTimeRange;

    const aggs: Map<number, number> = new Map();
    const maxBars = 50;
    let numBars = 0;
    for (let i = 0; i < newTimeRange * 1000; i += interval) {
        aggs.set(roundedTimeNow - i, 0);
        if (numBars > maxBars) {
            break;
        }
        numBars += 1;
    }

    for (const row of data) {
        const roundedTime =
            Math.floor((row.time * 1000) / timeWindowMap[type]) *
            timeWindowMap[type];

        // if (roundedTime < delta.getTime()) continue;

        if (aggs.has(roundedTime)) {
            aggs.set(roundedTime, aggs.get(roundedTime) + row.value);
        }
    }
    return Array.from(aggs, ([x, y]) => ({ x, y }));
}

export const formattedDataAtom = atom((get) => {
    const type = get(chartTimeWindowAtom);
    const { data, isLoading } = get(historicalPatientJugDataQAtom);
    // alert(JSON.stringify(data));
    if (isLoading || !data) {
        return { data: [], isLoading };
    }

    const unit = get(unitsAtom);
    const convertedData = data.map((row) => ({
        time: row.time,
        value: unitConverter(row.value, unit),
    }));

    return { data: getAggregates(convertedData, type), isLoading };
});

export interface FormattedData {
    x: number;
    y: number;
}

export function getAmountDrankToday(data: ITimeSeries[]) {
    const todayStartMS = Math.floor(Date.now() / MS_DAY) * MS_DAY;
    let amountDrankToday = 0;
    for (const row of data) {
        if (row.time * 1000 < todayStartMS) continue;
        amountDrankToday += row.value;
    }
    return amountDrankToday;
}

export function getAvgAmountDrankByNow(data: ITimeSeries[]) {
    const timeNow = getTimeInMins(Date.now());
    const todayStartMS = Math.floor(Date.now() / MS_DAY) * MS_DAY;
    const dailyAggregatesBeforeTime = data.filter(
        (row) => getTimeInMins(row.time) < timeNow && row.time < todayStartMS,
    );

    const totalDrankFromDailyAggs = dailyAggregatesBeforeTime.reduce(
        (curr, row) => curr + row.value,
        0,
    );

    return totalDrankFromDailyAggs / dailyAggregatesBeforeTime.length;
}

export function averageHydrationMonthComparison(data: FormattedData[]) {
    const startOfMonth = new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        1,
    ).getTime();

    const startOfPrevMonth = new Date(
        new Date().getFullYear(),
        new Date().getMonth() - 1,
        1,
    ).getTime();

    const thisMonthData = data.filter((row) => row.x > startOfMonth);

    const prevMonthData = data.filter(
        (row) => startOfPrevMonth <= row.x && row.x < startOfMonth,
    );

    const thisMonthAvg =
        thisMonthData.reduce((curr, row) => curr + row.y, 0) /
        thisMonthData.length;
    const prevMonthAvg =
        prevMonthData.reduce((curr, row) => curr + row.y, 0) /
        prevMonthData.length;

    return [thisMonthAvg || 0, prevMonthAvg || 0];
}

export function getMostHydratedDayOfWeek(data: ITimeSeries[]) {
    const dayConsumption = Array.from<unknown, number[]>(
        { length: 7 },
        () => [],
    );
    if (!data || data.length === 0) {
        return { name: "No data", value: 0 };
    }
    data.forEach((row) => {
        const date = new Date(row.time);
        const day = date.getDay();
        dayConsumption[day].push(row.value);
    });

    // not a one liner for readability
    const summedHydrationData = new Array(7).fill(0);

    for (let i = 0; i < summedHydrationData.length; i++) {
        summedHydrationData[i] = dayConsumption[i].reduce(
            (curr, row) => curr + row,
            0,
        );
    }
    const maxConsumption = Math.max(...summedHydrationData);
    const dayIndex = summedHydrationData.indexOf(maxConsumption);

    const dayNames = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ];

    return {
        name: dayNames[dayIndex],
        value: maxConsumption / dayConsumption[dayIndex].length,
    };
}
