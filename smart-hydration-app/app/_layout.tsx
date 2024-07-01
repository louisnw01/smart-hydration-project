import NavigationBar from "@/components/nav";
import "../global.css";
import { Appearance, Dimensions, View, StyleSheet, Text } from "react-native";
import PageRouter from "@/components/page-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider, useAtomValue, useSetAtom } from "jotai";
import { authTokenAtom, isLoggedInAtom, userNameAtom } from "@/atom/user";
import OnboardingRouter from "@/components/onboarding-router";
import { getItemAsync, deleteItemAsync } from "expo-secure-store";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { request } from "@/util/fetch";
import ModalRouter from "@/components/modal-router";

import { SharedValue } from "react-native-gesture-handler/lib/typescript/handlers/gestures/reanimatedWrapper";
import { Stack, useRouter } from "expo-router";
import { useHydrateAtoms } from "jotai/react/utils";
import { queryClientAtom } from "jotai-tanstack-query";
import { useEffect } from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { getUserQAtom } from "@/atom/query";

const queryClient = new QueryClient();

const HydrateAtoms = ({ children }) => {
    useHydrateAtoms([[queryClientAtom, queryClient]]);
    return children;
};

function WrappedIndex() {
    const setAuthToken = useSetAtom(authTokenAtom);
    const setUserName = useSetAtom(userNameAtom);
    const isLoggedIn = useAtomValue(isLoggedInAtom);
    const router = useRouter();
    const {data, refetch} = useAtomValue(getUserQAtom);

    const getTokenFromStorage = async () => {
        const token = await getItemAsync("auth_token");
        if (!token) {
            router.replace("login");
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
            router.replace("login");
        }
    };

    useEffect(() => {
        getTokenFromStorage();
    }, []);

    return (
        <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
                name="(modals)"
                options={{
                    headerShown: false,
                    presentation: "formSheet",
                }}
            />
            <Stack.Screen name="login" options={{ headerShown: false }} />
        </Stack>
    );
}

export default function Index() {
    Appearance.setColorScheme("light");

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
