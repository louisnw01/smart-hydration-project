import NavigationBar from "@/components/nav";
import "../global.css"
import { View } from 'react-native';
import PageRouter from "@/components/page-router";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import OnboardingPage from "./onboarding";

const isOnboarding = true;

export default function Index() {
    if (isOnboarding) {
        return <OnboardingPage />
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
