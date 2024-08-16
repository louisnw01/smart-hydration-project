import {
    getHydrationQAtom,
    historicalPatientJugDataQAtom,
    patientInfoQAtom,
    selectedJUserAtom,
    userHasCommunityAtom,
    userInfoQAtom,
    userJugUserIdAtom,
} from "@/atom/query";
import { ScrollPageWrapper } from "@/components/common/page-wrapper";
import WaterAmount from "@/components/common/water-amount";
import InsightsPane from "@/components/trends/insights-pane";
import MonthVsLastMonthInsight from "@/components/trends/month-vs-month";
import Switcher from "@/components/trends/switcher";
import TodayVsAvgInsight from "@/components/trends/today-vs-avg";
import { formattedDataAtom } from "@/util/trends";
import { useAtomValue, useAtom, useSetAtom } from "jotai";
import { ActivityIndicator, Text, View } from "react-native";
import { Entypo } from "@expo/vector-icons";
import useSettings from "@/app/hooks/user";
import { mostHydratedDayOfWeekAtom } from "@/atom/hydration";
import StyledButton from "@/components/common/button";
import TrendsChart from "@/components/trends/chart";
import useColorPalette from "@/util/palette";
import { FontAwesome6 } from "@expo/vector-icons";
import { userModeAtom } from "@/atom/user";
import { SelectList } from "react-native-dropdown-select-list";
import { useEffect } from "react";
import { selectedMemberAtom } from "@/atom/community";

function MostHydratedDayOfWeek() {
    const { name, value } = useAtomValue(mostHydratedDayOfWeekAtom);
    if (!value) return null;
    return (
        <InsightsPane heading={`You tend to drink the most on ${name}.`}>
            <WaterAmount value={value} />
        </InsightsPane>
    );
}

function Insights() {
    const data = useAtomValue(formattedDataAtom);

    if (!data || data.length === 0) {
        return (
            <View className="h-3/4 justify-center text-center">
                <ActivityIndicator />
                <Text className="text-center dark:text-white">
                    Loading Insights, Please Wait...
                </Text>
            </View>
        );
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
    const [userBeingShown, setUserBeingShown] = useAtom(selectedJUserAtom);
    const userJugUserId = useAtomValue(userJugUserIdAtom);
    const communityMemberData = useAtomValue(patientInfoQAtom);
    const juserData = useAtomValue(historicalPatientJugDataQAtom);
    const [selectedUser, setSelectedJugUser] = useAtom(selectedMemberAtom);

    let communityMembers;

    // need a way to get the memberinfo of the current user
    //
    const userMemberInfo = {
        dailyTarget: 2200,
        drankToday: 830,
        id: userJugUserId,
        jugs: [],
        lastDrank: 1723477398,
        name: "Bob",
        tags: [Array],
    };

    useEffect(() => {
        setSelectedJugUser(userBeingShown);
        console.log(userBeingShown);
    }, [userBeingShown, setSelectedJugUser, juserData]);
    if (userBeingShown == null) {
        console.log(userMemberInfo);
        setUserBeingShown(userMemberInfo);
    }
    useEffect(() => {
        setSelectedJugUser(userMemberInfo);
    }, [isCarer]);

    if (isCarer) {
        if (communityMemberData.data != undefined) {
            communityMembers = communityMemberData?.data.map((row) => ({
                key: row.id,
                value: row,
            }));
        }
        //console.log(communityMembers);
    }
    return (
        <ScrollPageWrapper
            queryRefreshAtom={getHydrationQAtom}
            isLoading={isLoading}
            message="Loading your information..."
            className="bg-gray-100 dark:bg-black"
        >
            <>
                {isCarer && isInCommunity && (
                    <View className="flex-row justify-evenly bg-white dark:bg-black py-4">
                        <Text className="pt-3.5 flex-wrap text-xl font-semibold">
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
                                setUserBeingShown(
                                    communityMembers.find(
                                        (member) =>
                                            member.key ===
                                            parseInt(val.match(/\d+/)[0]),
                                    ).value,
                                );
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
                {!(isCarer && !isInCommunity) && (
                    <>
                        <View className="flex px-4 pb-5 bg-white dark:bg-black">
                            <TrendsChart />
                            <Switcher />
                        </View>
                        <Insights />
                    </>
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
                                    href="(tabs)/community"
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
