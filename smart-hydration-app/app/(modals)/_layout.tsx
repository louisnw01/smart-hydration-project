import useColorPalette from "@/util/palette";
import { Stack } from "expo-router";

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
            }}
        >
            <Stack.Screen
                name="settings-modal"
                options={{ title: "Settings" }}
            />
            <Stack.Screen
                name="add-device-modal"
                options={{ title: "Add a Device" }}
            />
            <Stack.Screen
                name="device-info-modal"
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="edit-device-name-modal"
                options={{
                    title: "Enter a New Device Name",
                    headerBackVisible: false,
                }}
            />
        </Stack>
    );
}
