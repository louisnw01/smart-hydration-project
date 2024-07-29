import useColorPalette from "@/util/palette";
import { Stack, useRouter } from "expo-router";
import { Platform, Pressable } from "react-native";
import { Entypo } from "@expo/vector-icons";

export default function SettingsLayout() {
    const palette = useColorPalette();
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
                        const router = useRouter();
                        return (
                            <Pressable onPress={() => router.back()}>
                                <Entypo
                                    name= {Platform.OS == "android" ? "chevron-left" :"circle-with-cross"}
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
                        const router = useRouter();
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
                        const router = useRouter();
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
                        const router = useRouter();
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
                name="community/invite-member"
                options={{
                    title: "Invite a Member",
                    headerLeft: () => {
                        const router = useRouter();
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
                name="community/change-name"
                options={{
                    title: "Change Community Name",
                    headerLeft: () => {
                        const router = useRouter();
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
                name="community/change-owner"
                options={{
                    title: "Transfer Community Ownership",
                    headerLeft: () => {
                        const router = useRouter();
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
                name="community/community-profile"
                options={{
                    title: "Transfer Community Ownership",
                    headerLeft: () => {
                        const router = useRouter();
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
                name="community/remove-member"
                options={{
                    title: "Remove a Member",
                    headerLeft: () => {
                        const router = useRouter();
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
                        const router = useRouter();
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
