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

                <MemberDetail title="Target Progress" />
            </View>

            <View className="flex-1 h-full">
                <MemberDetail title="Tags" tags={member.tags} />
            </View>
        </Pressable>
    );
}

function MemberDetail({ title, value, tags }: { title: string, value?: string | number, tags?: { id: number; name: string }[] }) {
    return (
        <View className="bg-gray-200 rounded-lg px-2 py-2">
            <Text className="font-semibold">{title}</Text>
            <Text className="text-xl">{value || "No data"}</Text>

            {tags && tags.length > 0 && (
                <View className="flex-row flex-wrap">
                    {tags.map(tag => (
                        <Tag key={tag.id} name={tag.name} />
                    ))}
                </View>
            )}
        </View>
    );
}
