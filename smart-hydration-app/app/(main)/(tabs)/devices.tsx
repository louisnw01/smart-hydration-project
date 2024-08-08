import { selectedDeviceAtom } from "@/atom/device";
import {
    getCommunityJugDataQAtom,
    getJugDataQAtom,
    userHasCommunityAtom,
} from "@/atom/query";

import PageWrapper from "@/components/common/page-wrapper";
import DeviceSection from "@/components/devices/device-section";
import { router } from "expo-router";
import { atom, useAtomValue, useSetAtom } from "jotai";
import { View } from "react-native";

const communityAndUserJugDataQAtom = atom((get) => {
    const { data, isLoading, isFetching, refetch } = get(getJugDataQAtom);
    const {
        data: communityData,
        isLoading: communityIsLoading,
        isFetching: communityIsFetching,
        refetch: communityRefetch,
    } = get(getCommunityJugDataQAtom);

    const refetchBoth = () => {
        refetch();
        communityRefetch();
    };

    let combinedData = [];
    if (data || communityData) {
        combinedData = [];
    }
    if (data) {
        combinedData.push(...data);
    }
    if (communityData) {
        combinedData.push(...communityData);
    }

    console.log(!!data, !!communityData);

    return {
        data: combinedData,
        isLoading: isLoading && communityIsLoading,
        isFetching: isFetching && communityIsFetching,
        refetch: refetchBoth,
    };
});

export default function DevicesPage() {
    const setJug = useSetAtom(selectedDeviceAtom);
    const isInCommunity = useAtomValue(userHasCommunityAtom);

    return (
        <PageWrapper className="mx-6 mt-6">
            {/* <ScrollView> */}
            <View className="flex-1">
                <DeviceSection
                    addJugButton
                    queryAtom={getJugDataQAtom}
                    onPress={(device) => {
                        setJug(device);
                        router.push("device-info-modal");
                    }}
                />
                {/* {isInCommunity && (
                        <View className="flex">
                            <Text className="text-2xl font-semibold py-4 dark:text-white">
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
                    )} */}
            </View>
            {/* </ScrollView> */}
        </PageWrapper>
    );
}
