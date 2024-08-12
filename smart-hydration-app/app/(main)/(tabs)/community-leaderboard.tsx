import { communityInfoQAtom, patientInfoQAtom } from "@/atom/query";
import PageWrapper from "@/components/common/page-wrapper";
import { MemberInfo } from "@/interfaces/community";
import { MemberData, useFormattedMemberData } from "@/util/community";
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
    return (
        <PageWrapper>
            <View className="flex-col gap-4 pt-4 w-full">
                {data.map((row, index) => {
                    const formattedData = useFormattedMemberData(row);
                    return (
                        <LeaderboardRow
                            key={index}
                            member={formattedData}
                            index={index}
                        />
                    );
                })}
            </View>
        </PageWrapper>
    );
}

// Properly typed for TypeScript, or just remove the types for plain JavaScript
export function LeaderboardRow({
    member,
    index,
}: {
    member: MemberInfo;
    index: number;
}) {
    const progressWidth = `${parseInt(member.targetProgress)}%`;
    return (
        <View className="relative w-[93%] h-24 left-4 rounded-xl overflow-hidden mb-4 bg-gray-200">
            <View
                className="absolute left-0 top-0 bottom-0 h-12 bg-blue"
                style={{ width: progressWidth, height: "4rem" }}
            />

            {/* Foreground content */}
            <View className="flex-row items-center h-full bg-transparent rounded-xl p-4">
                <View className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                    <Text>PH</Text>
                </View>
                <Text className="pl-4 flex-1 text-2xl font-bold">
                    {member.name}
                </Text>
                <Text className="text-2xl font-bold">
                    {member.targetProgress}
                </Text>
                <Text className="pl-4 text-2xl font-bold">#{index + 1}</Text>
            </View>
        </View>
    );
}
