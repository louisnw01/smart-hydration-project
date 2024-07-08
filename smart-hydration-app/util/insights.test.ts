import { MS_DAY } from "@/constants/data";
import {
    getFloorOf,
    getMostHydratedDayOfWeek,
    getTodaysStartMS,
} from "./trends";

describe("insights", () => {
    test("highest day of week", () => {
        const todayMS = getFloorOf(new Date(2024, 7, 8).getTime(), MS_DAY);

        const aggs = [];
        for (let i = 0; i < 10; i++) {
            const newTS = todayMS - i * MS_DAY;
            const day = new Date(newTS).getDay();

            let value = 10 * i + 1;
            if (day == 1) {
                value = value * 100;
            }

            aggs.push({
                time: todayMS - i * MS_DAY,
                value: value,
                day: day,
            });
        }

        const { name, value } = getMostHydratedDayOfWeek(aggs);

        expect(name).toEqual("Monday");

        // an array of daily aggs

        // expect(val1).toEqual();
    });
});
