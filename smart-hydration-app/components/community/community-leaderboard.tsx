import { patientInfoQAtom } from "@/atom/query";
import PageWrapper from "@/components/common/page-wrapper";
import { MemberData, useFormattedMemberDataFunction } from "@/util/community";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useAtomValue } from "jotai";
import { Dimensions, Pressable, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Loading from "../common/loading";
import { FontAwesome6 } from "@expo/vector-icons";

export default function CommunityLeaderboard() {
    const { data, isLoading } = useAtomValue(patientInfoQAtom);
    const formatMemberData = useFormattedMemberDataFunction();
    if (!data) {
        return null;
    }
    const formattedData = data.map((row) => formatMemberData(row));
    const sortedData = formattedData.slice().sort((a, b) => {
        const progressA = parseInt(a.targetProgress);
        const progressB = parseInt(b.targetProgress);
        return progressB - progressA;
    });
    if (isLoading) {
        return <Loading isLoading />;
    }
    return (
        <PageWrapper>
            <LeaderboardWinner member={sortedData[0]} />
            <View className="flex-col gap-4 pt-4 w-full">
                {sortedData.map((row, index) => {
                    return (
                        <Pressable key={index}>
                            <LeaderboardRow member={row} index={index} />
                        </Pressable>
                    );
                })}
            </View>
        </PageWrapper>
    );
}

export function LeaderboardRow({
    member,
    index,
}: {
    member: MemberData;
    index: number;
}) {
    const screenSizeCutoff = Dimensions.get("screen").height > 667 ? 15 : 12;

    const progressWidth = `${parseInt(member.targetProgress)}%`;
    const memberName =
        member.name.length > screenSizeCutoff
            ? member.name.substring(0, screenSizeCutoff - 1) + "..."
            : member.name;
    return (
        <View className="relative w-[93%] h-24 left-4 rounded-xl overflow-hidden mb-1 bg-gray-200 dark:bg-neutral-800">
            <View
                className="absolute left-0 top-0 bottom-0 h-12 bg-blue "
                style={{ width: progressWidth, height: "4rem" }}
            />

            {/* Foreground content */}
            <View className="flex-row items-center h-full bg-transparent rounded-xl p-4">
                <View className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                    <FontAwesome6 name="face-smile" size={30} color="gray" />
                </View>
                <Text className="pl-4 flex-1 text-2xl font-semibold dark:text-white">
                    {memberName}
                </Text>
                <Text className="text-2xl font-semibold dark:text-white">
                    {member.targetProgress}
                </Text>
                <Text className="pl-4 text-4xl font-bold dark:text-white">
                    #{index + 1}
                </Text>
            </View>
        </View>
    );
}

export function LeaderboardWinner({ member }: { member: MemberData }) {
    if (!member) {
        return null;
    }
    const screenSizeCutoff = Dimensions.get("screen").height > 667 ? 15 : 12;

    const memberName =
        member.name.length > screenSizeCutoff
            ? member.name.substring(0, screenSizeCutoff - 1) + "..."
            : member.name;
    return (
        <View className="items-center relative w-[93%] h-72 left-4 rounded-xl top-4 mb-6 overflow-hidden border-gray-100 border-2 dark:border-neutral-800">
            <MaterialCommunityIcons
                name="crown"
                size={39}
                color="rgb(255, 215, 0)"
            />
            <View className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center">
                <FontAwesome6 name="face-smile" size={60} color="gray" />
            </View>
            <Text className=" text-3xl font-bold pt-1">{memberName}</Text>
            <Text className="text-3xl dark:text-white text-center">
                {memberName} is closest to their target!
            </Text>
            <Text className="pt-2 dark:text-white">
                Drink water regularly to be the champion!
            </Text>
        </View>
    );
}
