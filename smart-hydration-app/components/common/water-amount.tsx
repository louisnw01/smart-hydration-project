import { View, Text } from "react-native";

export default function WaterAmount({ value, unit }) {

    if(value === null || value === undefined) {
        return null;
    }
    unit = unit || "ml";
    return (
        <View className="flex flex-row items-end">
            <Text className="font-bold text-4xl tabular-nums dark:text-white">
                {value.toFixed(0)}
            </Text>
            <Text className="font-bold text-xl pb-[1px] dark:text-white">
                {unit}
            </Text>
        </View>
    );
}
