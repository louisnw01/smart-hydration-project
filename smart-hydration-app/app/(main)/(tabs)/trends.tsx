import useSettings from "@/app/hooks/user";
import { selectedMemberAtom } from "@/atom/community";
import { mostHydratedDayOfWeekAtom } from "@/atom/hydration";
import {
    getHydrationQAtom,
    historicalPatientJugDataQAtom,
    patientInfoQAtom,
    userHasCommunityAtom,
    userJugUserIdAtom,
} from "@/atom/query";
import StyledButton from "@/components/common/button";
import { ScrollPageWrapper } from "@/components/common/page-wrapper";
import WaterAmount from "@/components/common/water-amount";
import TrendsChart from "@/components/trends/chart";
import InsightsPane from "@/components/trends/insights-pane";
import MonthVsLastMonthInsight from "@/components/trends/month-vs-month";
import Switcher from "@/components/trends/switcher";
import TodayVsAvgInsight from "@/components/trends/today-vs-avg";
import TrendsSelectList from "@/components/trends/trends-select";
import { MemberInfo } from "@/interfaces/community";
import useColorPalette from "@/util/palette";
import { formattedDataAtom } from "@/util/trends";
import { FontAwesome6 } from "@expo/vector-icons";
import { router } from "expo-router";
import { useAtom, useAtomValue } from "jotai";
import { useEffect } from "react";
import { Dimensions, Text, View } from "react-native";
import { SelectList } from "react-native-dropdown-select-list";

function MostHydratedDayOfWeek() {
    const { name, value } = useAtomValue(mostHydratedDayOfWeekAtom);
    const selectedMember = useAtomValue(selectedMemberAtom);
    const userJUserId = useAtomValue(userJugUserIdAtom);
    if (!value) return null;
    if (selectedMember?.id == userJUserId) {
        return (
            <InsightsPane heading={`You tend to drink the most on ${name}.`}>
                <WaterAmount value={value} />
            </InsightsPane>
        );
    } else {
        return (
            <InsightsPane
                heading={`${selectedMember?.name} tends to drink the most on ${name}.`}
            >
                <WaterAmount value={value} />
            </InsightsPane>
        );
    }
}

function Insights() {
    const { data } = useAtomValue(formattedDataAtom);
    if (!data || data.length === 0) {
        return <View className="h-3/4 justify-center text-center"></View>;
    }
    return (
        <View className="flex gap-4 px-4 mt-3 mb-4">
            <Text className="font-bold text-2xl mt-5 dark:text-white">
                Insights
            </Text>
            <TodayVsAvgInsight />

            <MonthVsLastMonthInsight />

            <MostHydratedDayOfWeek />
        </View>
    );
}

export default function TrendsPage() {
    const { isLoading } = useAtomValue(getHydrationQAtom);
    const isInCommunity = useAtomValue(userHasCommunityAtom);
    const screenSizeOffset = Dimensions.get("screen").height > 667 ? 14 : 8;
    const { isCarer } = useSettings();
    const palette = useColorPalette();
    const userJugUserId = useAtomValue(userJugUserIdAtom);
    const { data } = useAtomValue(patientInfoQAtom);
    const [selectedUser, setSelectedJugUser] = useAtom(selectedMemberAtom);
    const { isLoading: dataIsLoading } = useAtomValue(formattedDataAtom);

    let communityMembers: { key: number; value: MemberInfo }[] | undefined;

    // need a way to get the memberinfo of the current user
    //

    useEffect(() => {
        if (isCarer || !data) return;
        setSelectedJugUser(
            data?.find((row) => row.id == userJugUserId) || null,
        );
    }, [isCarer, data]);

    if (isCarer) {
        if (data != undefined) {
            for (let datapoint of data) {
                const memberName = datapoint.name;
                if (memberName.length > screenSizeOffset) {
                    datapoint.name =
                        datapoint.name.substring(0, screenSizeOffset - 1) +
                        "... ";
                }
            }
            communityMembers = data.map((row) => ({
                key: row.id,
                value: row,
            }));
        }
    }
    return (
        <ScrollPageWrapper
            queryRefreshAtom={historicalPatientJugDataQAtom}
            isLoading={isLoading || dataIsLoading}
            message="Loading your information..."
            className="bg-gray-100 dark:bg-black"
        >
            <>
                {!isCarer && (
                    <View>
                        <View className="flex px-4 pb-5 bg-white dark:bg-black">
                            <TrendsChart />
                            <Switcher />
                        </View>
                        <Insights />
                    </View>
                )}
                {isCarer && isInCommunity && (
                    <>
                        <TrendsSelectList
                            setSelectedJugUser={setSelectedJugUser}
                            communityMembers={communityMembers}
                            selectedUser={selectedUser}
                        />
                        {selectedUser == null && (
                            <View className="bg-white dark:bg-black justify-center h-full">
                                <Text className="dark:text-white text-center text-xl">
                                    Please select a patient
                                </Text>
                            </View>
                        )}
                        {selectedUser != null && ( */}
                {!isCarer && isInCommunity && (
                    <View>
                        <View className="flex px-4 pb-5 bg-white dark:bg-black">
                            <TrendsChart />
                            <Switcher />
                        </View>
                        <Insights />
                    </View>
                )}
                {isCarer && !isInCommunity && (
                    <>
                        <View className="flex items-center py-10 px-10 bg-white dark:bg-black">
                            <Text className="text-black dark:text-white text-xl font-light">
                                You're not tracking anyone's hydration yet. Go
                                to the Community tab to join a join a community
                                or create your own.
                            </Text>
                            <View className="flex flex-row items-center justify-center">
                                <StyledButton
                                    text="Community"
                                    onPress={() =>
                                        router.push("(tabs)/community")
                                    }
                                    textClass="text-lg self-center"
                                    buttonClass="self-center mt-20 px-3"
                                    icon={
                                        <View className="flex flex-row w-6 pr-1">
                                            <FontAwesome6
                                                name="people-group"
                                                size={22}
                                                color={palette.fg}
                                            />
                                        </View>
                                    }
                                />
                            </View>
                        </View>
                    </>
                )}
            </>
        </ScrollPageWrapper>
    );
}
