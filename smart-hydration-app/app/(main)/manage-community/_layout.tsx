import useColorPalette from "@/util/palette";
import { Entypo } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import React from "react";
import { Pressable } from "react-native";

export default function ManageCommunityLayout() {
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
                name="community-settings"
                options={{
                    title: "Manage Community",
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
                name="invite-member"
                options={{
                    title: "Invite a Member",
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
                name="change-owner"
                options={{
                    title: "Transfer Community Ownership",
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
                    title: "Remove a Member",
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
