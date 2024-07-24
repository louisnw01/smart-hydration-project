import PageWrapper from "@/components/common/page-wrapper";
import HydrationPercentage from "@/components/home/hydration-pct";
import HydrationStatus from "@/components/home/hydration-status";
import { useAtomValue } from "jotai";
import { View, RefreshControl, ScrollView } from "react-native";
import { getHydrationQAtom } from "@/atom/query";
import { useState } from "react";
import Jug from "@/assets/svgs/jug.svg";

import StyledButton from "@/components/common/button";
import { userHasJugsAtom } from "@/atom/hydration";
import Loading from "@/components/common/loading";
import { hydrationInsightsEAtom } from "@/atom/effect/hydration";
import WaterScreen from "@/components/home/water-screen";
import { MaterialCommunityIcons, FontAwesome } from "@expo/vector-icons";
import useColorPalette from "@/util/palette";

export default function HomePage() {
    useAtomValue(hydrationInsightsEAtom);
    const palette = useColorPalette();
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
                                text="add a new jug"
                                href="devices"
                                buttonClass="self-center mt-8"
                                textClass="text-lg mt-[1px]"
                                icon={<View className="flex flex-row w-6">
                                    <Jug width={16} fill={palette.fg} />
                                    <View className="aboslute top-[13px] right-[9px] w-[8px] h-[8px] rounded-xl bg-gray-200 dark:bg-black" />
                                    <FontAwesome
                                        name="plus-circle"
                                        size={12}
                                        left={-16}
                                        top={12}
                                        color={palette.fg} />
                                </View>}                      
                            />
                        )}
                        <StyledButton
                            text="add a drink"
                            textClass="text-lg mt-[1px]"
                            href="add-drink-modal"
                            icon=<MaterialCommunityIcons
                                name="water-plus-outline"
                                size={24}
                                color={palette.fg} 
                        />                    
                        />
                    </View>
                )}
            </ScrollView>
        </PageWrapper>
    );
}
