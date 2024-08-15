import { selectedDeviceAtom } from "@/atom/device";
import { getJugDataQAtom } from "@/atom/query";

import PageWrapper from "@/components/common/page-wrapper";
import DeviceSection from "@/components/devices/device-section";
import { router } from "expo-router";
import { useSetAtom } from "jotai";
import { View } from "react-native";

export default function DevicesPage() {
    const setJug = useSetAtom(selectedDeviceAtom);

    return (
        <PageWrapper className="mx-6 mt-6">
            <View className="flex-1">
                <DeviceSection
                    addJugButton
                    queryAtom={getJugDataQAtom}
                    onPress={(device) => {
                        setJug(device);
                        router.push("device-info-modal");
                    }}
                />
            </View>
        </PageWrapper>
    );
}
