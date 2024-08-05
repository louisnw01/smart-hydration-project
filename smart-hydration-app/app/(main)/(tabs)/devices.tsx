import { selectedJugIdAtom } from "@/atom/device";
import {
    getCommunityJugDataQAtom,
    getJugDataQAtom,
    userHasCommunityAtom,
} from "@/atom/query";
import PageWrapper from "@/components/common/page-wrapper";
import DeviceSection from "@/components/devices/device-section";
import { router } from "expo-router";
import { useAtomValue, useSetAtom } from "jotai";
import { ScrollView, Text, View } from "react-native";

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
