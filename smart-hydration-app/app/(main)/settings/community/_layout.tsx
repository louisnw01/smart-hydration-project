import useColorPalette from "@/util/palette";
import { Stack, useRouter } from "expo-router";
import { Platform, Pressable } from "react-native";
import { Entypo } from "@expo/vector-icons";

export default function CommunityLayout() {
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
                name="community-profile"
                options={{
                    title: "Community Profile",
                }}
            />
            <Stack.Screen
                name="change-name"
                options={{
                    title: "Change Name",
                }}
            />
            <Stack.Screen
                name="change-owner"
                options={{
                    title: "Change Owner",
                }}
            />
            <Stack.Screen
                name="invite-member"
                options={{
                    title: "Invite Member",
                }}
            />
            <Stack.Screen
                name="remove-member"
                options={{
                    title: "Remove Member",
                }}
            />
            <Stack.Screen
                name="edit-tags"
                options={{
                    title: "Edit community tags",
                }}
            />
        </Stack>
    );
}
