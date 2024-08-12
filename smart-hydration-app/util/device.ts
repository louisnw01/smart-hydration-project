export default function getStalenessMessage(staleness: number) {
    switch (staleness) {
        case 2:
            return "Very stale";
        case 1:
            return "Nearly stale";
        case 0:
            return "The water in this jug is nice and fresh! You do not have to change it for now.";
        default:
            return "No staleness data";
    }
}
