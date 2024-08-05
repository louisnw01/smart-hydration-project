import { Text, View } from "react-native";

function getSize(size: "md" | undefined) {
    switch (size) {
        case "md":
            return ["2xl", "lg"];
        default:
            return ["4xl", "xl"];
    }
}

export default function WaterAmount({
    value,
    unit,
    size,
}: {
    value: number;
    unit?: string;
    size?: "md";
}) {
    if (value == null || value == undefined) return null;
    unit = unit || "ml";

    const [waterSize, unitSize] = getSize(size);

    return (
        <View className="flex flex-row items-end">
            <Text
                className={`font-${!size ? "" : "semi"}bold text-${waterSize} tabular-nums dark:text-white`}
            >
                {value.toFixed(0)}
            </Text>
            <Text
                className={`font-bold text-${unitSize} ${!size ? "pb-[1px]" : ""} dark:text-white`}
            >
                {unit}
            </Text>
        </View>
    );
}
