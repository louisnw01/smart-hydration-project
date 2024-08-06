import useSettings from "@/app/hooks/user";
import Jug from "@/assets/svgs/jug.svg";
import { hydrationInsightsEAtom } from "@/atom/effect/hydration";
import { userHasJugsAtom } from "@/atom/hydration";
import { getHydrationQAtom } from "@/atom/query";
import StyledButton from "@/components/common/button";
import PageWrapper from "@/components/common/page-wrapper";
import HydrationStatus from "@/components/home/hydration-status";
import HydrationProgress from "@/components/home/progress";
import useColorPalette from "@/util/palette";
import { useQueryRefetch } from "@/util/query-refetch";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useAtomValue } from "jotai";
import { useEffect } from "react";
import { RefreshControl, ScrollView, View } from "react-native";

export default function HomePage() {
    useAtomValue(hydrationInsightsEAtom);
    const palette = useColorPalette();
    const { hasJugs, isLoading } = useAtomValue(userHasJugsAtom);

    const { isRefreshing, handleRefresh } = useQueryRefetch(getHydrationQAtom);
    const { isCarer } = useSettings();

    useEffect(() => {
        isCarer && router.replace("(tabs)/community");
    }, [])

    return (
        <PageWrapper
            isLoading={isLoading}
            message="Loading your information..."
        >
            <ScrollView
                contentContainerClassName="flex-1 h-full items-center gap-20 mt-16"
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={handleRefresh}
                    />
                }
            >
                <HydrationProgress />
                <HydrationStatus />
                {!hasJugs && (
                    <StyledButton
                        text="add a new jug"
                        href="devices"
                        buttonClass="self-center mt-8"
                        textClass="text-lg mt-[1px]"
                        icon={
                            <View className="flex flex-row w-6">
                                <Jug width={16} fill={palette.fg} />
                                <View className="aboslute top-[13px] right-[9px] w-[8px] h-[8px] rounded-xl bg-gray-200 dark:bg-black" />
                                <FontAwesome
                                    name="plus-circle"
                                    size={12}
                                    left={-16}
                                    top={12}
                                    color={palette.fg}
                                />
                            </View>
                        }
                    />
                )}
                <StyledButton
                    text="add a drink"
                    textClass="text-lg mt-[1px]"
                    onPress={() => router.push("custom/add-drink-modal")}
                    icon=<MaterialCommunityIcons
                        name="water-plus-outline"
                        size={24}
                        color={palette.fg}
                    />
                />
            </ScrollView>
        </PageWrapper>
    );
}
