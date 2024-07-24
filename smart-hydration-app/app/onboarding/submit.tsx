import { registerMAtom, sendVerificationEmailMAtom } from "@/atom/query";
import { authTokenAtom, registerInfoAtom } from "@/atom/user";
import colors from "@/colors";
import StyledButton from "@/components/common/button";
import Loading from "@/components/common/loading";
import GenericOnboardContent from "@/components/onboarding/generic-onboard-content";
import OnboardingButton from "@/components/onboarding/onboarding-button";
import { useRouter } from "expo-router";
import { useAtomValue, useSetAtom } from "jotai";
import { useEffect } from "react";
import { Text } from "react-native";

export default function SubmitPage() {
    const router = useRouter();
    const setAuthToken = useSetAtom(authTokenAtom);
    const clearRegisterInfo = useSetAtom(registerInfoAtom);
    const {mutate: sendVerificationEmail} = useAtomValue(sendVerificationEmailMAtom)
    const {
        mutate: submitAndRegister,
        data,
        isPending,
        isSuccess,
    } = useAtomValue(registerMAtom);

    useEffect(() => {
        if (!isSuccess || !data) return;
        setAuthToken(data);
        clearRegisterInfo({});
        sendVerificationEmail();
        router.replace("(tabs)");
    }, [isSuccess, data]);

    return (
        <GenericOnboardContent proceed={true}>
            <Text className="text-xl font-light text-center">
                Tap the button to set up your Smart Hydration profile.
            </Text>
            <Loading isLoading={isPending} message="registering.." />
            <>
                {!isPending && (
                    <StyledButton
                        text="Submit & Register"
                        buttonClass="bg-green self-center rounded-xl"
                        textClass="text-white text-lg font-semibold"
                        onPress={() => submitAndRegister()}
                    />
                )}
            </>
        </GenericOnboardContent>
    );
}
