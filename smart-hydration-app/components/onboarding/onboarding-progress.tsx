import { useRouteInfo } from "expo-router/build/hooks";
import { FlatList, View } from "react-native";
import Animated, {
    useAnimatedStyle,
    useDerivedValue,
    withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function OnboardingProgressBar() {
    const router = useRouteInfo();
    const insets = useSafeAreaInsets();
    const numPages = 5;

    const animatedPageIndex = useDerivedValue(() => {
        switch (router.pathname) {
            case "/onboarding/register":
                return 0;
            case "/onboarding/name":
                return 1;
            case "/onboarding/user-mode":
                return 2;
            case "/onboarding/dob":
                return 3;
            case "/onboarding/submit":
                return 4;
            default:
                return -1;
        }
    }, [router.pathname]);

    const animatedStyle = useAnimatedStyle(() => ({
        marginRight: 40 * Math.floor(numPages / 2),
        marginLeft: withTiming(40 * animatedPageIndex.value, {
            duration: 250,
        }),
    }));

    const viewAnimatedStyle = useAnimatedStyle(() => ({
        display: animatedPageIndex.value == -1 ? "none" : "flex",
        paddingTop: insets.top + 8,
    }));

    const componentList = [];
    for (let i = 0; i < numPages; i++) {
        componentList.push(
            <View className="w-[15px] h-[10px] bg-gray-300 rounded-xl dark:bg-neutral-600" />,
        );
    }

    return (
        <Animated.View
            className="absolute flex-row justify-center"
            style={viewAnimatedStyle}
        >
            <FlatList
                horizontal
                contentContainerClassName="flex-row gap-[5px] justify-center w-full"
                data={componentList}
                renderItem={({ item }) => item}
            />

            <View
                className="absolute"
                style={{
                    marginTop: insets.top + 8,
                }}
            >
                <Animated.View
                    className="w-[15px] h-[10px] bg-blue rounded-xl"
                    style={animatedStyle}
                />
            </View>
        </Animated.View>
    );
}
