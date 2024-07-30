import { selectedMemberAtom } from "@/atom/community";
import { MemberInfo } from "@/interfaces/community";
import { router } from "expo-router";
import { useSetAtom } from "jotai";
import { Pressable, Text, View } from "react-native";

export default function MemberRow({ member }: { member: MemberInfo }) {
    const setMember = useSetAtom(selectedMemberAtom);
    return (
        <Pressable
            className="mx-6 bg-gray-100 px-7 py-4 flex flex-row justify-between rounded-xl dark:bg-neutral-900"
            onPress={() => {
                setMember(member);
                router.push("member-info-modal");
            }}
        >
            <View className="flex">
                <Text className="text-xl font-bold dark:text-white">
                    {member.name}
                </Text>
                <Text className="text-2l dark:text-white">
                    <Text className="font-bold">Last drank: </Text>
                    {/* {member.last_drank} hours ago */}
                </Text>

                <Text className="font-bold">
                    {`Target Progress: ${((member.drank_today / member.target) * 100).toFixed(0)}%`}
                </Text>
                <Text className="font-bold">
                    Amount Drank: {member.drank_today}ml
                </Text>
                {/* {member.target_percentage}% */}

                <Text className="text-2l dark:text-white">
                    <Text className="font-bold">Notes: </Text>
                    {/* {member.description} */}
                </Text>
            </View>
        </Pressable>
    );
}
