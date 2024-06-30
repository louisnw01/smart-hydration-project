import PageHeader from "@/components/common/header";
import { FontWeight } from "@shopify/react-native-skia";
import { Stack } from "expo-router";

export default function ModalLayout() {
    return (
        <Stack
            screenOptions={{
                contentStyle: { backgroundColor: "white" },
                headerTitleStyle: {
                    fontWeight: "bold",
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
        </Stack>
    );
}
