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
import { Redirect, router } from "expo-router";
import { useAtomValue } from "jotai";
import { Dimensions } from "react-native";
import { RefreshControl, ScrollView, View } from "react-native";

export default function HomePage() {
    useAtomValue(hydrationInsightsEAtom);
    const screenIsLarge = Dimensions.get("screen").height > 667;
    const palette = useColorPalette();
    const { hasJugs, isLoading } = useAtomValue(userHasJugsAtom);
    const { isCarer } = useSettings();

    const { isRefreshing, handleRefresh } = useQueryRefetch(getHydrationQAtom);

    if (isCarer) {
        return <Redirect href="community" />;
    }

    return (
        <PageWrapper
            isLoading={isLoading}
            message="Loading your information..."
        >
            <ScrollView
                contentContainerClassName={`flex-1 h-full items-center ${screenIsLarge ? "gap-20 mt-16" : "gap-12 mt-10"} `}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={handleRefresh}
                    />
                }
            >
                <HydrationProgress />
                <HydrationStatus />
                <View className={`${screenIsLarge ? "gap-5" : "gap-2"}`}>
                    {!hasJugs && (
                        <StyledButton
                            text="Add a New Jug"
                            onPress={() => router.push("devices")}
                            buttonClass="self-center"
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
                        text="Add a Drink"
                        textClass="text-lg mt-[1px]"
                        onPress={() => router.push("custom/add-drink-modal")}
                        icon=<MaterialCommunityIcons
                            name="water-plus-outline"
                            size={24}
                            color={palette.fg}
                        />
                    />
                </View>
            </ScrollView>
        </PageWrapper>
    );
}
