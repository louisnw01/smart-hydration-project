import NavigationBar from "@/components/nav";
import "../global.css"
import { View } from 'react-native';
import PageRouter from "@/components/page-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useAtomValue, useSetAtom } from "jotai";
import { authTokenAtom, isLoggedInAtom } from "@/atom/user";
import OnboardingRouter from "@/components/onboarding-router";


export default function Index() {
    // const setAuthToken = useSetAtom(authTokenAtom);
    // setAuthToken(null);
    const isLoggedIn = useAtomValue(isLoggedInAtom);

    if (!isLoggedIn) {
        return <OnboardingRouter />
    }

    return (
        <GestureHandlerRootView>
            <View className="flex flex-1 justify-between h-full">
                <PageRouter />
                <NavigationBar />
            </View>
        </GestureHandlerRootView>
    );

}
