import PageWrapper from "@/components/common/page-wrapper";
import HydrationPercentage from "@/components/hydration-pct";
import HydrationStatus from "@/components/hydration-status";
import { useAtomValue, useSetAtom } from "jotai";
import Droplet from "@/components/droplet";
import {
    View,
    RefreshControl,
    ScrollView,
} from "react-native";
import StyledButton from "@/components/common/button";
import { getTodaysIntakeAtom } from "@/atom/query";
import { useState } from "react";
import { hydrationAtom } from "@/atom/hydration";

export default function HomePage() {
    const { isLoading, refetch } = useAtomValue(getTodaysIntakeAtom);
    const [refreshing, setRefreshing] = useState(false);
    const setHydration = useSetAtom(hydrationAtom);
    var total_intake;

    const handleRefresh = async () => {
        setRefreshing(true);
        total_intake = (await refetch()).data;
        setHydration((total_intake as number) / 2000);
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
                <View className="flex flex-1 justify-evenly pt-3 h-full items-center">
                    <HydrationPercentage />
                    <Droplet />

                    <HydrationStatus />
                    <StyledButton
                        text="+ add a drink"
                        textSize="xl"
                        href="home"
                    />
                </View>
            </ScrollView>
        </PageWrapper>
    );
}
