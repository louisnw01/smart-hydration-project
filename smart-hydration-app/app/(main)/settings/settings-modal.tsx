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
import { useAtomValue, useSetAtom } from "jotai";
import { useEffect } from "react";
import { SectionList, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const settingsList: ISettingsSection[] = [
    {
        title: "Account",
        data: [
            // {
            //     name: "Profile",
            //     component: (name, isFirst, isLast) => {
            //         return (
            //             <OptionBlock
            //                 isLast={isLast}
            //                 text={name}
            //                 onPress={() => router.navigate("settings/profile")}
            //                 icon={
            //                     <Feather name="user" size={18} color="gray" />
            //                 }
            //             />
            //         );
            //     },
            // },
            {
                name: "User Mode",
                component: (name, isFirst, isLast) => {
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
            //     component: (name, isFirst, isLast) => {
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
                component: (name, isFirst, isLast) => {
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
                component: (name, isFirst, isLast) => {
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
                component: (name, isFirst, isLast) => {
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
                component: (name, isFirst, isLast) => {
                    return (
                        <OptionBlock
                            isLast={isLast}
                            text={name}
                            onPress={() =>
                                router.push(
                                    "settings/community/community-settings",
                                )
                            }
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
                component: (name, isFirst, isLast) => {
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
                component: () => {
                    const { mutate, isSuccess } =
                        useAtomValue(removePushTokenMAtom);
                    const pushToken = useAtomValue(pushTokenAtom);
                    const setAuthAtom = useSetAtom(authTokenAtom);
                    const setNotifications = useSetAtom(notificationsAtom);
                    const setNotificationFrequency = useSetAtom(
                        notificationFrequencyAtom,
                    );
                    const setDrinksList = useSetAtom(drinkListAtom);

                    function handleLogout() {
                        setAuthAtom("");
                        setDrinksList([]);
                        setNotificationFrequency("1 hour");
                        setNotifications("On");
                        router.replace("onboarding/login-register");
                    }

                    useEffect(() => {
                        if (!isSuccess) return;
                        handleLogout();
                    }, [isSuccess]);

                    return (
                        <View className="">
                            <View className="w-full h-[1px] bg-gray-300 dark:bg-neutral-800 mb-4 mt-16" />
                            <StyledButton
                                text="Log Out"
                                buttonClass="bg-red rounded-xl py-3 justify-center"
                                textClass="text-xl text-white"
                                onPress={() => {
                                    if (!!pushToken) {
                                        mutate({
                                            pushToken: pushToken as string,
                                        });
                                    } else {
                                        handleLogout();
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

export default function SettingsModal() {
    const insets = useSafeAreaInsets();

    return (
        <View className="flex flex-1 justify-between mx-4">
            <SectionList
                sections={settingsList}
                renderItem={({ item, index, section }) =>
                    item.component(
                        item.name,
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
