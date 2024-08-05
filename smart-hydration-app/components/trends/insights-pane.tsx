import { ReactNode } from "react";
import { Text, View } from "react-native";

export default function InsightsPane({
    children,
    heading,
}: {
    children: ReactNode;
    heading: string;
}) {
    return (
        <View className="bg-white flex dark:bg-neutral-800 rounded-2xl px-6 py-4">
            <View className="flex flex-col justify-between">
                <Text className="font-semibold dark:text-white">{heading}</Text>
                <View className="w-full h-[1px] bg-gray-200 my-4 dark:bg-neutral-700" />
                {children}
            </View>
        </View>
    );
}
