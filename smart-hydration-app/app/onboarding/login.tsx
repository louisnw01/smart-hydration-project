import { Text, TextInput, View } from "react-native";

import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useEffect, useRef, useState } from "react";

import Logo from "@/assets/svgs/SH_logo.svg";
import { addPushTokenMAtom, loginMAtom } from "@/atom/query";
import { authTokenAtom, pushTokenAtom } from "@/atom/user";
import StyledButton from "@/components/common/button";
import KeyboardScrollView from "@/components/common/keyboard-scrollview";
import PageWrapper from "@/components/common/page-wrapper";
import StyledTextInput from "@/components/common/text-input";
import OnboardingHeader from "@/components/onboarding/onboarding-header";
import { registerForPushNotificationsAsync } from "@/util/notifications";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import useSettings from "../hooks/user";
import { Dimensions } from "react-native";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const setAuthToken = useSetAtom(authTokenAtom);
    const [storedPushToken, setStoredPushToken] = useAtom(pushTokenAtom);
    const { isCarer } = useSettings();

    const passwordRef = useRef<TextInput>();

    const {
        mutate: login,
        data,
        isPending,
        isError,
        isSuccess,
    } = useAtomValue(loginMAtom);

    const { mutate: addPushToken } = useAtomValue(addPushTokenMAtom);
    const insets = useSafeAreaInsets();

    const handleSubmit = () => {
        login({ email, password });
    };

    useEffect(() => {
        if (!isSuccess && !data) return;
        setAuthToken(data);
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
        router.replace(isCarer ? "(tabs)/community" : "(tabs)");
    }, [isSuccess, data]);

    const windowHeight = Dimensions.get("screen").height;

    return (
        <PageWrapper>
            <KeyboardScrollView
                keyboardVerticalOffset={windowHeight > 667 ? -100 : -20}
            >
                <View
                    className={`self-center mb-8 ${windowHeight > 667 ? "top-10" : "top-8 pb-8"}`}
                    style={{}}
                >
                    <Logo width={330} height={105} />
                </View>
                <OnboardingHeader text="Login" />
                <View className="mx-6 gap-5 mt-16">
                    <StyledTextInput
                        placeholder="example@gmail.com"
                        onChangeText={(val) => setEmail(val.toLowerCase())}
                        textContentType="emailAddress"
                        autoCapitalize="none"
                        keyboardType="email-address"
                        title="Email Address"
                        onSubmitEditing={() => passwordRef.current?.focus()}
                        returnKeyType="done"
                    />
                    <StyledTextInput
                        inputRef={passwordRef}
                        onChangeText={setPassword}
                        textContentType="password"
                        secureTextEntry={true}
                        title="Password"
                        returnKeyType="done"
                        autoCapitalize="none"
                        onSubmitEditing={() => handleSubmit()}
                    />
                    {isPending && <Text>Logging in..</Text>}
                    {isError && (
                        <Text className="text-red">
                            Incorrect username or password. Please try again
                        </Text>
                    )}
                    <StyledButton
                        text="Log In"
                        buttonClass="py-3 bg-black justify-center rounded-xl mt-10 dark:bg-white"
                        textClass="text-xl font-medium text-white dark:text-black"
                        onPress={handleSubmit}
                    />

                    <StyledButton
                        text="Register"
                        buttonClass="py-3 justify-center rounded-xl -mt-2 bg-white dark:bg-black border border-black dark:border-neutral-600"
                        textClass="text-xl font-medium"
                        onPress={() => router.push("onboarding/register")}
                    />
                </View>
            </KeyboardScrollView>
        </PageWrapper>
    );
}
