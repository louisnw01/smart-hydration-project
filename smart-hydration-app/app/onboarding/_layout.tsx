import OnboardingHeader from "@/components/onboarding/onboarding-header";
import useColorPalette from "@/util/palette";
import { Stack } from "expo-router";

export default function OnboardingLayout() {
    const palette = useColorPalette();
    return (
        <Stack
            screenOptions={{
                // headerShown: false,
                // headerTitleAlign: "left",
                headerShadowVisible: false,
                headerBackVisible: false,
                contentStyle: {
                    backgroundColor: palette.bg,
                },
                header: (props) => <OnboardingHeader {...props} />,
            }}
        >
            <Stack.Screen
                name="login-register"
                options={{
                    title: "smart hydration",
                }}
            />
            <Stack.Screen
                name="login"
                options={{
                    title: "Login",
                }}
            />
            <Stack.Screen
                name="register"
                options={{
                    title: "Sign up",
                }}
            />
            <Stack.Screen
                name="name"
                options={{
                    title: "What is your name?",
                }}
            />
            <Stack.Screen
                name="user-mode"
                options={{
                    title: "What mode would you like to use?",
                }}
            />
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
    );
}
