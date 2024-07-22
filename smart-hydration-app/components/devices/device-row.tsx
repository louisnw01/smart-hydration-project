import colors from "@/colors";
import { DeviceInfo } from "@/interfaces/device";
import { ReactNode } from "react";
import { View, Text, Pressable } from "react-native";
import { useSetAtom } from "jotai";
import { useRouter } from "expo-router";
import { selectedDeviceAtom, selectedJugIdAtom } from "@/atom/device";

export default function DeviceRow({
    device,
    onPress,
}: {
    device: DeviceInfo;
    onPress: Function;
}) {
    const percentFull = (device.water_level / device.capacity) * 100;
    const isStale = false;
    return (
        <Pressable
            className="bg-gray-200 px-7 py-4 flex flex-row justify-between rounded-xl dark:bg-neutral-800"
            onPress={() => onPress(device)}
        >
            <View className="flex">
                <Text className="text-xl font-bold dark:text-white">
                    {device.name}
                </Text>
                <View className="flex-row gap-3">
                    <Text className="dark:text-white">connected</Text>
                    <BatteryIndicator charge={device.battery} />
                </View>
            </View>
            <View className="flex justify-evenly">
                <EndText>
                    {percentFull.toFixed(0)}% full ({device.water_level}ml)
                </EndText>
                <EndText className="text-red-500">
                    {isStale && "water is stale"}
                </EndText>
            </View>
        </Pressable>
    );
}

function EndText({
    children,
    className,
}: {
    children: ReactNode;
    className?: string;
}) {
    const style =
        "font-semibold text-right dark:text-white " + (className ?? "");
    return <Text className={style}>{children}</Text>;
}

function BatteryIndicator({ charge }: { charge: number }) {
    const scaledCharge = (charge / 5) * 100;

    return (
        <View className="flex-row h-full gap-2">
            <View
                className="absolute h-3 my-1 rounded-md"
                style={{
                    width: scaledCharge,
                    backgroundColor: charge >= 0.3 ? colors.green : colors.red,
                }}
            />
            <View className="w-6 h-3 my-1 border rounded-md dark:border-gray-200" />
            <Text className="dark:text-white">
                {(charge * 100).toFixed(0)}%
            </Text>
        </View>
    );
}
