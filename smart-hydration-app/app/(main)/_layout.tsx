import { useAtomValue } from "jotai";

import { colorSchemeEAtom } from "@/atom/effect/user";
import Loading from "@/components/common/loading";
import { tunnelInitEAtom } from "@/util/tunnel";
import { Redirect, Stack } from "expo-router";
import { View } from "react-native";
import useSession from "@/util/auth";

export default function MainLayout() {
    useAtomValue(colorSchemeEAtom);
    useAtomValue(tunnelInitEAtom);

    const { isLoading, isSuccess, isEmailVerified } = useSession();

    if (isLoading) {
        <View className="flex flex-1 justify-center">
            <Loading isLoading large message="" />
        </View>;
    } else if (!isEmailVerified) {
        return <Redirect href="onboarding/email-verification" />;
    } else if (!isSuccess) {
        return <Redirect href="onboarding/login-register" />;
    }

    return (
        <Stack
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="(tabs)" options={{ animation: "fade" }} />
            <Stack.Screen
                name="(modals)"
                options={{
                    presentation: "formSheet",
                }}
            />
            <Stack.Screen
                name="settings"
                options={{
                    presentation: "formSheet",
                }}
            />
            <Stack.Screen
                name="custom"
                options={{
                    presentation: "formSheet",
                }}
            />
        </Stack>
    );
}
