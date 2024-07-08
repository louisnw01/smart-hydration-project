import { chartTimeWindowAtom } from "@/atom/nav";
import { getHydrationAtom } from "@/atom/query";
import { atom } from "jotai";
import { atomEffect } from "jotai-effect";

export function getAggregates(data: any[], type: string) {
    const MS_HOUR = 60 * 60 * 1000;
    const MS_DAY = MS_HOUR * 24;
    const MS_WEEK = MS_DAY * 7;
    const MS_MONTH = MS_WEEK * 4;
    const MS_YEAR = MS_MONTH * 12;

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

            // } else {
            // aggs.set(roundedTime, { x: roundedTime, y: row.value });
            // }
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

// export const formattedDataEAtom = atomEffect((get, set) => {

//     set(
//         formattedDataAtom,
//         formattedData.map((row) => ({
//             x: new Date(row.x),
//             y: row.y,
//         })),
//     );
// });

export interface FormattedData {
    x: number;
    y: number;
}

function avgOfNumberList(list: number[]) {
    return list.reduce((curr, num) => curr + num, 0) / list.length;
}

export function averageDailyHydrationComparison(data: FormattedData[]) {
    let howMuchWaterDrankToday = 0;

    //const timeNow = new Date().getHours() + new Date().getMinutes() / 60;

    // TODO: do this all with bit shifting
    const dayInMS = 1000 * 60 * 60 * 24;
    const day = Math.floor(new Date().getTime() / dayInMS) * dayInMS;

    const validVals = [];
    for (const row of data) {
        const rowDT = new Date(row.x);
        const rowTime = rowDT.getHours() + rowDT.getMinutes() / 60;

        if (rowTime > day) {
            howMuchWaterDrankToday += row.y;
        }

        validVals.push(row.y);
    }

    const avgAmount = avgOfNumberList(validVals);

    return [howMuchWaterDrankToday || 0, avgAmount || 0];
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

export function getMostProductiveDay(data) {
    const dayConsumption = new Array(7).fill(0);

    data.forEach((item) => {
        const date = new Date(item.x);
        const day = date.getDay();
        dayConsumption[day] += item.y;
    });

    const maxConsumption = Math.max(...dayConsumption);
    const mostProductiveDayIndex = dayConsumption.indexOf(maxConsumption);
    const highestConsumption = dayConsumption[mostProductiveDayIndex];
    const dayNames = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ];

    return [dayNames[mostProductiveDayIndex], highestConsumption];
}
