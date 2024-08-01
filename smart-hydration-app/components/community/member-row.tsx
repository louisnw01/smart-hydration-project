import { selectedMemberAtom } from "@/atom/community";
import { MemberInfo } from "@/interfaces/community";
import { router } from "expo-router";
import { useSetAtom } from "jotai";
import { Pressable, Text, View } from "react-native";
import Tag from "./tag";

export default function MemberRow({ member }: { member: MemberInfo }) {
    const setMember = useSetAtom(selectedMemberAtom);
    return (
        <Pressable
            className="mx-6 bg-gray-100 px-5 py-5 flex flex-row gap-4 rounded-xl dark:bg-neutral-900"
            onPress={() => {
                setMember(member);
                router.push("member-info-modal");
            }}
        >
            <View className="flex gap-4">
                <Text className="text-xl font-bold dark:text-white">
                    {member.name}
                </Text>

                <View className="flex-row gap-4">
                    <MemberDetail
                        title="Last Drank"
                        value={member.last_drank}
                        unit="hours ago"
                    />

                    <MemberDetail
                        title="Amount Drank"
                        value={member.amount_drank}
                        unit="ml"
                    />
                </View>
                <View className="flex-row flex-wrap">
                    <Tag name="Independent"></Tag>
                    <Tag name="Likes coffee"></Tag>
                    <Tag name="Aggressive"></Tag>
                    <Tag name="Four"></Tag>
                    <Tag name="Five"></Tag>
                    <Tag name="Six"></Tag>
                    <Tag name="Seven"></Tag>
                    <Tag name="Eight"></Tag>
                    <Tag name="Nine"></Tag>
                </View>
                <MemberDetail title="Target Progress" />
            </View>
        </Pressable>
    );
}

function MemberDetail({ title, value }) {
    return (
        <View className="border border-gray-200 dark:border-neutral-700 rounded-lg px-2 py-2">
            <Text className="font-semibold dark:text-white">{title}</Text>
            <Text className="text-xl dark:text-white">
                {value || "No data"}
            </Text>
        </View>
    );
}
