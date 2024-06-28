import NavigationBar from "@/components/nav";
import "../global.css";
import { View } from "react-native";
import PageRouter from "@/components/page-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useAtomValue, useSetAtom } from "jotai";
import { authTokenAtom, isLoggedInAtom } from "@/atom/user";
import OnboardingRouter from "@/components/onboarding-router";
import { getItemAsync } from "expo-secure-store";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Index() {
    // const setAuthToken = useSetAtom(authTokenAtom);
    // setAuthToken(null);
    const setAuthToken = useSetAtom(authTokenAtom);
    const isLoggedIn = useAtomValue(isLoggedInAtom);
    const insets = useSafeAreaInsets();

    const getTokenFromStorage = async () => {
        const token = await getItemAsync("auth_token");
        if (token) setAuthToken(token);
    };
    getTokenFromStorage();

    if (!isLoggedIn) {
        return <OnboardingRouter />;
    }

    return (
        <GestureHandlerRootView>
            <View
                className="flex flex-1 justify-between dark:bg-black"
                style={{
                    paddingTop: insets.top,
                    paddingBottom: insets.bottom,
                }}
            >
                <PageRouter />
                <NavigationBar />
            </View>
        </GestureHandlerRootView>
    );
}
