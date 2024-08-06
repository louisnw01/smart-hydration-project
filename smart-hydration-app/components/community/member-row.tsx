import { formattedMemberDataAtom, selectedMemberAtom } from "@/atom/community";
import { MemberInfo } from "@/interfaces/community";
import useColorPalette from "@/util/palette";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useAtomValue, useSetAtom } from "jotai";
import { Pressable, Text, View } from "react-native";
import StyledButton from "../common/button";
import Tag from "./tag";
import { processMemberData, useFormattedMemberData } from "@/util/community";

function getOrdinalSuffix(day) {
    if (day > 3 && day < 21) return "th";
    switch (day % 10) {
        case 1:
            return "st";
        case 2:
            return "nd";
        case 3:
            return "rd";
        default:
            return "th";
    }
}

export default function MemberRow({ member }: { member: MemberInfo }) {
    const palette = useColorPalette();
    const setMember = useSetAtom(selectedMemberAtom);
    const memberData = useFormattedMemberData(member);

    return (
        <View>
            <Pressable
                className="mx-6 bg-gray-100 px-5 py-5 flex flex-row gap-4 rounded-xl dark:bg-neutral-900"
                onPress={() => {
                    setMember(member);
                    router.push("member-info-modal");
                }}
            >
                <View className="flex gap-4">
                    <Text className="text-xl font-bold dark:text-white">
                        {memberData.name}
                    </Text>

                    <View className="flex-row gap-4">
                        <MemberDetail
                            title="Last Drank"
                            value={memberData.lastDrank}
                            unit="hours ago"
                        />
                        <MemberDetail
                            title="Amount Drank"
                            value={memberData.amountDrank}
                            unit="ml"
                        />
                    </View>
                    <View className="flex-row flex-wrap">
                        {member.tags &&
                            member.tags.map((tag) => (
                                <Tag key={tag.id} name={tag.name} />
                            ))}
                    </View>
                    <MemberDetail
                        title="Target Progress"
                        value={memberData.targetProgress}
                    />
                    <StyledButton
                        text="add a drink"
                        textClass="text-lg mt-[1px]"
                        onPress={() => {
                            setMember(member);
                            router.push("add-drink-community-modal");
                        }}
                        icon=<MaterialCommunityIcons
                            name="water-plus-outline"
                            size={24}
                            color={palette.fg}
                        />
                    />
                </View>
            </Pressable>
            <View className=""></View>
        </View>
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
