import OnboardingHeader from "@/components/onboarding/onboarding-header";
import { Stack, useRouter } from "expo-router";
import React from "react";
import { Pressable, Platform } from "react-native";
import { Entypo } from "@expo/vector-icons";
import useColorPalette from "@/util/palette";

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
                    title: "Add a new jug user",
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
                name="name"
                options={{
                    title: "What is their name?",
                }}
            />
            <Stack.Screen
                name="dob"
                options={{
                    title: "What is their date of birth?",
                }}
            />
            <Stack.Screen
                name="submit"
                options={{
                    title: "You're almost there!",
                }}
            />
        </Stack>
    );
}
