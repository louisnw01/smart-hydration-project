import { chartTimeWindowAtom } from "@/atom/nav";
import { getHydrationAtom } from "@/atom/query";
import { MS_DAY, MS_HOUR, MS_MONTH, MS_WEEK, MS_YEAR } from "@/constants/data";
import { TrendsInfo } from "@/interfaces/device";
import { atom } from "jotai";
import { atomEffect } from "jotai-effect";

// returns the floor of a number based on an interval.
// eg 8 jul 13:49 returns 8 jul 00:00 if interval is MS_DAY
// eg 8 jul 13:49 returns 8 jul 13:00 if interval is MS_HOUR
export function getFloorOf(number: number, interval: number) {
    return Math.floor(number / interval) * interval;
}

export function getTodaysStartMS() {
    return getFloorOf(Date.now(), MS_DAY);
}

function getAllAggregates(
    data: any[],
    interval: number,
    conditional?: (row: {}) => boolean,
) {
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

function getTimeInMins(timestamp: number) {
    const datetime = new Date(timestamp);
    return datetime.getHours() * 60 + datetime.getMinutes();
}

export function getAggregates(data: any[], type: string) {
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
            timeRange = MS_YEAR;
            interval = MS_MONTH;
            break;
        case "M":
            timeRange = MS_MONTH;
            break;
    }
    const roundedTimeNow =
        Math.floor(Date.now() / timeWindowMap[type]) * timeWindowMap[type];

    const aggs: Map<number, {}> = new Map();
    for (let i = 0; i < timeRange; i += interval) {
        aggs.set(roundedTimeNow - i, 0);
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

    const arr = Array.from(aggs.values());
    arr.sort((a, b) => a.x - b.x);
    return arr;
}

export const formattedDataAtom = atom((get) => {
    const type = get(chartTimeWindowAtom);
    const { data, isLoading } = get(getHydrationAtom);
    if (isLoading || !data) {
        return [];
    }
    return getAggregates(data, type);
});

export interface FormattedData {
    x: number;
    y: number;
}

function avgOfNumberList(list: number[]) {
    return list.reduce((curr, num) => curr + num, 0) / list.length;
}

export const amountDrankTodayAtom = atom<number | null>(null);
export const avgAmountDrankByTimeNowAtom = atom<number | null>(null);

export const avgAmountDrankThisMonthAtom = atom<number | null>(null);
export const avgAmountDrankLastMonthAtom = atom<number | null>(null);
export const mostHydratedDayOfWeekAtom = atom<{} | null>({});

function getAmountDrankToday(data) {
    const todayStartMS = Math.floor(Date.now() / MS_DAY) * MS_DAY;
    let amountDrankToday = 0;
    for (const row of data) {
        if (row.time < todayStartMS) continue;
        amountDrankToday += row.amount;
    }
    return amountDrankToday;
}

function getAvgAmountDrankByNow(data) {
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

export const hydrationInsightsEAtom = atomEffect((get, set) => {
    const { data, isLoading } = get(getHydrationAtom);

    if (isLoading || !data) return;

    const dailyAggregates = getAllAggregates(data, MS_DAY);

    set(amountDrankTodayAtom, getAmountDrankToday(data));
    set(avgAmountDrankByTimeNowAtom, getAvgAmountDrankByNow(dailyAggregates));

    set(mostHydratedDayOfWeekAtom, getMostHydratedDayOfWeek(dailyAggregates));

    // avgAmountDrankThisMonth

    const startOfMonthMS = new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        1,
    ).getTime();

    const startOfPrevMonthMS = new Date(
        new Date().getFullYear(),
        new Date().getMonth() - 1,
        1,
    ).getTime();

    const dailyAggregatesThisMonth = getAllAggregates(
        data,
        MS_DAY,
        (row) => row.time * 1000 >= startOfMonthMS,
    );

    const dailyAggregatesLastMonth = getAllAggregates(
        data,
        MS_DAY,
        (row) =>
            row.time * 1000 >= startOfPrevMonthMS &&
            row.time * 1000 < startOfMonthMS,
    );

    set(
        avgAmountDrankThisMonthAtom,
        dailyAggregatesThisMonth.reduce((curr, row) => curr + row.value, 0) /
            dailyAggregatesThisMonth.length,
    );
    set(
        avgAmountDrankLastMonthAtom,
        dailyAggregatesLastMonth.reduce((curr, row) => curr + row.value, 0) /
            dailyAggregatesLastMonth.length,
    );
});

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

export function getMostHydratedDayOfWeek(data: any[]) {
    const dayConsumption = Array.from({ length: 7 }, () => []);

    data.forEach((row) => {
        const date = new Date(row.time);
        const day = date.getDay();
        dayConsumption[day].push(row.value);
    });

    console.log(dayConsumption);

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
