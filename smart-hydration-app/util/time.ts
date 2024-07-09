export function getMonthName(date: Date) {
    return date.toLocaleString("default", { month: "long" });
}
