import { MS_DAY } from "@/constants/data";
import {
    getAllAggregates,
    getAvgAmountDrankByNow,
    getMostHydratedDayOfWeek,
} from "@/util/trends";
import { atomEffect } from "jotai-effect";
import {
    avgAmountDrankByTimeNowAtom,
    avgAmountDrankLastMonthAtom,
    avgAmountDrankThisMonthAtom,
    mostHydratedDayOfWeekAtom,
} from "../hydration";
import { getHydrationQAtom } from "../query";
import { unitConverter, unitsAtom } from "../user";

export const hydrationInsightsEAtom = atomEffect((get, set) => {
    const { data, isLoading } = get(getHydrationQAtom);

    if (isLoading || !data) return;
    const unit = get(unitsAtom);
    const convertedData = data.map((row) => ({time:row.time, value:unitConverter(row.value, unit)}))

    const dailyAggregates = getAllAggregates(convertedData, MS_DAY);

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
        convertedData,
        MS_DAY,
        (row) => row.time * 1000 >= startOfMonthMS,
    );

    const dailyAggregatesLastMonth = getAllAggregates(
        convertedData,
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
