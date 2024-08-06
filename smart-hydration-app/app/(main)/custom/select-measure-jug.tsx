import { selectedJugIdAtom } from "@/atom/device";
import { getJugDataQAtom } from "@/atom/query";
import DeviceSection from "@/components/devices/device-section";
import { router } from "expo-router";
import { useSetAtom } from "jotai";
import { Text, View } from "react-native";

export default function AddCupSizeInMls() {
    const setJugId = useSetAtom(selectedJugIdAtom);

    return (
        <View className="mx-6 mt-20 h-full">
            <Text className="text-xl font-bold dark:text-white mb-10">
                Which jug would you like to measure this cup with?
            </Text>

            <DeviceSection
                queryAtom={getJugDataQAtom}
                onPress={(device) => {
                    setJugId(device.id);
                    router.push("custom/fill-cup");
                }}
            />
        </View>
    );
}
