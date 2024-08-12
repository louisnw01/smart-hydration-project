import { communityInfoQAtom, patientInfoQAtom } from "@/atom/query";
import PageWrapper from "@/components/common/page-wrapper";
import { MemberData } from "@/util/community";
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
            <View className="flex-col gap-4 pt-4">
                {data.map((row, index) => (
                    <LeaderboardRow key={index} member={row} index={index} />
                ))}
            </View>
        </PageWrapper>
    );
}

// Properly typed for TypeScript, or just remove the types for plain JavaScript
export function LeaderboardRow({
    member,
    index,
}: {
    member: MemberData;
    index: number;
}) {
    return (
        <View className="flex-row pt-7 pl-4 relative left-4 right-4 h-24 bg-gray-100 rounded-xl w-[93%]">
            <View className="w-10 h-10 bg-gray-300">
                <Text>PH</Text>
            </View>
            <Text className="pl-4 justify-center text-2xl font-bold">
                {member.name}
            </Text>
            <Text className="pl-64 justify-right text-2xl font-bold">
                #{index + 1}
            </Text>
        </View>
    );
}
