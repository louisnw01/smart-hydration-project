export default function getStalenessMessage(staleness: number) {
    switch (staleness) {
        case 2:
            return "The water in this jug is very stale. Please change the water as soon as possible.";
        case 1:
            return "The water in this jug is fine for now, but will soon become stale. Please consider changing the water.";
        case 0:
            return "The water in this jug is nice and fresh! You do not have to change it for now.";
        default:
            return "No staleness data";
    }
}
