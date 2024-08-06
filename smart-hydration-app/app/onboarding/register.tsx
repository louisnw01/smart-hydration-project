import Logo from "@/assets/svgs/SH_logo.svg";
import { getUserExistsQAtom } from "@/atom/query";
import { registerInfoAtom } from "@/atom/user";
import KeyboardScrollView from "@/components/common/keyboard-scrollview";
import StyledTextInput from "@/components/common/text-input";
import GenericOnboardContent from "@/components/onboarding/generic-onboard-content";
import OnboardingHeader from "@/components/onboarding/onboarding-header";
import { useRouter } from "expo-router";
import { useAtomValue, useSetAtom } from "jotai";
import { useEffect, useRef, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export default function RegisterPage() {
    const router = useRouter();
    const setInfo = useSetAtom(registerInfoAtom);
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [emailError, setEmailErrorMessage] = useState("");
    const [proceed, setProceed] = useState(false);
    const [passwordValid, setPasswordValid] = useState(false);
    const [emailValid, setEmailValid] = useState(false);
    const { isLoading, data, refetch } = useAtomValue(getUserExistsQAtom);
    const passwordRef = useRef<TextInput>();
    const confirmPasswordRef = useRef<TextInput>();

    useEffect(() => {
        if (isLoading || !data) return;
        setEmailErrorMessage(
            "This email is already linked to an account. Either go to login or use a different email.",
        );
    }, [data]);

    useEffect(() => {
        if (email && !regex.test(email)) {
            setEmailErrorMessage("Invalid email format.");
            setEmailValid(false);
            setProceed(false);
        } else {
            setEmailErrorMessage("");
            setEmailValid(true);
            setProceed(true && passwordValid);
        }
    }, [email]);

    useEffect(() => {
        if (password !== confirmPassword) {
            setPasswordError("Passwords don't match\n");
            setPasswordValid(false);
            setProceed(false);
        } else {
            setPasswordError("");
            setInfo((prev) => ({ ...prev, password: password }));
            setPasswordValid(true);
            setProceed(true && emailValid);
        }
    }, [password, confirmPassword]);

    const validatePassword = () => {
        if (password.length == 0) {
            setPasswordError("You must enter a password\n");
            setPasswordValid(false);
            setProceed(false);
        }
    };

    const validateEmail = () => {
        if (email.length == 0) {
            setEmailErrorMessage("You must enter your email");
            setEmailValid(false);
            setProceed(false);
        }
    };

    return (
        <GenericOnboardContent nextHref="onboarding/name" proceed={proceed}>
            <KeyboardScrollView keyboardVerticalOffset={-60}>
                <View className="self-center mb-8" style={{}}>
                    <Logo width={330} height={105} />
                </View>
                <OnboardingHeader text="Sign Up" />
                <View className="gap-5 mt-16">
                    <StyledTextInput
                        requiredIcon
                        title="Email Address"
                        placeholder="example@gmail.com"
                        onChangeText={(val) => setEmail(val.toLowerCase())}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        textContentType="emailAddress"
                        onSubmitEditing={() => {
                            validateEmail();
                            setInfo((prev) => ({ ...prev, email: email }));
                            refetch();
                            passwordRef.current?.focus();
                        }}
                        onEndEditing={() => {
                            validateEmail();
                            setInfo((prev) => ({ ...prev, email: email }));
                            refetch();
                        }}
                    />

                    <StyledTextInput
                        inputRef={passwordRef}
                        requiredIcon
                        title="Password"
                        autoCapitalize="none"
                        onChangeText={(val) => setPassword(val)}
                        textContentType="newPassword"
                        secureTextEntry={true}
                        onSubmitEditing={() => {
                            validatePassword();
                            confirmPasswordRef.current?.focus();
                        }}
                    />

                    <StyledTextInput
                        inputRef={confirmPasswordRef}
                        requiredIcon
                        title="Confirm Password"
                        autoCapitalize="none"
                        onChangeText={(val) => setConfirmPassword(val)}
                        secureTextEntry={true}
                        onSubmitEditing={() => {
                            if (proceed) router.push("onboarding/name");
                        }}
                    />

                    <Text style={{ color: "red", fontSize: 18 }}>
                        {passwordError}
                        {emailError}
                    </Text>

                    <Pressable
                        onPress={() => router.push("onboarding/login")}
                        style={{ marginTop: 24 }}
                        //accessibilityRole="link"
                        //accessibilityLabel="Navigate to login"
                    >
                        {({ pressed }) => (
                            <Text
                                style={{
                                    fontWeight: "600",
                                    color: pressed ? "darkblue" : "blue",
                                    textDecorationLine: "underline",
                                }}
                            >
                                Already have an account? Login
                            </Text>
                        )}
                    </Pressable>
                </View>
            </KeyboardScrollView>
        </GenericOnboardContent>
    );
}
