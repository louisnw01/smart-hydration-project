import { selectedDeviceAtom } from "@/atom/device";
import { userHasJugsAtom } from "@/atom/hydration";
import StyledButton from "@/components/common/button";
import DeviceRow from "@/components/devices/device-row";
import DeviceSection from "@/components/devices/device-section";
import { router } from "expo-router";
import { useAtomValue } from "jotai";
import { View, Text } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function FinishedWait() {
    const insets = useSafeAreaInsets();
    const device = useAtomValue(selectedDeviceAtom);
    return (
        <View className="mx-6 gap-16 mt-20 h-full">
            <Text className="text-xl font-bold dark:text-white text-center">
                All done!
            </Text>
            <Text className="font-medium dark:text-white text-center">
                We will let you know when your measurement has completed. For
                now, you can continue to use the app as normal.
            </Text>
            <StyledButton
                text="Take me home"
                textClass="text-lg font-semibold"
                buttonClass="bg-blue self-center"
                onPress={() => router.replace("(tabs)")}
            />
        </View>
    );
}
