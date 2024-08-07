import { jugUserInfoAtom } from "@/atom/jug-user";
import { createJugUserMAtom } from "@/atom/query";
import colors from "@/colors";
import Loading from "@/components/common/loading";
import GenericOnboardContent from "@/components/onboarding/generic-onboard-content";
import OnboardingButton from "@/components/onboarding/onboarding-button";
import { useRouter } from "expo-router";
import { useAtomValue, useSetAtom } from "jotai";
import { useEffect } from "react";
import { Text } from "react-native";

export default function SubmitPage() {
    const router = useRouter();
    const clearJugUserInfo = useSetAtom(jugUserInfoAtom);
    const { mutate, isPending, isSuccess } = useAtomValue(createJugUserMAtom);

    useEffect(() => {
        if (!isSuccess) return;
        clearJugUserInfo({});
        router.replace("(tabs)/community");
    }, [isSuccess]);

    return (
        <GenericOnboardContent proceed={true}>
            <Text className="text-xl font-light dark:text-white">
                Tap the button to finish setting up your new jug user.
            </Text>
            <Loading isLoading={isPending} message="Setting up.." />
            <>
                {!isPending && (
                    <OnboardingButton
                        text="Submit"
                        color={colors.green}
                        onPress={() => mutate()}
                    />
                )}
            </>
        </GenericOnboardContent>
    );
}
