import PageHeading from "@/components/common/page-heading";
import PageWrapper from "@/components/common/page-wrapper";
import {
    ActivityIndicator,
    Pressable,
    RefreshControl,
    ScrollView,
    Text,
    View,
} from "react-native";
import { useSetAtom, useAtomValue, useAtom } from "jotai";
import { popupPageAtom } from "@/atom/nav";
import { getJugDataQAtom } from "@/atom/query";
import DeviceRow from "@/components/devices/device-row";
import { useState } from "react";
import StyledButton from "@/components/common/button";
import MVPAddDeviceModal from "@/components/devices/mvp-add-device-modal";

export default function DevicesPage() {
    const [popup, setPopup] = useAtom(popupPageAtom);
    const [refreshing, setRefreshing] = useState(false);
    const { data, isLoading, refetch } = useAtomValue(getJugDataQAtom);

    const handleRefresh = () => {
        setRefreshing(true);
        refetch();
    };

    if (!isLoading && refreshing) {
        setRefreshing(false);
    }

    return (
        <PageWrapper>
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                    />
                }
            >
                <PageHeading text="Devices">
                    <Text
                        className="text-3xl font-semibold"
                        onPress={() => setPopup("devices")}
                    >
                        +
                    </Text>
                </PageHeading>

                <View className="mt-16 flex gap-6">
                    {isLoading && (
                        <View>
                            <ActivityIndicator className="justify-center top-2/4" />
                            <Text className="mt-16 flex justify-center text-center">
                                Getting your jugs...
                            </Text>
                        </View>
                    )}

                    {data &&
                        data.map((device, idx) => (
                            <DeviceRow key={idx} device={device} />
                        ))}

                    <View className="flex flex-row justify-center">
                        <StyledButton
                            text="+ add a new device"
                            onPress={() => setPopup("devices")}
                        />
                    </View>
                </View>
            </ScrollView>
            <>{popup === "devices" && <MVPAddDeviceModal />}</>
        </PageWrapper>
    );
}
