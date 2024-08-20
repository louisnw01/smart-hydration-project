import { selectedDeviceAtom } from "@/atom/device";
import { getJugDataQAtom } from "@/atom/query";
import DeviceSection from "@/components/devices/device-section";
import { router, useLocalSearchParams } from "expo-router";
import { atom, useSetAtom } from "jotai";
import { Text, View } from "react-native";

export const jugIdForCustomCupAtom = atom<string | null>(null);

export default function AddCupSizeInMls() {
    const setJug = useSetAtom(selectedDeviceAtom);
    const params = useLocalSearchParams();
    const setJugIdForCustomCup = useSetAtom(jugIdForCustomCupAtom);

    setJugIdForCustomCup(params.id);

    return (
        <View className="mx-6 mt-20 h-full">
            <Text className="text-xl font-bold dark:text-white mb-10">
                Which jug would you like to measure this cup with?
            </Text>

            <DeviceSection
                queryAtom={getJugDataQAtom}
                onPress={(device) => {
                    setJug(device);
                    router.push("custom/fill-cup");
                }}
                queryAtom={getJugDataQAtom}
            />
        </View>
    );
}
