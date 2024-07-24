import { View } from "react-native";

import { useRouter } from "expo-router";
import StyledButton from "../common/button";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface PageContent {
    children: JSX.Element | JSX.Element[];
    nextHref?: string;
    proceed: boolean;
}

export default function GenericOnboardContent({
    children,
    nextHref,
    proceed,
}: PageContent) {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    return (
        <View className="flex flex-1 gap-8 mx-6 mt-10">
            {/* <Text className="text-4xl font-light text-gray-500 dark:text-gray-400">
                {title}
            </Text> */}
            {children}
            {nextHref && (
                <StyledButton
                    text="Next"
                    buttonClass="absolute bg-blue self-end rounded-xl right-0"
                    style={{ bottom: insets.bottom + 10 }}
                    textClass="text-white font-semibold text-lg"
                    onPress={() => {
                        proceed && router.push(nextHref);
                    } }   
                />
            )}
        </View>
    );
}
