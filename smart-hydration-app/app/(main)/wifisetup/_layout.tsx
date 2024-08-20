import useColorPalette from "@/util/palette";
import { Entypo } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { Pressable } from "react-native";

export default function WifiLayout() {
    const palette = useColorPalette();
    return (
        <Stack
            screenOptions={{
                headerShown: true,
                headerShadowVisible: false,
                headerBackVisible: false,
                contentStyle: {
                    backgroundColor: palette.bg,
                },
                headerTitleStyle: {
                    fontWeight: "bold",
                    color: palette.fg,
                },
                headerLeft: () => {
                    return (
                        <Pressable
                            onPress={() => {
                                router.back();
                            }}
                        >
                            <Entypo
                                name="chevron-left"
                                size={24}
                                color="rgb(80, 80, 80)"
                            />
                        </Pressable>
                    );
                },
                headerStyle: {
                    backgroundColor: palette.bg,
                },
            }}
        >
            <Stack.Screen name="pair" options={{ title: "Pairing Mode" }} />
            <Stack.Screen
                name="connect"
                options={{ title: "Connect to WiFi" }}
            />
            <Stack.Screen name="success" options={{ title: "All Done!" }} />
        </Stack>
    );
}
