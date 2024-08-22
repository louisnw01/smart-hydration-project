import Jug from "@/assets/svgs/jug.svg";
import SH_Drop from "@/assets/svgs/SH_Drop.svg";
import { selectedMemberAtom } from "@/atom/community";
import { getJugDataQAtom, userInfoQAtom } from "@/atom/query";
import { unitConverter, unitsAtom } from "@/atom/user";
import { MemberInfo } from "@/interfaces/community";
import { StaleWarningType, Warnings } from "@/interfaces/device";
import { useFormattedMemberData } from "@/util/community";
import getStalenessMessage from "@/util/device";
import useColorPalette from "@/util/palette";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useAtomValue, useSetAtom } from "jotai";
import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import StyledButton from "../common/button";
import Tag from "./tag";

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

interface WarningsWithId extends Warnings {
    id: string;
}

export default function MemberRow({ member }: { member: MemberInfo }) {
    const palette = useColorPalette();
    const setMember = useSetAtom(selectedMemberAtom);
    const memberData = useFormattedMemberData(member);
    const userInfo = useAtomValue(userInfoQAtom);
    const unit = useAtomValue(unitsAtom);

    const [membersWarnings, setMembersWarnings] = useState<
        WarningsWithId[] | null
    >(null);

    const { data } = useAtomValue(getJugDataQAtom);

    useEffect(() => {
        if (!data || !member) return;
        setMembersWarnings(
            data
                .filter((row) => row.jugUserId == member.id)
                .map((row) => ({
                    ...row.warnings,
                    id: row.id,
                    name: row.name,
                })),
        );
    }, [data]);

    return (
        <View className="w-full">
            <View className="w-full h-[1px] bg-gray-200" />
            <Pressable
                className="px-5 py-8 flex flex-row gap-4 rounded-xl dark:bg-neutral-900"
                onPress={() => {
                    setMember(member);
                    router.push("member-info-modal");
                }}
            >
                <View className="flex gap-4 w-full">
                    <View className="flex-row">
                        <Text className="text-xl font-bold dark:text-white">
                            {memberData.name}
                        </Text>
                        {memberData.juguser == userInfo.data?.juguser && (
                            <Text className="color-gray-400 text-xl font-semibold">
                                {" "}
                                (You)
                            </Text>
                        )}
                    </View>

                    <View className="flex-row gap-4">
                        <MemberDetail
                            title="Last Drank"
                            value={memberData.lastDrank}
                        />
                        <MemberDetail
                            title="Target Progress"
                            value={`${memberData.targetProgress}\n${memberData.amountDrank} out of ${Math.floor(unitConverter(memberData.target, unit))}${unit}`}
                        />
                    </View>
                    <View className="flex-row gap-2 flex-wrap">
                        {member.jugs.map((row) => {
                            if (row.waterLevel > 200) {
                                return null;
                            }
                            return (
                                <View
                                    className="flex-row pt-2 flex-wrap rounded-lg py px-2"
                                    style={{
                                        backgroundColor:
                                            row.waterLevel < 100
                                                ? "red"
                                                : "rgb(250, 180, 80)",
                                        borderColor:
                                            row.waterLevel < 100
                                                ? "red"
                                                : "rgb(250, 180, 80)",
                                    }}
                                >
                                    <View className="flex-row">
                                        <View className="flex-row rounded-xl w-5 h-10">
                                            <SH_Drop
                                                width={180}
                                                height={180}
                                                right={95}
                                                bottom={90}
                                                fill="white"
                                            />
                                        </View>
                                        <View className="bg-white rounded-lg -top-1 -right-1 w-[6.5rem] h-11">
                                            <Text className="px-2 text-sm">{`${row.name}`}</Text>
                                            <Text className="px-2 text-sm">
                                                {row.waterLevel < 100
                                                    ? "Jug empty"
                                                    : "Nearly empty"}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            );
                        })}
                    </View>
                    {membersWarnings && (
                        <View className="flex-row gap-2 flex-wrap">
                            {membersWarnings.map((row) => {
                                if (row.stale == StaleWarningType.NOT_STALE)
                                    return null;
                                return (
                                    <View
                                        className="flex-row pt-2 flex-wrap rounded-lg py px-2"
                                        style={{
                                            backgroundColor:
                                                row.stale == 2
                                                    ? "red"
                                                    : "rgb(250, 180, 80)",
                                            borderColor:
                                                row.stale == 2
                                                    ? "red"
                                                    : "rgb(250, 180, 80)",
                                        }}
                                    >
                                        <View className="flex-row">
                                            <View className="flex-row rounded-xl w-5">
                                                <Jug
                                                    width={18}
                                                    height={18}
                                                    left={-2}
                                                    top={-2}
                                                    fill="white"
                                                />
                                            </View>
                                            <View className="bg-white rounded-lg -top-1 -right-1 w-24 h-11">
                                                <Text className="px-2 text-sm">{`${row.name}`}</Text>
                                                <Text className="px-2 text-sm">
                                                    {getStalenessMessage(
                                                        row.stale,
                                                    )}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                );
                            })}
                        </View>
                    )}

                    <View className="flex-row flex-wrap">
                        {member.tags &&
                            member.tags.map((tag) => (
                                <Tag key={tag.id} name={tag.name} />
                            ))}
                    </View>

                    <StyledButton
                        text="Add a Drink"
                        textClass="text-lg mt-[1px]"
                        onPress={() => {
                            setMember(member);
                            router.push(
                                `custom/add-drink-modal?id=${member.id}`,
                            );
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

function MemberDetail({
    title,
    value,
}: {
    title: string;
    value?: number | string | undefined;
}) {
    return (
        <View className="border border-gray-200 dark:border-neutral-700 rounded-lg px-2 py-2">
            <Text className="font-semibold dark:text-white">{title}</Text>
            <Text className="text-xl dark:text-white">
                {value || "No data"}
            </Text>
        </View>
    );
}
