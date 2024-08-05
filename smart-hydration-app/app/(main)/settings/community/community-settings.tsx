import {
    communityInfoQAtom,
    deleteCommunityMAtom,
    leaveCommunityMAtom,
} from "@/atom/query/community";
import StyledButton from "@/components/common/button";
import { OptionBlock } from "@/components/common/option-block";
import { ISettingsSection } from "@/interfaces/settings";
import { Ionicons } from "@expo/vector-icons";
import { router, useRouter } from "expo-router";
import { useAtomValue } from "jotai";
import { useEffect } from "react";
import { SectionList, Text, View } from "react-native";

const settingsList: ISettingsSection[] = [
    {
        title: "Community Profile",
        data: [
            {
                name: "Change community Name",
                component: (name, isFirst, isLast) => {
                    const router = useRouter();
                    return (
                        <OptionBlock
                            text={name}
                            isFirst={isFirst}
                            isLast={isLast}
                            onPress={() =>
                                router.navigate(
                                    "settings/community/change-name",
                                )
                            }
                            icon={
                                <Ionicons
                                    name="color-palette"
                                    size={19}
                                    color="gray"
                                />
                            }
                        />
                    );
                },
            },
            {
                name: "Transfer Ownership",
                component: (name, isFirst, isLast) => {
                    const router = useRouter();
                    return (
                        <OptionBlock
                            isLast={isLast}
                            isFirst={isFirst}
                            text={name}
                            onPress={() =>
                                router.navigate(
                                    "settings/community/change-owner",
                                )
                            }
                            icon={
                                <Ionicons
                                    name="color-palette"
                                    size={19}
                                    color="gray"
                                />
                            }
                        />
                    );
                },
            },
            {
                name: "Edit community tags",
                component: (name, isFirst, isLast) => {
                    const router = useRouter();
                    return (
                        <OptionBlock
                            isLast={isLast}
                            isFirst={isFirst}
                            text={name}
                            onPress={() =>
                                router.navigate("settings/community/edit-tags")
                            }
                            icon={
                                <Ionicons
                                    name="color-palette"
                                    size={19}
                                    color="gray"
                                />
                            }
                        />
                    );
                },
            },
        ],
    },
    {
        title: "Members",
        data: [
            {
                name: "Remove Member",
                component: (name, isFirst, isLast) => {
                    const { data } = useAtomValue(communityInfoQAtom);
                    return (
                        <>
                        {data?.is_owner && (
                        <OptionBlock
                            isLast={isLast}
                            text={name}
                            onPress={() =>
                                router.navigate(
                                    "settings/community/remove-member",
                                )
                            }
                            icon={
                                <Ionicons
                                    name="color-palette"
                                    size={19}
                                    color="gray"
                                />
                            }
                        />)}
                        </>
                    );
                },
            },
            {
                name: "Invite Member",
                component: (name, isFirst, isLast) => {
                    const router = useRouter();
                    return (
                        <OptionBlock
                            isLast={isLast}
                            text={name}
                            onPress={() =>
                                router.navigate(
                                    "settings/community/invite-member",
                                )
                            }
                            icon={
                                <Ionicons
                                    name="color-palette"
                                    size={19}
                                    color="gray"
                                />
                            }
                        />
                    );
                },
            },
        ],
    },
    {
        data: [
            {
                component: () => {
                    const { data } = useAtomValue(communityInfoQAtom);
                    const {
                        mutate: deleteCommunity,
                        isSuccess: deleteSuccess,
                    } = useAtomValue(deleteCommunityMAtom);

                    const {
                        mutate: leaveCommunity,
                        isSuccess: leaveSuccess,
                    } = useAtomValue(leaveCommunityMAtom);

                    useEffect(() => {
                        if (!deleteSuccess) return;
                        router.back();
                    }, [deleteSuccess]);

                    useEffect(() => {
                        if (!leaveSuccess) return;
                        router.back();
                    }, [leaveSuccess]);

                    const isOwner = data?.is_owner;
                    return (
                        <View className="">
                            <View className="w-full h-[1px] bg-gray-300 dark:bg-neutral-800 mb-4 mt-16" />
                            <StyledButton
                                text={
                                    isOwner
                                        ? "Delete Community"
                                        : "Leave Community"
                                }
                                buttonClass="bg-red rounded-xl py-3 justify-center"
                                textClass="text-xl text-white"
                                onPress={() => {
                                    if (isOwner) {
                                        deleteCommunity();
                                    } else {
                                        leaveCommunity();
                                    }
                                }}
                            />
                        </View>
                    );
                },
            },
        ],
    },
];

export default function CommunityProfile() {
    return (
        <View className="flex flex-1 justify-between mx-4 mt-4">
            <SectionList
                sections={settingsList}
                renderItem={({ item, index, section }) =>
                    item.component(
                        item.name,
                        index == 0,
                        index == section.data.length - 1,
                    )
                }
                renderSectionHeader={({ section }) => {
                    if (!section.title) return null;
                    return (
                        <View className="bg-gray-100 dark:bg-neutral-900 py-4 px-4 rounded-t-xl mt-6">
                            <Text className="font-bold dark:text-white">
                                {section.title}
                            </Text>
                        </View>
                    );
                }}
                keyExtractor={(item) => `settings-community-${item.name}`}
                stickySectionHeadersEnabled={false}
            />
        </View>
    );
}
