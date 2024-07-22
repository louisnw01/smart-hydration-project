import PageWrapper from "@/components/common/page-wrapper";
import HydrationPercentage from "@/components/home/hydration-pct";
import HydrationStatus from "@/components/home/hydration-status";
import { useAtomValue } from "jotai";
import { View, RefreshControl, ScrollView, Text } from "react-native";
import {getHydrationQAtom, getUserTargetQAtom, updateUserTarget} from "@/atom/query";
import { useState } from "react";

import StyledButton from "@/components/common/button";
import { userHasJugsAtom } from "@/atom/hydration";
import Loading from "@/components/common/loading";
import { hydrationInsightsEAtom } from "@/atom/effect/hydration";
import WaterScreen from "@/components/home/water-screen";

export default function HomePage() {
    useAtomValue(hydrationInsightsEAtom);
    const { hasJugs, isLoading } = useAtomValue(userHasJugsAtom);

    const { refetch } = useAtomValue(getHydrationQAtom);
    const [refreshing, setRefreshing] = useState(false);

    const handleRefresh = async () => {
        setRefreshing(true);
        refetch();
    };

    if (!isLoading && refreshing) {
        setRefreshing(false);
    }

    return (
        <PageWrapper>
            <ScrollView
                contentContainerStyle={{ flex: 1 }}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => handleRefresh()}
                    />
                }
            >
                <Loading
                    isLoading={isLoading}
                    message="Loading your information..."
                />
                {!isLoading && (
                    <View className="flex flex-1 justify-evenly pt-3 h-full items-center dark:text-white">
                        <WaterScreen />
                        <HydrationPercentage />
                        <HydrationStatus />
                        {!hasJugs && (
                            <StyledButton
                                text="+ add a device"
                                textSize="xl"
                                href="devices"
                            />
                        )}
                        <StyledButton
                            text="+ add a drink"
                            textSize="xl"
                            href="add-drink-modal"
                        />
                    </View>
                )}
            </ScrollView>
        </PageWrapper>
    );
}
