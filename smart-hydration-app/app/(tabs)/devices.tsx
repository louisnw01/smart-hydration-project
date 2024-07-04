import PageWrapper from "@/components/common/page-wrapper";
import { RefreshControl, ScrollView, View } from "react-native";
import { useAtomValue } from "jotai";
import { getJugDataQAtom } from "@/atom/query";
import DeviceRow from "@/components/devices/device-row";
import { useState } from "react";
import StyledButton from "@/components/common/button";
import Loading from "@/components/common/loading";

export default function DevicesPage() {
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
        <PageWrapper>
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                    />
                }
            >
                <View className="mt-8 flex gap-6">
                    <Loading
                        isLoading={isLoading}
                        message="Getting your jugs.."
                    />

                    {data &&
                        data.map((device, idx) => (
                            <DeviceRow key={idx} device={device} />
                        ))}

                    <View className="flex flex-row justify-center">
                        <StyledButton
                            text="+ add a new device"
                            href="add-device-modal"
                        />
                    </View>
                </View>
            </ScrollView>
        </PageWrapper>
    );
}
