import { registerMAtom, sendVerificationEmailMAtom } from "@/atom/query";
import { authTokenAtom, registerInfoAtom, userModeAtom } from "@/atom/user";
import StyledButton from "@/components/common/button";
import Loading from "@/components/common/loading";
import GenericOnboardContent from "@/components/onboarding/generic-onboard-content";
import OnboardingHeader from "@/components/onboarding/onboarding-header";
import { useRouter } from "expo-router";
import { useAtomValue, useSetAtom } from "jotai";
import { useEffect } from "react";
import { Text, View } from "react-native";
import useSettings from "../hooks/user";

export default function SubmitPage() {
    const router = useRouter();
    const setAuthToken = useSetAtom(authTokenAtom);
    const clearRegisterInfo = useSetAtom(registerInfoAtom);
    const { mutate: sendVerificationEmail } = useAtomValue(
        sendVerificationEmailMAtom,
    );
    const setInfo = useSetAtom(registerInfoAtom);
    const userMode = useAtomValue(userModeAtom);
    const {
        mutate: submitAndRegister,
        data,
        isPending,
        isSuccess,
    } = useAtomValue(registerMAtom);
    const { isCarer } = useSettings();

    useEffect(() => {
        if (!isSuccess || !data) return;
        setAuthToken(data);
        clearRegisterInfo({});
        sendVerificationEmail();
        router.replace(isCarer ? "(tabs)/community" : "(tabs)");
    }, [isSuccess, data]);

    return (
        <GenericOnboardContent proceed={true}>
            <View className="py-4" />
            <OnboardingHeader text="You're almost there!" />
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
                        onPress={() => {
                            setInfo((prev) => ({ ...prev, mode: userMode }));
                            submitAndRegister();
                        }}
                    />
                )}
            </>
        </GenericOnboardContent>
    );
}
