import PageWrapper from "@/components/common/page-wrapper";
import HydrationPercentage from "@/components/home/hydration-pct";
import HydrationStatus from "@/components/home/hydration-status";
import { useAtomValue, useSetAtom } from "jotai";
import Droplet from "@/components/home/droplet";
import { View, RefreshControl, ScrollView, Text } from "react-native";
import { getHydrationQAtom, getJugDataQAtom } from "@/atom/query";
import { useEffect, useState } from "react";

import StyledButton from "@/components/common/button";
import { amountDrankTodayAtom, userHasJugsAtom } from "@/atom/hydration";
import Loading from "@/components/common/loading";
import { hydrationInsightsEAtom } from "@/atom/effect/hydration";
import WaterScreen from "@/components/home/water-screen";

export default function HomePage() {
    useAtomValue(hydrationInsightsEAtom);
    const { hasJugs, isLoading } = useAtomValue(userHasJugsAtom);

    const { refetch } = useAtomValue(getHydrationQAtom);

    const amountDrankToday = useAtomValue(amountDrankTodayAtom);

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
            {/* <PageHeading text="smart hydration">
                <SettingsButton />
            </PageHeading> */}
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
                        {!hasJugs ? (
                            <Text>You haven't linked any jugs yet.</Text>
                        ) : (
                            <>
                                <WaterScreen />
                                <HydrationPercentage />
                                {/* <Droplet /> */}

                                <HydrationStatus />
                                <StyledButton
                                    // text="+ add a drink"
                                    textSize="xl"
                                    href="index"
                                />
                            </>
                        )}
                    </View>
                )}
            </ScrollView>
        </PageWrapper>
    );
}
