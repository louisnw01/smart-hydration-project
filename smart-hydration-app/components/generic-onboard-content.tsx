import { Text, View } from "react-native";

import { useRouter } from "expo-router";
import OnboardingButton from "./onboarding-button";
import colors from "@/colors";

interface PageContent {
    title: string;
    children: JSX.Element | JSX.Element[];
    nextHref?: string;
}

export default function GenericOnboardContent({
    children,
    title,
    nextHref,
}: PageContent) {
    const router = useRouter();
    return (
        <View className="flex flex-1 gap-8 mx-16 items-center mt-10">
            {/* <Text className="text-4xl font-light text-gray-500 dark:text-gray-400">
                {title}
            </Text> */}
            {children}
            {nextHref && (
                <OnboardingButton
                    text="Next"
                    color={colors.blue}
                    onPress={() => router.push(nextHref)}
                />
            )}
        </View>
    );
}
