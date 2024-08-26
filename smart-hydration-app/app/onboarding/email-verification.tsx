import {
    addPushTokenMAtom,
    sendVerificationEmailMAtom,
    verifyEmailMAtom,
} from "@/atom/query";
import { authTokenAtom, pushTokenAtom } from "@/atom/user";
import StyledButton from "@/components/common/button";
import CountdownButton from "@/components/common/countdown-button";
import GenericOnboardContent from "@/components/onboarding/generic-onboard-content";
import OnboardingHeader from "@/components/onboarding/onboarding-header";
import useSession from "@/util/auth";
import { registerForPushNotificationsAsync } from "@/util/notifications";
import useColorPalette from "@/util/palette";
import { FontAwesome } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import { Redirect, router } from "expo-router";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

export default function EmailVerificationPage() {
    const setAuthAtom = useSetAtom(authTokenAtom);
    const verificationUrl = Linking.useURL();
    const palette = useColorPalette();
    const [errorMessage, setErrorMessage] = useState("");
    const { mutate: addPushToken } = useAtomValue(addPushTokenMAtom);
    const [storedPushToken, setStoredPushToken] = useAtom(pushTokenAtom);
    const { mutate, isPending, error, isSuccess, isIdle } =
        useAtomValue(verifyEmailMAtom);

    const { isEmailVerified } = useSession();

    useEffect(() => {
        setErrorMessage("");
        if (isPending || isIdle) return;
        if (!isSuccess) {
            setErrorMessage("Invalid verification code. Please try again");
        } else if (isSuccess) {
            if (storedPushToken) {
                addPushToken({ pushToken: storedPushToken });
            } else {
                registerForPushNotificationsAsync()
                    .then((pushToken) => {
                        if (!pushToken) return;
                        addPushToken({ pushToken });
                        setStoredPushToken(pushToken);
                    })
                    .catch((error: any) => console.error(error));
            }
        }
    }, [isSuccess, isPending]);

    useEffect(() => {
        if (!verificationUrl) return;
        if (verificationUrl.length >= 10) {
            mutate({ code: verificationUrl.slice(-10) });
        } else {
            mutate({ code: verificationUrl });
        }
    }, [verificationUrl]);

    if (isEmailVerified) {
        return <Redirect href="(tabs)" />;
    }

    return (
        <GenericOnboardContent proceed={true}>
            <View className="py-4" />
            <OnboardingHeader text="Verify your email" />
            <Text className="text-xl font-light dark:text-white">
                You haven't verified your email address yet. Please check your
                emails and click on the verification link to allow login.
            </Text>
            <View className="items-center">
                {isPending && <Text>Verifying..</Text>}
                {error && <Text className="text-red">{errorMessage}</Text>}
            </View>
            <View className="flex flex-row items-center justify-center">
                <CountdownButton
                    text="Resend email"
                    mutateAtom={sendVerificationEmailMAtom}
                    icon=<FontAwesome
                        name="send"
                        size={24}
                        color={palette.fg}
                    />
                />
            </View>
            <StyledButton
                text="Login as another user"
                buttonClass="justify-center bg-blue rounded-xl absolute inset-x-0 bottom-10"
                textClass="text-2xl text-white font-medium"
                onPress={() => {
                    setAuthAtom("");
                    router.replace("onboarding/login-register");
                }}
            />
        </GenericOnboardContent>
    );
}
