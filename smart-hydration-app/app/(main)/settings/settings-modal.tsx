import {
    authTokenAtom,
    drinkListAtom,
    notificationsAtom,
    notificationFrequencyAtom,
    pushTokenAtom,
} from "@/atom/user";
import { OptionBlock } from "@/components/common/option-block";
import { ISettingsSection } from "@/interfaces/settings";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAtomValue, useSetAtom } from "jotai";
import { Pressable, SectionList, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { removePushTokenMAtom } from "@/atom/query";
import { amountDrankTodayAtom } from "@/atom/hydration";
import { useEffect } from "react";

const settingsList: ISettingsSection[] = [
    {
        title: "Account",
        data: [
            {
                name: "Profile",
                component: (name, isFirst, isLast) => {
                    const router = useRouter();
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
                component: (name, isFirst, isLast) => {
                    const router = useRouter();
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
            {
                name: "Other Drinks",
                component: (name, isFirst, isLast) => {
                    const router = useRouter();
                    return (
                        <OptionBlock
                            isLast={isLast}
                            text={name}
                            onPress={() => router.navigate("settings/theme")}
                            icon={
                                <MaterialCommunityIcons
                                    name="cup-water"
                                    size={19}
                                    color="gray"
                                />
                            }
                        />
                    );
                },
            },
            {
                name: "Daily Target",
                component: (name, isFirst, isLast) => {
                    const router = useRouter();
                    return (
                        <OptionBlock
                            isLast={isLast}
                            text={name}
                            onPress={() =>
                                router.navigate("settings/adjust-target")
                            }
                            icon={
                                <MaterialCommunityIcons
                                    name="cup-water"
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
                    const router = useRouter();
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
                name: "Community Profile",
                component: (name, isFirst, isLast) => {
                    const router = useRouter();
                    return (
                        <OptionBlock
                            isLast={isLast}
                            text={name}
                            onPress={() =>
                                router.navigate(
                                    "settings/community/community-profile",
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
                name: "Remove Member",
                component: (name, isFirst, isLast) => {
                    const router = useRouter();
                    return (
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
                        />
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
        title: "Notifications",
        data: [
            {
                name: "Notification settings",
                component: (name, isFirst, isLast) => {
                    const router = useRouter();
                    return (
                        <OptionBlock
                            isLast={isLast}
                            text={name}
                            onPress={() => router.navigate("settings/notifications")}
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
];

export default function SettingsModal() {
    const insets = useSafeAreaInsets();
    const setAuthAtom = useSetAtom(authTokenAtom);
    const setAmounDrankTodayAtom = useSetAtom(amountDrankTodayAtom);
    const setNotifications = useSetAtom(notificationsAtom);
    const setNotificationFrequency = useSetAtom(notificationFrequencyAtom);
    const setDrinksList = useSetAtom(drinkListAtom);
    const {mutate, isSuccess, data} = useAtomValue(removePushTokenMAtom);
    const pushToken = useAtomValue(pushTokenAtom);
    const router = useRouter();

    useEffect(() => {
        if(!isSuccess) return;
        setAuthAtom("");
        setAmounDrankTodayAtom(0);
        setDrinksList([]);
        setNotificationFrequency("1 hour");
        setNotifications("On");
        router.replace("onboarding/login-register");
    },[isSuccess, data])

    return (
        <View
            className="flex flex-1 justify-between mx-4"
            style={{
                paddingBottom: insets.bottom + 20,
            }}
        >
            <SectionList
                sections={settingsList}
                renderItem={({ item, index, section }) =>
                    item.component(
                        item.name,
                        index == 0,
                        index == section.data.length - 1,
                    )
                }
                renderSectionHeader={({ section }) => (
                    <View className="bg-gray-100 dark:bg-neutral-900 py-4 px-4 rounded-t-xl mt-6">
                        <Text className="font-bold dark:text-white">
                            {section.title}
                        </Text>
                    </View>
                )}
                keyExtractor={(item) => `settings-${item.name}`}
                stickySectionHeadersEnabled={false}
            />
            <View className="gap-5">
                <View className="w-full h-[1px] bg-gray-300 dark:bg-neutral-800" />
                <Pressable
                    className="items-center bg-red rounded-xl px-7 py-3"
                    onPress={() => {
                        mutate({pushToken: pushToken as string});
                    }}
                >
                    <Text className="text-xl mt-1 text-white">Log Out</Text>
                </Pressable>
            </View>
        </View>
    );
}
