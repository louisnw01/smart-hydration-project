import { View, Pressable, Text, TextInput } from "react-native";

import { useSetAtom } from "jotai";
import { registerInfoAtom } from "@/atom/user";
import GenericOnboardContent from "@/components/generic-onboard-content";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { textInputStyle } from "@/constants/styles";

export default function RegisterPage() {
    const router = useRouter();
    const setInfo = useSetAtom(registerInfoAtom);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");

    useEffect(() => {
        if (password !== confirmPassword) {
            setPasswordError("Passwords don't match");
        } else {
            setPasswordError("");
        }
    }, [password, confirmPassword]);

    return (
        <GenericOnboardContent
            title="Enter your email and password"
            nextHref="onboarding/name"
        >
            <View className="gap-5 mt-16 items-center">
                <View style={{ width: 350 }}>
                    <TextInput
                        placeholder="Enter your email address (required)"
                        onChangeText={(val) => {
                            setInfo((prev) => ({ ...prev, email: val }));
                        }}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        textContentType="emailAddress"
                        className={textInputStyle}
                    />
                </View>
                <View style={{ width: 350 }}>
                    <TextInput
                        placeholder="Enter your password (required)"
                        autoCapitalize="none"
                        onChangeText={(val) => {
                            setPassword(val);
                            setInfo((prev) => ({ ...prev, password: val }));
                        }}
                        textContentType="newPassword"
                        secureTextEntry={true}
                        className={textInputStyle}
                    />
                </View>
                <View style={{ width: 350 }}>
                    <TextInput
                        placeholder="Confirm your password (required)"
                        autoCapitalize="none"
                        onChangeText={(val) => setConfirmPassword(val)}
                        secureTextEntry={true}
                        className={textInputStyle}
                    />
                </View>
                <View style={{ width: 350 }}>
                    <Text style={{ color: "red", fontSize: 18 }}>
                        {passwordError}
                    </Text>
                </View>
                <Pressable
                    onPress={() => router.push("login")}
                    style={{ marginTop: 24 }}
                   //accessibilityRole="link"
                  //accessibilityLabel="Navigate to login"
                    >
                  {({ pressed }) => (
                      <Text style={{ fontWeight: '700', color: pressed ? 'darkblue' : 'blue', textDecorationLine: 'underline' }}>
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
