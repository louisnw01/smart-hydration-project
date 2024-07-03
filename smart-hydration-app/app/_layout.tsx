import "../global.css";

import { Provider, useAtomValue, useSetAtom } from "jotai";
import { authTokenAtom } from "@/atom/user";

import { Stack, useRouter } from "expo-router";
import { useHydrateAtoms } from "jotai/react/utils";
import { queryClientAtom } from "jotai-tanstack-query";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { colorSchemeEAtom } from "@/atom/effect/user";
import "react-native-reanimated";
import { deleteItemAsync, getItemAsync } from "expo-secure-store";
import { request } from "@/util/fetch";
import { useEffect } from "react";
import { getUserQAtom } from "@/atom/query";
import { userNameAtom } from "@/atom/user";

const queryClient = new QueryClient();

const HydrateAtoms = ({ children } : {children : React.ReactNode})  => {
    useHydrateAtoms([[queryClientAtom, queryClient]]);
    return children;
};

function WrappedIndex() {
    useAtomValue(colorSchemeEAtom);

    const setAuthToken = useSetAtom(authTokenAtom);
    const setUserName = useSetAtom(userNameAtom);
    const router = useRouter();
    const { refetch } = useAtomValue(getUserQAtom);

    const getTokenFromStorage = async () => {
        const token = await getItemAsync("auth_token");
        if (!token) {
            router.replace("onboarding/login-register");
            return;
        }
        const result = await request("/check-token", {
            method: "post",
            auth: token,
        });
        if (result.ok) {
            setAuthToken(token);
            const name = (await refetch()).data;
            setUserName(name as string);
        } else {
            deleteItemAsync("auth_token");
            router.replace("onboarding/login-register");
        }
    };

    useEffect(() => {
        getTokenFromStorage();
    });

    return (
        <Stack>
            <Stack.Screen
                name="(tabs)"
                options={{ headerShown: false, animation: "fade" }}
            />
            <Stack.Screen
                name="(modals)"
                options={{
                    headerShown: false,
                    presentation: "formSheet",
                }}
            />
            <Stack.Screen name="login" options={{ headerShown: false }} />
            <Stack.Screen
                name="onboarding"
                options={{ headerShown: false, animation: "slide_from_bottom" }}
            />
        </Stack>
    );
}

export default function Index() {
    return (
        <QueryClientProvider client={queryClient}>
            <Provider>
                <HydrateAtoms>
                    <WrappedIndex />
                </HydrateAtoms>
            </Provider>
        </QueryClientProvider>
    );
}
