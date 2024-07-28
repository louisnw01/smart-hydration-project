import colors from "@/colors";

import { ReactNode } from "react";
import { View, Text, Pressable } from "react-native";
import { useAtomValue, useSetAtom } from "jotai";
import { useRouter } from "expo-router";
import { MemberInfo } from "@/interfaces/community"
import { selectedMemberAtom } from "@/atom/community";
import { getJugDataQAtom } from "@/atom/query";
import Tag from "./tag";

export default function MemberRow({ member }: { member: MemberInfo }) {
    const setMember = useSetAtom(selectedMemberAtom);
    const { data } = useAtomValue(getJugDataQAtom);
    const router = useRouter();

    return (
        <Pressable
            className="mx-6 bg-gray-200 px-7 py-4 flex flex-col rounded-xl dark:bg-neutral-800"
            onPress={() => {
                setMember(member);
                router.push("member-info-modal");
            }}
        >
            <View className="flex-1">
                <Text className="text-xl font-bold dark:text-white">
                    {member.name}
                </Text>
                <Text className="text-2l dark:text-white">
                    <Text className="font-bold">Last drank: </Text>
                    {member.last_drank} hours ago
                </Text>
                <Text className="text-2l dark:text-white">
                    <Text className="font-bold">Target progress: </Text>
                    {member.target_percentage}%
                </Text>
            </View>
            {/* create a tag group component */}
            <View className="flex-row flex-wrap my-2">
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
        </Pressable>
    );
}



