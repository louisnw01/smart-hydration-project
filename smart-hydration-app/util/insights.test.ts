import {MS_DAY, MS_HOUR, MS_MONTH} from "@/constants/data";
import {
    averageHydrationMonthComparison,
    getAmountDrankToday, getAvgAmountDrankByNow,
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
    test("get amount drank today", () => {
        const aggs = [];
        const todayStartMS = Math.floor(Date.now() / MS_DAY) * MS_DAY;

        // create days with same value for average to come out nicely
        for (let i = 0; i < 7; i++) {
            const newTS = todayStartMS - i * MS_HOUR;
            const day = new Date(newTS).getDay();
            aggs.push({
                time: todayStartMS + i * MS_HOUR,
                value: 500,
            });

        }
        aggs[6].value = 700;
        console.log(aggs);
        const amount = getAmountDrankToday(aggs);
        expect(amount).toEqual(3700);
    })
    test("average amount of water to a certain point in the day", () => {
        const aggs = [];
        const todayStartMS = Math.floor(Date.now() / MS_DAY) * MS_DAY;
        const yesterdayStartMS = (Math.floor(Date.now() / MS_DAY) * MS_DAY) - MS_DAY;

        // create days with same value for average to come out nicely
        for (let i = 0; i < 7; i++) {
            const newTS = todayStartMS + i * MS_HOUR;
            const day = new Date(newTS).getDay();
            aggs.push({
                time: todayStartMS + i * MS_HOUR,
                value: 500,
            });
        }
        for (let i = 0; i < 7; i++) {
            const newTS = yesterdayStartMS + i * MS_HOUR;
            const day = new Date(newTS).getDay();
            aggs.push({
                time: yesterdayStartMS + i * MS_HOUR,
                value: 500,
            });
        }
        const amount = getAvgAmountDrankByNow(aggs);
        expect(amount).toEqual(500);
    })
    test("average hydration month comparison", () => {
        const testData = [];
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

        for (let i = 0; i < 31; i++) {
            const newTS = startOfMonth + i * MS_DAY;
            const day = new Date(newTS).getDay();
            testData.push({
                x: newTS,
                y: 1500,
            })
        }
        for (let i = 0; i < 31; i++) {
            const newTS = startOfPrevMonth + i * MS_DAY;
            const day = new Date(newTS).getDay();
            testData.push({
                x: newTS,
                y: 2000,
            })
        }
        for (let row of testData) {
            console.log(new Date(row.x).getMonth());
        }
        const [firstAvg, nextAvg] = averageHydrationMonthComparison(testData)
        expect(firstAvg).toEqual(1500);
        expect(nextAvg).toEqual(2000);
    })
});
