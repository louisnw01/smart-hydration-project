import { authTokenAtom } from "@/atom/user";
import colors from "@/colors";
import GenericOnboardContent from "@/components/onboarding/generic-onboard-content";
import OnboardingButton from "@/components/onboarding/onboarding-button";
import { Redirect, useRouter } from "expo-router";
import { useAtomValue, useSetAtom } from "jotai";
import { Pressable, Text, TextInput, View } from "react-native";
import CountdownButton from "@/components/common/countdown-button";
import { sendVerificationEmailMAtom, verifyEmailMAtom } from "@/atom/query";
import { useVerificationLink } from "@/components/common/verification-link";
import { useState } from "react";
import { router } from "expo-router";

export default function EmailVerificationPage() {
    const router = useRouter();
    const setAuthAtom = useSetAtom(authTokenAtom);
    const {url: verificationUrl} = useVerificationLink();
    const [testingCode, setTestingCode] = useState("");


    const { mutate, isPending, isError, isSuccess } =
        useAtomValue(verifyEmailMAtom);

    if (isSuccess) {
        router.replace("(tabs)");
    }

    const handleVerify = () => {
        mutate({code: testingCode})
    };

    return (
        <GenericOnboardContent proceed={true}>
            <Text className="text-xl font-light dark:text-white">
                You haven't verified your email address yet. Please check your emails and click on the verification link to allow login.
            </Text>
            <View className="items-center">
                {!verificationUrl &&
                    <><TextInput
                        placeholder="Enter your verification link"
                        onChangeText={(val) => {
                            const code = processVerificationUrl(val);
                            setTestingCode(code);
                        } }
                        autoCapitalize="none"
                        className="bg-gray-200 w-full h-14 placeholder-black text-xl rounded-xl px-3" />
                        <Pressable
                            onPress={handleVerify}
                            className="bg-blue px-4 py-2 rounded-xl mt-10"
                        >
                            <Text className="text-2xl font-semibold text-white">
                                Verify
                            </Text>
                        </Pressable></>}
            </View>
                <View className="flex flex-row items-center justify-center">
                <CountdownButton text="Resend email" mutateAtom={sendVerificationEmailMAtom}/>
                </View>
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

//function to extract verification code from link
// format = smarthydration://verify_email/auth=xxxxxxxx
function processVerificationUrl(url:string){
    const code:string = url.slice(-10);

    return code;
}
