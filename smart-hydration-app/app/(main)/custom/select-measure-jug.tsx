import { selectedDeviceAtom, selectedJugIdAtom } from "@/atom/device";
import { userHasJugsAtom } from "@/atom/hydration";
import StyledButton from "@/components/common/button";
import DeviceSection from "@/components/devices/device-section";
import { router } from "expo-router";
import { useAtomValue, useSetAtom } from "jotai";
import { View, Text } from "react-native";

export default function AddCupSizeInMls() {
    const setJugId = useSetAtom(selectedJugIdAtom);

    return (
        <View className="mx-6 mt-20 h-full">
            <Text className="text-xl font-bold dark:text-white mb-10">
                Which jug would you like to measure this cup with?
            </Text>

            <DeviceSection
                onPress={(device) => {
                    setJugId(device.id);
                    router.push("custom/fill-cup");
                }}
            />
        </View>
    );
}
