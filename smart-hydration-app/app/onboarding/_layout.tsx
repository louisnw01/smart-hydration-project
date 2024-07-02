import OnboardingHeader from "@/components/onboarding/onboarding-header";
import { Stack } from "expo-router";

export default function OnboardingLayout() {
    return (
        <Stack
            screenOptions={{
                // headerShown: false,
                // headerTitleAlign: "left",
                headerShadowVisible: false,
                headerBackVisible: false,
                contentStyle: {
                    backgroundColor: "white",
                },
                header: (props) => <OnboardingHeader {...props} />,
            }}
        >
            <Stack.Screen
                name="login-register"
                options={{
                    title: "Smart Hydration",
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
                name="submit"
                options={{
                    title: "You're almost there!",
                }}
            />
        </Stack>
    );
}
