import PageWrapper from "@/components/common/page-wrapper";
import { RefreshControl, ScrollView, View } from "react-native";
import { useAtomValue, useSetAtom } from "jotai";
import { getJugDataQAtom } from "@/atom/query";
import DeviceRow from "@/components/devices/device-row";
import { useState } from "react";
import StyledButton from "@/components/common/button";
import Loading from "@/components/common/loading";
import Jug from "@/assets/svgs/jug.svg";
import useColorPalette from "@/util/palette";
import { FontAwesome } from "@expo/vector-icons";
import { authTokenAtom } from "@/atom/user";
import DeviceSection from "@/components/devices/device-section";
import { selectedDeviceAtom, selectedJugIdAtom } from "@/atom/device";
import { router } from "expo-router";

export default function DevicesPage() {
    const setJugId = useSetAtom(selectedJugIdAtom);
    const { data, isLoading, refetch } = useAtomValue(getJugDataQAtom);
    const [refreshing, setRefreshing] = useState(false);

    const handleRefresh = () => {
        setRefreshing(true);
        refetch();
    };

    if (!isLoading && refreshing) {
        setRefreshing(false);
    }

    return (
        <View className="mt-8 flex gap-6 h-full mx-6">
            <DeviceSection
                addJugButton
                onPress={(device) => {
                    setJugId(device.id);
                    router.push("device-info-modal");
                }}
            />
        </View>
    );
}
