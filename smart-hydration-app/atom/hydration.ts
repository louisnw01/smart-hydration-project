import { getAmountDrankToday } from "@/util/trends";
import { atom } from "jotai";
import { getHydrationQAtom, getJugDataQAtom } from "./query";

export const amountDrankTodayAtom = atom((get) => {
    const { data, isLoading } = get(getHydrationQAtom);
    if (!data || isLoading) return 0;
    return getAmountDrankToday(data) || 0;
});
export const avgAmountDrankByTimeNowAtom = atom<number | null>(null);

export const avgAmountDrankThisMonthAtom = atom<number | null>(null);
export const avgAmountDrankLastMonthAtom = atom<number | null>(null);
export const mostHydratedDayOfWeekAtom = atom<{} | null>({});

export const userHasJugsAtom = atom((get) => {
    const { data, isLoading } = get(getJugDataQAtom);
    return { isLoading, hasJugs: data && data.length > 0 };
});
