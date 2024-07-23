import { View, Pressable, Text, TextInput } from "react-native";

import { useAtomValue, useSetAtom } from "jotai";
import { registerInfoAtom } from "@/atom/user";
import GenericOnboardContent from "@/components/onboarding/generic-onboard-content";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { textInputStyle } from "@/constants/styles";
import { getUserExistsQAtom } from "@/atom/query";
import StyledTextInput from "@/components/common/text-input";

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
        </GenericOnboardContent>
    );
}

// <PageWrapper>
//            <View className='bg-gray-100 p-10 h-screen block'>
//                <PageProgressBar currentPage={pageIndex + 1} totalPages={pages.length}></PageProgressBar>
//                <View className='flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0'></View>
//                <View className='items-center justify-center p-9 space-y-7 md:space-y-9 sm:p-8'>
//                    <>
//                        {pageIndex === 0 &&
//                            <View className="flex gap-6">
//                                <Text className='text-4xl font-bold'>Smart Hydration</Text>
//                                <View className="flex flex-row justify-center">
//                                    <Drop width={100} height={100} />
//                                </View>
//                            </View>
//                        }
//                    </>
//                    <View>
//                        <GenericOnboardContent title={currentPageContent.title}>
//                            {currentPageContent.content}
//                        </GenericOnboardContent>
//                    </View>
//                </View>
//            </View>
//            <>{pageIndex < maxPageIndex - 1 && <NextButton onPress={handleNext} />}</>
//            <>{pageIndex === maxPageIndex - 1 && <SubmitButton onPress={handleSubmit} />}</>
//            <>{pageIndex > 0 && <BackButton onPress={handleBack} />}</>
//            <>{currentPageContent.skippable != 0 && <SkipButton onPress={handleSkip} />}</>
//        </PageWrapper>
