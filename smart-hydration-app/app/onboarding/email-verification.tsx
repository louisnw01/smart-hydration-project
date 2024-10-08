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
import useColorPalette from "@/util/palette";
import { FontAwesome } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import { router } from "expo-router";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import useSettings from "../hooks/user";
import { registerForPushNotificationsAsync } from "@/util/notifications";

export default function EmailVerificationPage() {
    const setAuthAtom = useSetAtom(authTokenAtom);
    const verificationUrl = Linking.useURL();
    const [code, setCode] = useState("");
    const palette = useColorPalette();
    const { isCarer } = useSettings();
    const [errorMessage, setErrorMessage] = useState("");
    const { mutate: addPushToken } = useAtomValue(addPushTokenMAtom);
    const [storedPushToken, setStoredPushToken] = useAtom(pushTokenAtom);

    //function to extract verification code from link
    //format = smarthydration://verify_email/auth=xxxxxxxx
    function processVerificationUrl(url: string) {
        if (url.length >= 10) {
            setCode(url.slice(-10));
        } else {
            setCode(url);
        }
    }

    const { mutate, isSuccess, isPending, error } =
        useAtomValue(verifyEmailMAtom);

    useEffect(() => {
        if (!isSuccess || error) {
            setErrorMessage(error?.message ?? "");
        } else {
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
            router.replace("(tabs)");
        }
    }, [isSuccess, error]);

    useEffect(() => {
        if (!verificationUrl) return;
        processVerificationUrl(verificationUrl);
    }, [verificationUrl]);

    useEffect(() => {
        if (code) handleVerify();
    }, [code]);

    const handleVerify = () => {
        mutate({ code });
    };

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
