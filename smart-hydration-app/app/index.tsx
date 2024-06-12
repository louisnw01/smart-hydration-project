import NavigationBar from "@/components/nav";
import "../global.css"
import { Text, View } from 'react-native';
import { useAtomValue } from "jotai";
import { selectedPageAtom } from "@/atom/nav";
import PageRouter from "@/components/page-router";
import OnboardingPage from "./onboarding";

export default function Index() {
    const page = useAtomValue(selectedPageAtom);

    const isOnboarding = true;

    if (isOnboarding) {
        return <OnboardingPage />
    }

    return (
        <View className="flex flex-1 justify-between h-full">
            {/*<Text className="bg-black text-md text-white">you are hydrated</Text>*/}
            <PageRouter />
            <NavigationBar />
        </View>
    );
}


