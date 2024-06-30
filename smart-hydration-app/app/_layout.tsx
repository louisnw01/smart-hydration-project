import NavigationBar from "@/components/nav";
import "../global.css";
import { Appearance, Dimensions, View, StyleSheet, Text } from "react-native";
import PageRouter from "@/components/page-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useAtomValue, useSetAtom } from "jotai";
import { authTokenAtom, isLoggedInAtom } from "@/atom/user";
import OnboardingRouter from "@/components/onboarding-router";
import { getItemAsync, deleteItemAsync } from "expo-secure-store";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { request } from "@/util/fetch";
import ModalRouter from "@/components/modal-router";

import { SharedValue } from "react-native-gesture-handler/lib/typescript/handlers/gestures/reanimatedWrapper";
import { Stack } from "expo-router";

export default function Index() {
    const setAuthToken = useSetAtom(authTokenAtom);
    const isLoggedIn = useAtomValue(isLoggedInAtom);
    const insets = useSafeAreaInsets();

    const screenHeight = Dimensions.get("window").height;

    // const animatedStyles = useAnimatedStyle(() => ({
    //     transform: [
    //         {
    //             scale: interpolate(
    //                 animation.value,
    //                 [screenHeight, 0],
    //                 [1, 0.9],
    //             ),
    //         },
    //     ],
    //     paddingTop: insets.top,
    //     paddingBottom: insets.bottom,
    // }));

    Appearance.setColorScheme("light");

    const getTokenFromStorage = async () => {
        const token = await getItemAsync("auth_token");
        if (!token) return;
        const result = await request("/check-token", {
            method: "post",
            auth: token,
        });
        if (result.ok) {
            setAuthToken(token);
        } else {
            deleteItemAsync("auth_token");
        }
    };
    getTokenFromStorage();

    // if (!isLoggedIn) {
    //     return <OnboardingRouter />;
    // }

    return (
        // <GestureHandlerRootView>
        // {/* <AnimationContext.Provider value={animation}> */}
        // <View className="flex flex-1 bg-black">
        // {/* <Animated.View */}
        // className="flex flex-1 bg-white dark:bg-black"
        // style={animatedStyles}
        // >
        <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
                name="(modals)"
                options={{ headerShown: false, presentation: "formSheet" }}
            />
        </Stack>
        // {/* <PageRouter / > */}
        // {/* <NavigationBar /> */}
        //             </Animated.View>
        //         </View>
        //         {/* <ModalRouter /> */}
        //     </AnimationContext.Provider>
        // </GestureHandlerRootView>
    );
}
