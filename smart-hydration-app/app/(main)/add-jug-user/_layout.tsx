import useColorPalette from "@/util/palette";
import { Entypo } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import React from "react";
import { Platform, Pressable } from "react-native";

export default function AddJugUserLayout() {
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
                name="add-jug-user-modal"
                options={{
                    title: "Add a New Patient",
                    headerLeft: () => {
                        return (
                            <Pressable onPress={() => router.back()}>
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
                name="name"
                options={{
                    title: "What is their name?",
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
                name="dob"
                options={{
                    title: "What is their date of birth?",
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
                name="room"
                options={{
                    title: "What is their room?",
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
                name="submit"
                options={{
                    title: "You're almost there!",
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
