import { Timeframe } from "@/interfaces/data";
import { atom } from "jotai";

export const chartTimeWindowAtom = atom<Timeframe>(Timeframe.W);
