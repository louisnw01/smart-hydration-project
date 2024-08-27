import { useAtomValue, useSetAtom } from "jotai";

import { setSelectedMemberInModeEAtom } from "@/atom/effect/mode";
import { colorSchemeEAtom } from "@/atom/effect/user";
import { authTokenAtom } from "@/atom/user";
import Loading from "@/components/common/loading";
import useSession from "@/util/auth";
import { subscribeToJugDataEAtom, tunnelInitEAtom } from "@/util/tunnel";
import { Redirect, Stack } from "expo-router";
import { View } from "react-native";

export default function MainLayout() {
    useAtomValue(colorSchemeEAtom);
    useAtomValue(tunnelInitEAtom);
    useAtomValue(subscribeToJugDataEAtom);
    useAtomValue(setSelectedMemberInModeEAtom);
    const setAuthAtom = useSetAtom(authTokenAtom);

    const { isLoading, isSuccess, isEmailVerified } = useSession();

    if (isLoading) {
        return (
            <View className="flex flex-1 justify-center">
                <Loading isLoading large message="" />
            </View>
        );
    } else if (!isEmailVerified) {
        return <Redirect href="onboarding/email-verification" />;
    } else if (!isSuccess) {
        setAuthAtom("");
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
