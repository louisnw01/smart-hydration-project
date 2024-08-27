import useSettings from "@/app/hooks/user";
import {
    communityInfoQAtom,
    deleteCommunityMAtom,
    leaveCommunityMAtom,
    userHasCommunityAtom,
} from "@/atom/query";
import { communityTabVisible } from "@/atom/user";
import StyledButton from "@/components/common/button";
import { OptionBlock } from "@/components/common/option-block";
import { ISettingsActions, ISettingsSection } from "@/interfaces/settings";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import { SectionList, SectionListData, Text, View } from "react-native";
import { ConfirmModal } from "./remove-member";

const settingsList: ISettingsSection[] = [
    {
        title: "Community Profile",
        data: [
            {
                name: "Change community Name",
                Component: (name, isFirst, isLast) => {
                    const inCommunity = useAtomValue(userHasCommunityAtom);
                    const { data } = useAtomValue(communityInfoQAtom);
                    return (
                        <>
                        { inCommunity && data?.isOwner && (
                        <OptionBlock
                            text={name}
                            isFirst={isFirst}
                            isLast={isLast}
                            onPress={() =>
                                router.navigate("settings/change-name")
                            }
                            icon={
                                <MaterialCommunityIcons
                                    name="lead-pencil"
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
                name: "Edit community tags",
                Component: (name, isFirst, isLast) => {
                    const { data } = useAtomValue(communityInfoQAtom);
                    const { isCarer } = useSettings();
                    const inCommunity = useAtomValue(userHasCommunityAtom);
                    return (
                        <>
                            {data?.isOwner && isCarer && inCommunity && (
                                <OptionBlock
                                    isLast={isLast}
                                    isFirst={isFirst}
                                    text={name}
                                    onPress={() =>
                                        router.navigate("settings/edit-tags")
                                    }
                                    icon={
                                        <Ionicons
                                            name="pricetag-outline"
                                            size={19}
                                            color="gray"
                                        />
                                    }
                                />
                            )}
                        </>
                    );
                },
            },
        ],
    },
    {
        title: "Members",
        data: [
            {
                name: "Remove Carer",
                Component: (name, isFirst, isLast) => {
                    const { data } = useAtomValue(communityInfoQAtom);
                    const { isCarer } = useSettings();
                    const inCommunity = useAtomValue(userHasCommunityAtom);
                    return (
                        <>
                            {data?.isOwner && isCarer && inCommunity && (
                                <OptionBlock
                                    isLast={isLast}
                                    text={name}
                                    onPress={() =>
                                        router.navigate(
                                            "settings/remove-member",
                                        )
                                    }
                                    icon={
                                        <Ionicons
                                            name="close-circle-outline"
                                            size={19}
                                            color="gray"
                                        />
                                    }
                                />
                            )}
                        </>
                    );
                },
            },
            {
                name: "Invite Carer",
                Component: (name, isFirst, isLast) => {
                    const { data } = useAtomValue(communityInfoQAtom);
                    const { isCarer } = useSettings();
                    const inCommunity = useAtomValue(userHasCommunityAtom);
                    return (
                        <>
                            {isCarer && data?.isOwner && inCommunity && (
                                <OptionBlock
                                    isLast={isLast}
                                    text={name}
                                    onPress={() =>
                                        router.navigate(
                                            "settings/invite-member",
                                        )
                                    }
                                    icon={
                                        <Ionicons
                                            name="add-circle-outline"
                                            size={19}
                                            color="gray"
                                        />
                                    }
                                />
                            )}
                        </>
                    );
                },
            },
            {
                name: "Invite User",
                Component: (name, isFirst, isLast) => {
                    const { isCarer } = useSettings();
                    const inCommunity = useAtomValue(userHasCommunityAtom);
                    return (
                        <>
                            {!isCarer && inCommunity && (
                                <OptionBlock
                                    isLast={isLast}
                                    text={name}
                                    onPress={() =>
                                        router.navigate(
                                            "settings/invite-member",
                                        )
                                    }
                                    icon={
                                        <Ionicons
                                            name="add-circle-outline"
                                            size={19}
                                            color="gray"
                                        />
                                    }
                                />
                            )}
                        </>
                    );
                },
            },
        ],
    },
    {
        title: "",
        data: [
            {
                name: "Hide Community Tab",
                Component: (name, isFirst, isLast) => {
                    const { isCarer } = useSettings();
                    return (
                        <>
                            {!isCarer && (
                                <View className="py-6">
                                    <OptionBlock
                                        atom={communityTabVisible}
                                        text="Show Community Tab"
                                        isFirst={isFirst}
                                        isLast={isLast}
                                        icon={
                                            <Ionicons
                                                name="eye-outline"
                                                size={19}
                                                color="gray"
                                            />
                                        }
                                    />
                                </View>
                            )}
                        </>
                    );
                },
            },
        ],
    },
    {
        data: [
            {
                Component: () => {
                    const { data } = useAtomValue(communityInfoQAtom);
                    const inCommunity = useAtomValue(userHasCommunityAtom);
                    const {
                        mutate: deleteCommunity,
                        isSuccess: deleteSuccess,
                    } = useAtomValue(deleteCommunityMAtom);

                    const { mutate: leaveCommunity, isSuccess: leaveSuccess } =
                        useAtomValue(leaveCommunityMAtom);

                    const [modalVisible, setModalVisible] = useState(false);

                    useEffect(() => {
                        if (!deleteSuccess) return;
                        router.back();
                    }, [deleteSuccess]);

                    useEffect(() => {
                        if (!leaveSuccess) return;
                        router.back();
                    }, [leaveSuccess]);

                    const isOwner = data?.isOwner;
                    const confirmAction = data?.isOwner ? "Delete" : "Leave";
                    const confirmWord = data?.isOwner ? "delete" : "leave";
                    return (
                        <View className="">
                            <View className="w-full h-[1px] bg-gray-300 dark:bg-neutral-800 mb-4 mt-16" />
                            {inCommunity && (
                            <StyledButton
                                text={
                                    isOwner
                                        ? "Delete Community"
                                        : "Leave Community"
                                }
                                buttonClass="bg-red rounded-xl justify-center"
                                textClass="text-xl text-white my-1"
                                onPress={() => {
                                    setModalVisible(true);
                                }}
                            />)}
                            <ConfirmModal
                                message={`Are you sure you want to ${confirmWord} this community?`}
                                confirmMessage={confirmAction}
                                onConfirm={() => {
                                    if (isOwner) {
                                        deleteCommunity();
                                    } else {
                                        leaveCommunity();
                                    }
                                }}
                                modalVisible={modalVisible}
                                setModalVisible={setModalVisible}
                            />
                        </View>
                    );
                },
            },
        ],
    },
];

const shouldRenderHeader = (
    section: SectionListData<ISettingsActions, ISettingsSection>,
) => {
    // Condition to render section headers
    // For example, don't render headers for empty sections
    if(!section.title) {
    return false;}
    return true;
};

export default function CommunityProfile() {
    return (
        <View className="flex flex-1 justify-between mx-4 mt-4">
            <SectionList
                sections={settingsList}
                renderItem={({ item, index, section }) =>
                    item.Component(
                        item.name || "",
                        index == 0,
                        index == section.data.length - 1,
                    )
                }
                renderSectionHeader={({ section }) => {
                    if (!shouldRenderHeader(section)) {
                        return null;
                    }
                    return (
                        <View className="bg-gray-100 dark:bg-neutral-900 py-4 px-4 rounded-t-xl mt-6">
                            <Text className="font-bold dark:text-white">
                                {section.title}
                            </Text>
                        </View>
                    );
                }}
                keyExtractor={(item, idx) => idx.toString()}
                stickySectionHeadersEnabled={false}
            />
        </View>
    );
}
