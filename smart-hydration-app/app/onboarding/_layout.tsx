import OnboardingProgressBar from "@/components/onboarding/onboarding-progress";
import useColorPalette from "@/util/palette";
import { Stack } from "expo-router";

export default function OnboardingLayout() {
    const palette = useColorPalette();
    return (
        <>
            <Stack
                screenOptions={{
                    headerShown: false,
                    // headerTitleAlign: "left",
                    headerShadowVisible: false,
                    headerBackVisible: false,
                    contentStyle: {
                        backgroundColor: palette.bg,
                    },
                }}
            >
                <Stack.Screen
                    name="login-register"
                    options={{
                        title: "smart hydration",
                    }}
                />
                <Stack.Screen name="login" />
                <Stack.Screen name="register" />
                <Stack.Screen name="name" />
                <Stack.Screen name="user-mode" />
                <Stack.Screen
                    name="dob"
                    options={{
                        title: "What is your date of birth?",
                    }}
                />
                <Stack.Screen
                    name="submit"
                    options={{
                        title: "You're almost there!",
                    }}
                />
                <Stack.Screen
                    name="email-verification"
                    options={{
                        title: "Verify your email",
                    }}
                />
            </Stack>
            <OnboardingProgressBar />
        </>
    );
}
