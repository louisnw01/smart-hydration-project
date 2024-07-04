import { registerMAtom } from "@/atom/query";
import { authTokenAtom, registerInfoAtom } from "@/atom/user";
import colors from "@/colors";
import Loading from "@/components/common/loading";
import GenericOnboardContent from "@/components/generic-onboard-content";
import OnboardingButton from "@/components/onboarding-button";
import { useRouter } from "expo-router";
import { useAtomValue, useSetAtom } from "jotai";
import { Text } from "react-native";

export default function SubmitPage() {
    const router = useRouter();
    const setAuthToken = useSetAtom(authTokenAtom);
    const clearRegisterInfo = useSetAtom(registerInfoAtom);
    const {
        mutate: submitAndRegister,
        data,
        isPending,
        isSuccess,
    } = useAtomValue(registerMAtom);

    if (isSuccess) {
        setAuthToken(data);
        clearRegisterInfo({});
        router.replace("(tabs)");
    }
    return (
        <GenericOnboardContent title="You're nearly there!">
            <Text className="text-xl font-light">
                Tap the button to set up your Smart Hydration profile.
            </Text>
            <Loading isLoading={isPending} message="registering.." />
            <>
                {!isPending && (
                    <OnboardingButton
                        text="Submit & Register"
                        color={colors.green}
                        onPress={() => submitAndRegister()}
                    />
                )}
            </>
        </GenericOnboardContent>
    );
}
