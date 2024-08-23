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
import { MemberInfo } from "@/interfaces/community";
import useColorPalette from "@/util/palette";
import { formattedDataAtom } from "@/util/trends";
import { Entypo, FontAwesome6 } from "@expo/vector-icons";
import { router } from "expo-router";
import { useAtom, useAtomValue } from "jotai";
import { useEffect } from "react";
import { Text, View } from "react-native";
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
                if (memberName.length > 14) {
                    datapoint.name = datapoint.name.substring(0, 13) + "... ";
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
                {isCarer && isInCommunity && (
                    <View className="flex-row justify-evenly bg-white dark:bg-black py-4">
                        <Text className="pt-4 flex-wrap text-xl font-semibold dark:text-white">
                            Community Member:
                        </Text>
                        <SelectList
                            arrowicon=<Entypo
                                name="chevron-down"
                                size={24}
                                color={palette.fglight}
                            />
                            setSelected={(val) => {
                                // gets the memberinfo of the user to be used in historical data atom
                                setSelectedJugUser(
                                    communityMembers?.find(
                                        (member) =>
                                            member.key ===
                                            parseInt(val?.match(/\d+/)[0]),
                                    )?.value || null,
                                );
                            }}
                            defaultOption={{
                                key: selectedUser?.id?.toString(),
                                value: selectedUser
                                    ? selectedUser.name +
                                      ": #" +
                                      selectedUser.id
                                    : "Select a member",
                            }}
                            data={communityMembers?.map(
                                (items) =>
                                    items.value.name + ": #" + items.value.id,
                            )}
                            save="key"
                            search={false}
                            boxStyles={{
                                borderColor: "rgb(80, 80, 80)",
                            }}
                            dropdownStyles={{
                                // transform: [{ translateX: -68 }],
                                borderColor: "rgb(80, 80, 80)",
                            }}
                            dropdownTextStyles={{
                                color: palette.fg,
                            }}
                            inputStyles={{
                                color: palette.fg,
                                alignSelf: "center",
                            }}
                        />
                    </View>
                )}
                {/* {!(isCarer && !isInCommunity) && (
                    <>
                        {selectedUser == null && (
                            <View className="bg-white dark:bg-black justify-center h-full">
                                <Text className="dark:text-white text-center text-xl">
                                    Please select a community member
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
