import { communityInfoQAtom, patientInfoQAtom } from "@/atom/query";
import PageWrapper from "@/components/common/page-wrapper";
import { MemberInfo } from "@/interfaces/community";
import { MemberData, useFormattedMemberData } from "@/util/community";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useAtomValue } from "jotai";
import { View, Text } from "react-native";
import { ScrollView } from "react-native-reanimated/lib/typescript/Animated";

export default function CommunityLeaderboard() {
    const { isLoading, refetch: refetchCommunityInfo } =
        useAtomValue(communityInfoQAtom);
    const {
        data,
        isLoading: patientInfoIsLoading,
        refetch: refetchPatientInfo,
    } = useAtomValue(patientInfoQAtom);
    if (!data) {
        return;
    }
    const formattedData = data.map((row) => useFormattedMemberData(row));
    const sortedData = formattedData.slice().sort((a, b) => {
        const progressA = parseInt(a.targetProgress);
        const progressB = parseInt(b.targetProgress);
        return progressB - progressA;
    });
    return (
        <PageWrapper>
            <LeaderboardWinner member={sortedData[0]} />
            <View className="flex-col gap-4 pt-4 w-full">
                {sortedData.map((row, index) => {
                    return (
                        <LeaderboardRow
                            key={index}
                            member={row}
                            index={index}
                        />
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
    const progressWidth = `${parseInt(member.targetProgress)}%`;
    return (
        <View className="relative w-[93%] h-24 left-4 rounded-xl overflow-hidden mb-1 bg-gray-200">
            <View
                className="absolute left-0 top-0 bottom-0 h-12 bg-blue "
                style={{ width: progressWidth, height: "4rem" }}
            />

            {/* Foreground content */}
            <View className="flex-row items-center h-full bg-transparent rounded-xl p-4">
                <View className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                    <Text>PH</Text>
                </View>
                <Text className="pl-4 flex-1 text-2xl font-semibold">
                    {member.name}
                </Text>
                <Text className="text-2xl font-semibold">
                    {member.targetProgress}
                </Text>
                <Text className="pl-4 text-4xl font-bold">#{index + 1}</Text>
            </View>
        </View>
    );
}

export function LeaderboardWinner({ member }: { member: MemberData }) {
    return (
        <View className="items-center relative w-[93%] h-64 left-4 rounded-xl top-4 mb-6 overflow-hidden border-gray-100 border-2">
            <MaterialCommunityIcons
                name="crown"
                size={39}
                color="rgb(255, 215, 0)"
            />
            <View className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center">
                <Text>PH</Text>
            </View>
            <Text className=" text-3xl font-bold pt-1">{member.name}</Text>
            <Text className="text-3xl">
                {member.name} is closest to their target!
            </Text>
            <Text className="pt-2">
                Drink water regularly to be the champion!
            </Text>
        </View>
    );
}
