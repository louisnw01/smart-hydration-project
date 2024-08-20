import { removePushTokenMAtom } from "@/atom/query";
import {
    authTokenAtom,
    drinkListAtom,
    notificationFrequencyAtom,
    notificationsAtom,
    pushTokenAtom,
} from "@/atom/user";
import StyledButton from "@/components/common/button";
import { OptionBlock } from "@/components/common/option-block";
import { ISettingsSection } from "@/interfaces/settings";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useEffect, useState } from "react";
import { SectionList, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ConfirmModal } from "../settings/remove-member";

const settingsList: ISettingsSection[] = [
    {
        title: "Account",
        data: [
            {
                name: "Profile",
                Component: (name, isFirst, isLast) => {
                    return (
                        <OptionBlock
                            isLast={isLast}
                            text={name}
                            onPress={() => router.navigate("settings/profile")}
                            icon={
                                <Feather name="user" size={18} color="gray" />
                            }
                        />
                    );
                },
            },
            {
                name: "User Mode",
                Component: (name, isFirst, isLast) => {
                    return (
                        <OptionBlock
                            isLast={isLast}
                            text={name}
                            onPress={() => router.navigate("settings/mode")}
                            icon={
                                <MaterialCommunityIcons
                                    name="cards-playing-heart-multiple-outline"
                                    size={16}
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
        title: "Data",
        data: [
            // {
            //     name: "Other Drinks",
            //     Component: (name, isFirst, isLast) => {
            //         return (
            //             <OptionBlock
            //                 isLast={isLast}
            //                 text={name}
            //                 onPress={() => router.navigate("settings/theme")}
            //                 icon={
            //                     <MaterialCommunityIcons
            //                         name="cup-water"
            //                         size={19}
            //                         color="gray"
            //                     />
            //                 }
            //             />
            //         );
            //     },
            // },
            {
                name: "Daily Target",
                Component: (name, isFirst, isLast) => {
                    return (
                        <OptionBlock
                            isLast={isLast}
                            text={name}
                            onPress={() =>
                                router.navigate("settings/adjust-target")
                            }
                            icon={
                                <MaterialCommunityIcons
                                    name="target"
                                    size={19}
                                    color="gray"
                                />
                            }
                        />
                    );
                },
            },
            {
                name: "Units",
                Component: (name, isFirst, isLast) => {
                    return (
                        <OptionBlock
                            isLast={isLast}
                            text={name}
                            onPress={() =>
                                router.navigate("settings/adjust-units")
                            }
                            icon={
                                <MaterialCommunityIcons
                                    name="scale"
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
        title: "Appearance",
        data: [
            {
                name: "Theme",
                Component: (name, isFirst, isLast) => {
                    return (
                        <OptionBlock
                            isLast={isLast}
                            text={name}
                            onPress={() => router.navigate("settings/theme")}
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
        title: "Community",
        data: [
            {
                name: "Community Settings",
                Component: (name, isFirst, isLast) => {
                    return (
                        <OptionBlock
                            isLast={isLast}
                            text={name}
                            onPress={() => {
                                // router.dismiss();
                                router.push("settings/community-settings");
                            }}
                            icon={
                                <MaterialCommunityIcons
                                    name="account-group-outline"
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
        title: "Notifications",
        data: [
            {
                name: "Notification settings",
                Component: (name, isFirst, isLast) => {
                    return (
                        <OptionBlock
                            isLast={isLast}
                            text={name}
                            onPress={() =>
                                router.navigate("settings/notifications")
                            }
                            icon={
                                <Ionicons
                                    name="notifications-outline"
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
                Component: () => {
                    const { mutate, isSuccess } =
                        useAtomValue(removePushTokenMAtom);
                    const pushToken = useAtomValue(pushTokenAtom);
                    const [authToken, setAuthAtom] = useAtom(authTokenAtom);
                    const setNotifications = useSetAtom(notificationsAtom);
                    const setNotificationFrequency = useSetAtom(
                        notificationFrequencyAtom,
                    );
                    const setDrinksList = useSetAtom(drinkListAtom);
                    const [modalVisible, setModalVisible] = useState(false);

                    function handleLogout() {
                        setDrinksList([]);
                        setNotificationFrequency("1 hour");
                        setNotifications("On");
                        setAuthAtom("");
                        // router.replace("onboarding/login-register");
                    }

                    useEffect(() => {
                        if (!isSuccess) return;
                        handleLogout();
                    }, [isSuccess]);

                    useEffect(() => {
                        if (!authToken) {
                            router.replace("onboarding/login-register");
                        }
                    }, [authToken]);

                    return (
                        <View className="">
                            <View className="w-full h-[1px] bg-gray-300 dark:bg-neutral-800 mb-4 mt-16" />
                            <StyledButton
                                text="Log Out"
                                buttonClass="bg-red rounded-xl py-3 justify-center"
                                textClass="text-xl text-white"
                                onPress={() => {
                                    setModalVisible(true);
                                }}
                            />
                            <ConfirmModal
                                message="Are you sure you want to log out?"
                                confirmMessage="Log Out"
                                onConfirm={() => {
                                    if (!!pushToken) {
                                        mutate({
                                            pushToken: pushToken as string,
                                        });
                                    } else {
                                        handleLogout();
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

export default function SettingsModal() {
    const insets = useSafeAreaInsets();

    return (
        <View className="flex flex-1 justify-between mx-4">
            <SectionList
                sections={settingsList}
                renderItem={({ item, index, section }) =>
                    item.Component(
                        item.name || "",
                        index == 0,
                        index == section.data.length - 1,
                    )
                }
                contentContainerStyle={{
                    paddingBottom: insets.bottom + 20,
                }}
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
                keyExtractor={(item) => `settings-${item.name}`}
                stickySectionHeadersEnabled={false}
            />
        </View>
    );
}
