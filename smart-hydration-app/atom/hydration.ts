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
