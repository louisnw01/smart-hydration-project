import { useAtomValue } from "jotai";

import { Redirect, Stack } from "expo-router";
import { colorSchemeEAtom } from "@/atom/effect/user";
import { getItemAsync } from "expo-secure-store";
import { request } from "@/util/fetch";
import { useEffect, useState } from "react";
import Loading from "@/components/common/loading";
import { View } from "react-native";

// Add this function to the top of wrappedIndex for one run if needed

function useSession() {
    const [isLoading, setIsLoading] = useState(true);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isEmailVerified, setIsEmailVerified] = useState(true)

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
        setIsEmailVerified(result.status != 403)
        setIsLoading(false);
    };

    useEffect(() => {
        getTokenFromStorage();
    }, []);
    return { isLoading, isSuccess, isEmailVerified };
}

export default function MainLayout() {
    useAtomValue(colorSchemeEAtom);
    const { isLoading, isSuccess, isEmailVerified } = useSession();

    if (isLoading) {
        <View className="flex flex-1 justify-center">
            <Loading isLoading large message="" />
        </View>;
    } else if(!isEmailVerified) {
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
        </Stack>
    );
}
