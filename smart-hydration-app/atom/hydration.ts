import { getAmountDrankToday } from "@/util/trends";
import { atom, useAtomValue } from "jotai";
import { getHydrationQAtom, getJugDataQAtom } from "./query";
import { unitConverter, unitsAtom } from "./user";

export const amountDrankTodayAtom = atom((get) => {
    const { data, isLoading } = get(getHydrationQAtom);
    if (!data || isLoading) return 0;
    const unit = get(unitsAtom);
    return unitConverter(getAmountDrankToday(data), unit) || 0;
});
export const avgAmountDrankByTimeNowAtom = atom<number | null>(null);

export const avgAmountDrankThisMonthAtom = atom<number | null>(null);
export const avgAmountDrankLastMonthAtom = atom<number | null>(null);
export const mostHydratedDayOfWeekAtom = atom<{} | null>({});

export const userHasJugsAtom = atom((get) => {
    const { data, isLoading } = get(getJugDataQAtom);
    return { isLoading, hasJugs: data && data.length > 0 };
});
