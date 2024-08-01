import { selectedJugIdAtom } from "@/atom/device";
import PageWrapper from "@/components/common/page-wrapper";
import DeviceSection from "@/components/devices/device-section";
import { router } from "expo-router";
import { useAtomValue, useSetAtom } from "jotai";
import { getJugDataQAtom } from "@/atom/query";
import { getCommunityJugDataQAtom } from "@/atom/community";
import { Text, View, ScrollView } from "react-native";
import { userHasCommunityAtom } from "@/atom/query/community";

export default function DevicesPage() {
    const setJugId = useSetAtom(selectedJugIdAtom);
    const isInCommunity = useAtomValue(userHasCommunityAtom);

    return (
        <PageWrapper className="mx-6 mt-6">
            <ScrollView>
                <View>
                    <DeviceSection
                        addJugButton
                        queryAtom={getJugDataQAtom}
                        onPress={(device) => {
                            setJugId(device.id);
                            router.push("device-info-modal");
                        }}
                    />
                    {isInCommunity && (
                        <View className="flex">
                            <Text className="text-2xl font-semibold py-4">
                                Community Jugs
                            </Text>
                            <DeviceSection
                                queryAtom={getCommunityJugDataQAtom}
                                onPress={(device) => {
                                    setJugId(device.id);
                                    router.push("device-info-modal");
                                }}
                            />
                        </View>
                    )}
                </View>
            </ScrollView>
        </PageWrapper>
    );
}
