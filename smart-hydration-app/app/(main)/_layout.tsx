import { Provider, useAtom, useAtomValue, useSetAtom } from "jotai";
import { authTokenAtom } from "@/atom/user";

import {
    Redirect,
    Stack,
    useRootNavigationState,
    useRouter,
} from "expo-router";
import { useHydrateAtoms } from "jotai/react/utils";
import { queryClientAtom } from "jotai-tanstack-query";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { colorSchemeEAtom } from "@/atom/effect/user";
import { deleteItemAsync, getItemAsync } from "expo-secure-store";
import { request } from "@/util/fetch";
import { useEffect, useState } from "react";
import Loading from "@/components/common/loading";
import { View } from "react-native";

const queryClient = new QueryClient();

const HydrateAtoms = ({ children }: { children: React.ReactNode }) => {
    useHydrateAtoms([[queryClientAtom, queryClient]]);
    return children;
};

// Add this function to the top of wrappedIndex for one run if needed
async function clearStorage() {
    await deleteItemAsync("color-scheme");
    await deleteItemAsync("auth_token");
    await deleteItemAsync("auth-token");
}

function useSession() {
    const [isLoading, setIsLoading] = useState(true);
    const [isSuccess, setIsSuccess] = useState(false);

    const getTokenFromStorage = async () => {
        const authToken = await getItemAsync("auth-token");
        if (!authToken) {
            setIsSuccess(false);
            setIsLoading(false);
            return;
        }
        const result = await request("/check-token", {
            method: "post",
            auth: JSON.parse(authToken),
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
