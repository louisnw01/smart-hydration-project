import { useAtomValue } from "jotai";

import { Redirect, Stack } from "expo-router";
import { colorSchemeEAtom } from "@/atom/effect/user";
import { getItemAsync } from "expo-secure-store";
import { request } from "@/util/fetch";
import { useEffect, useState } from "react";
import Loading from "@/components/common/loading";
import { View } from "react-native";
import { tunnelInitEAtom } from "@/util/tunnel";

function useSession() {
    const [isLoading, setIsLoading] = useState(true);
    const [isSuccess, setIsSuccess] = useState(false);

    const getTokenFromStorage = async () => {
        const rawToken = await getItemAsync("auth-token");
        const authToken = rawToken ? JSON.parse(rawToken) : null;
        if (!authToken) {
            setIsSuccess(false);
            setIsLoading(false);
            return;
        }
        const result = await request("/user/check-token", {
            method: "post",
            auth: authToken,
        });
        setIsSuccess(result.ok);
        setIsLoading(false);
    };

    useEffect(() => {
        getTokenFromStorage();
    }, []);
    return { isLoading, isSuccess };
}

export default function MainLayout() {
    useAtomValue(colorSchemeEAtom);
    useAtomValue(tunnelInitEAtom);

    const { isLoading, isSuccess } = useSession();

    if (isLoading) {
        <View className="flex flex-1 justify-center">
            <Loading isLoading large message="" />
        </View>;
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
        </Stack>
    );
}
