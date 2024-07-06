import useColorPalette from "@/util/palette";
import { Stack, useRouter } from "expo-router";
import { Pressable } from "react-native";
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
                headerLeft: () => {
                    const router = useRouter();
                    const palette = useColorPalette();
                    return (
                        <Pressable onPress={() => router.back()}>
                            <Entypo
                                name="circle-with-cross"
                                size={24}
                                color="rgb(80, 80, 80)"
                            />
                        </Pressable>
                    );
                },
            }}
        >
            <Stack.Screen
                name="settings-modal"
                options={{ title: "Settings", headerBackVisible: true }}
            />
            <Stack.Screen name="theme" options={{ title: "Theme" }} />
        </Stack>
    );
}
