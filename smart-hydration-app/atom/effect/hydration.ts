import { atomEffect } from "jotai-effect";
import { getHydrationQAtom } from "../query";
import {
    getAllAggregates,
    getAmountDrankToday,
    getAvgAmountDrankByNow,
    getMostHydratedDayOfWeek,
} from "@/util/trends";
import { MS_DAY } from "@/constants/data";
import {
    amountDrankTodayAtom,
    avgAmountDrankByTimeNowAtom,
    avgAmountDrankLastMonthAtom,
    avgAmountDrankThisMonthAtom,
    mostHydratedDayOfWeekAtom,
} from "../hydration";

export const hydrationInsightsEAtom = atomEffect((get, set) => {
    const { data, isLoading } = get(getHydrationQAtom);

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
