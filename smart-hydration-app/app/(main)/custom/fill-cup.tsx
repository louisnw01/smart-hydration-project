import { isMeasuringNewCupSizeAtom, selectedDeviceAtom } from "@/atom/device";
import { userHasJugsAtom } from "@/atom/hydration";
import StyledButton from "@/components/common/button";
import DeviceRow from "@/components/devices/device-row";
import DeviceSection from "@/components/devices/device-section";
import { router } from "expo-router";
import { useAtomValue, useSetAtom } from "jotai";
import { View, Text } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function ExtraInformation({ text, className }) {
    return (
        <View
            className={`items-center flex-row bg-yellow-400 gap-3 px-4 py-3 rounded-lg ${className}`}
        >
            <AntDesign name="warning" size={20} color="black" />
            <Text className="text-md pr-6">{text}</Text>
        </View>
    );
}

export default function AskIfJugIsEmptyOrNot() {
    const insets = useSafeAreaInsets();
    const device = useAtomValue(selectedDeviceAtom);
    const setIsMeasuring = useSetAtom(isMeasuringNewCupSizeAtom);

    return (
        <View className="mx-6 gap-16 mt-20 h-full">
            <Text className="text-xl font-bold dark:text-white">
                Now, fill your new cup to a normal level, using the jug named "
                {device.name}".
            </Text>
            <DeviceRow device={device} onPress={() => {}} />

            <ExtraInformation
                text="If the jug does not contain enough water to fill up the cup, please
                    refill it before pouring."
                className=""
            />

            <StyledButton
                icon=<AntDesign
                    name="checkcircle"
                    size={21}
                    color="white"
                    right={4}
                />
                text="I have filled up the cup"
                textClass="text-lg font-bold"
                buttonClass="self-center bg-green absolute items-center"
                style={{ bottom: insets.bottom + 100 }}
                onPress={() => {
                    setIsMeasuring(device.id);
                    router.push("custom/finished-wait");
                }}
            />
        </View>
    );
}
