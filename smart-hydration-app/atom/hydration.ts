import { atom, useAtomValue } from "jotai";
import { getHydrationQAtom, getJugDataQAtom } from "./query";

export const amountDrankTodayAtom = atom<number | null>(null);
export const avgAmountDrankByTimeNowAtom = atom<number | null>(null);

export const avgAmountDrankThisMonthAtom = atom<number | null>(null);
export const avgAmountDrankLastMonthAtom = atom<number | null>(null);
export const mostHydratedDayOfWeekAtom = atom<{} | null>({});

export const userHasJugsAtom = atom((get) => {
    const { data, isLoading } = get(getJugDataQAtom);
    return { isLoading, hasJugs: data && data.length > 0 };
});
