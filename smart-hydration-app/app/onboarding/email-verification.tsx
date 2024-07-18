import { authTokenAtom } from "@/atom/user";
import colors from "@/colors";
import GenericOnboardContent from "@/components/onboarding/generic-onboard-content";
import OnboardingButton from "@/components/onboarding/onboarding-button";
import { useRouter } from "expo-router";
import { useSetAtom } from "jotai";
import { Text } from "react-native";

export default function EmailVerificationPage() {
    const router = useRouter();
    const setAuthAtom = useSetAtom(authTokenAtom);


    return (
        <GenericOnboardContent proceed={true}>
            <Text className="text-xl font-light dark:text-white">
                You haven't verified your email address yet. Please check your emails and click on the verification link to allow login.
            </Text>
                <OnboardingButton
                    text="Login as another user"
                    color={colors.green}
                    onPress={() => {
                        setAuthAtom("");
                        router.replace("onboarding/login-register");
                    }}
                />
        </GenericOnboardContent>
    );
}
