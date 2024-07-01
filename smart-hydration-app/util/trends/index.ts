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

  let delta;
  switch (type) {
    case "W":
      delta = new Date(new Date().getTime() - MS_WEEK);
      break;
    case "D":
      delta = new Date(new Date().getTime() - MS_DAY);
      break;
    case "Y":
      delta = new Date(new Date().getTime() - MS_YEAR);
      break;
    case "M":
      delta = new Date(new Date().getTime() - MS_MONTH);
      break;
    default:
      delta = new Date();
  }

  const aggs: Map<number, {}> = new Map();

  for (const row of data) {
    const roundedTime =
      Math.floor((row.time * 1000) / timeWindowMap[type]) * timeWindowMap[type];

    if (roundedTime < delta.getTime()) continue;

    if (aggs.has(roundedTime)) {
      const existing = aggs.get(roundedTime);
      existing.y += row.value;
    } else {
      aggs.set(roundedTime, { x: roundedTime, y: row.value });
    }
  }

  const arr = Array.from(aggs.values());
  arr.sort((a, b) => a.x - b.x);
  return arr;
}

export const formattedDataAtom = atom<any[] | null>(null);

export const formattedDataEAtom = atomEffect((get, set) => {
  const type = get(chartTimeWindowAtom);
  const { data, isLoading, isError } = get(getHydrationAtom);
  if (isLoading || !data) {
    set(formattedDataAtom, []);
    return;
  }
  const formattedData = getAggregates(data, type);

  set(
    formattedDataAtom,
    formattedData.map((row) => ({
      x: new Date(row.x),
      y: row.y,
    })),
  );
});

export interface FormattedData {
  x: number;
  y: number;
}

function avgOfNumberList(list: number[]) {
  return list.reduce((curr, num) => curr + num, 0) / list.length;
}

export function averageDailyHydrationComparison(data: FormattedData[]) {
  let howMuchWaterDrankToday = 0;

  const timeNow = new Date().getHours() + new Date().getMinutes() / 60;

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
    thisMonthData.reduce((curr, row) => curr + row.y, 0) / thisMonthData.length;
  const prevMonthAvg =
    prevMonthData.reduce((curr, row) => curr + row.y, 0) / prevMonthData.length;

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
  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  return dayNames[mostProductiveDayIndex];
}
