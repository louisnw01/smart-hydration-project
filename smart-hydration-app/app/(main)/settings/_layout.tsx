/** eslint-disable no-unused-expressions */
import useSettings from "@/app/hooks/user";
import useColorPalette from "@/util/palette";
import { Entypo } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { Platform, Pressable } from "react-native";

export default function SettingsLayout() {
    const palette = useColorPalette();
    const { isCarer } = useSettings();
    return (
        <Stack
            screenOptions={{
                contentStyle: {
                    backgroundColor: palette.bg,
                },
                headerTitleStyle: {
                    fontWeight: "bold",
                    color: palette.fg,
                },
                headerStyle: {
                    backgroundColor: palette.bg,
                },
            }}
        >
            <Stack.Screen
                name="settings-modal"
                options={{
                    title: "Settings",
                    headerLeft: () => {
                        return (
                            <Pressable
                                onPress={() => {
                                    // eslint-disable-next-line no-unused-expressions
                                    isCarer
                                        ? router.replace("(tabs)/community")
                                        : router.replace("(tabs)");
                                }}
                            >
                                <Entypo
                                    name={
                                        Platform.OS == "android"
                                            ? "chevron-left"
                                            : "circle-with-cross"
                                    }
                                    size={24}
                                    color="rgb(80, 80, 80)"
                                />
                            </Pressable>
                        );
                    },
                }}
            />
            <Stack.Screen
                name="theme"
                options={{
                    title: "Theme",
                    headerLeft: () => {
                        return (
                            <Pressable onPress={() => router.back()}>
                                <Entypo
                                    name="chevron-left"
                                    size={24}
                                    color="rgb(80, 80, 80)"
                                />
                            </Pressable>
                        );
                    },
                }}
            />
            <Stack.Screen
                name="mode"
                options={{
                    title: "User Mode",
                    headerLeft: () => {
                        return (
                            <Pressable onPress={() => router.back()}>
                                <Entypo
                                    name="chevron-left"
                                    size={24}
                                    color="rgb(80, 80, 80)"
                                />
                            </Pressable>
                        );
                    },
                }}
            />
            <Stack.Screen
                name="profile"
                options={{
                    title: "Profile",
                    headerLeft: () => {
                        return (
                            <Pressable onPress={() => router.back()}>
                                <Entypo
                                    name="chevron-left"
                                    size={24}
                                    color="rgb(80, 80, 80)"
                                />
                            </Pressable>
                        );
                    },
                }}
            />
            <Stack.Screen
                name="adjust-target"
                options={{
                    title: "Adjust Daily Target",
                    headerLeft: () => {
                        return (
                            <Pressable onPress={() => router.back()}>
                                <Entypo
                                    name="chevron-left"
                                    size={24}
                                    color="rgb(80, 80, 80)"
                                />
                            </Pressable>
                        );
                    },
                }}
            />
            <Stack.Screen
                name="adjust-units"
                options={{
                    title: "Adjust Units",
                    headerLeft: () => {
                        return (
                            <Pressable onPress={() => router.back()}>
                                <Entypo
                                    name="chevron-left"
                                    size={24}
                                    color="rgb(80, 80, 80)"
                                />
                            </Pressable>
                        );
                    },
                }}
            />
            <Stack.Screen
                name="notifications"
                options={{
                    title: "Notifications",
                    headerLeft: () => {
                        return (
                            <Pressable onPress={() => router.back()}>
                                <Entypo
                                    name="chevron-left"
                                    size={24}
                                    color="rgb(80, 80, 80)"
                                />
                            </Pressable>
                        );
                    },
                }}
            />
            <Stack.Screen
                name="community-settings"
                options={{
                    title: "Manage Community",
                    headerLeft: () => {
                        return (
                            <Pressable onPress={() => router.back()}>
                                <Entypo
                                    name={
                                        isCarer
                                            ? "chevron-left"
                                            : "circle-with-cross"
                                    }
                                    size={24}
                                    color="rgb(80, 80, 80)"
                                />
                            </Pressable>
                        );
                    },
                }}
            />
            <Stack.Screen
                name="invite-member"
                options={{
                    title: isCarer
                        ? "Invite a Carer"
                        : "Invite another user to your community",
                    headerLeft: () => {
                        return (
                            <Pressable onPress={() => router.back()}>
                                <Entypo
                                    name="chevron-left"
                                    size={24}
                                    color="rgb(80, 80, 80)"
                                />
                            </Pressable>
                        );
                    },
                }}
            />
            <Stack.Screen
                name="change-name"
                options={{
                    title: "Change Community Name",
                    headerLeft: () => {
                        return (
                            <Pressable onPress={() => router.back()}>
                                <Entypo
                                    name="chevron-left"
                                    size={24}
                                    color="rgb(80, 80, 80)"
                                />
                            </Pressable>
                        );
                    },
                }}
            />
            <Stack.Screen
                name="remove-member"
                options={{
                    title: "Remove a carer from your community",
                    headerLeft: () => {
                        return (
                            <Pressable onPress={() => router.back()}>
                                <Entypo
                                    name="chevron-left"
                                    size={24}
                                    color="rgb(80, 80, 80)"
                                />
                            </Pressable>
                        );
                    },
                }}
            />
            <Stack.Screen
                name="edit-tags"
                options={{
                    title: "Edit community tags",
                    headerLeft: () => {
                        return (
                            <Pressable onPress={() => router.back()}>
                                <Entypo
                                    name="chevron-left"
                                    size={24}
                                    color="rgb(80, 80, 80)"
                                />
                            </Pressable>
                        );
                    },
                }}
            />
        </Stack>
    );
}
