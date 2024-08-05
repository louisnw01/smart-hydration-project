import { getAmountDrankToday } from "@/util/trends";
import { atom } from "jotai";
import { getHydrationQAtom, getJugDataQAtom } from "./query";

export const amountDrankTodayAtom = atom((get) => {
    const { data, isLoading } = get(getHydrationQAtom);
    if (!data || isLoading) return 0;
    return getAmountDrankToday(data) || 0;
});
export const avgAmountDrankByTimeNowAtom = atom<number>(NaN);

export const avgAmountDrankThisMonthAtom = atom<number>(NaN);
export const avgAmountDrankLastMonthAtom = atom<number>(NaN);
export const mostHydratedDayOfWeekAtom = atom<{
    name: string;
    value: number;
}>({ name: "", value: 0 });

export const userHasJugsAtom = atom((get) => {
    const { data, isLoading } = get(getJugDataQAtom);
    return { isLoading, hasJugs: data && data.length > 0 };
});
