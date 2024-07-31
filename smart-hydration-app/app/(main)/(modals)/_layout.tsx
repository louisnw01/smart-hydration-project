import useColorPalette from "@/util/palette";
import { Stack, useRouter } from "expo-router";
import { Platform, Pressable } from "react-native";
import { Entypo } from "@expo/vector-icons";

export default function ModalLayout() {
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
                headerLeft: () => {
                    const router = useRouter();
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
        >
            {/* <Stack.Screen
                name="settings-modal"
                options={{ title: "Settings", headerBackVisible: true }}
            /> */}
            <Stack.Screen
                name="add-device-modal"
                options={{ title: "Add a Device" }}
            />
            {/* <Stack.Screen
                name="add-drink-modal"
                options={{ title: "Add a Drink" }}
            /> */}
            <Stack.Screen name="device-info-modal" options={{ title: "" }} />
            <Stack.Screen
                name="edit-device-name-modal"
                options={{
                    title: "Enter a New Device Name",
                    headerBackVisible: false,
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
                name="create-community-modal"
                options={{ title: "Create a Community" }}
            />
            <Stack.Screen
                name="join-community-modal"
                options={{ title: "Join a Community" }}
            />
            <Stack.Screen
                name="add-member-modal"
                options={{ title: "Add a community member" }}
            />
            <Stack.Screen
                name="add-device-member-modal"
                options={{ title: "Add jug(s) to member" }}
            />
            <Stack.Screen
                name="member-info-modal"
                options={{ title: "Member details" }}
            />
            <Stack.Screen
                name="add-device-to-juguser-modal"
                options={{
                    title: "Link device to user",
                    headerBackVisible: false,
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
