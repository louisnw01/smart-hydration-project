import { View, Pressable, Text } from "react-native";

import { useSetAtom } from "jotai";
import TextInputBox from "@/components/text-input-box";
import { registerInfoAtom } from "@/atom/user";
import GenericOnboardContent from "@/components/generic-onboard-content";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";

export default function RegisterPage() {
    const router = useRouter();
    const setInfo = useSetAtom(registerInfoAtom);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');

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
                    <TextInputBox
                        placeholder="Enter your email address"

                        onChange={(val) => {
                            setInfo((prev) => ({ ...prev, email: val }));
                        }}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                </View>
                <View style={{ width: 350 }}>
                    <TextInputBox
                        placeholder="Enter your password"
                        autoCapitalize="none"
                        onChange={(val) => {
                            setPassword(val);
                            setInfo((prev) => ({ ...prev, password: val }));
                        }}
                        textContentType="password"
                    />
                </View>
                <View style={{ width: 350 }}>
                    <TextInputBox
                        placeholder="Confirm your password"
                        autoCapitalize="none"
                        onChange={(val) => setConfirmPassword(val)}
                        textContentType="password"
                    />
                </View>
                <View style={{ width: 350 }}>
                    <Text style={{ color: "red", fontSize: 18 }}>{passwordError}</Text>
                </View>
                <Pressable
                    onPress={() => router.push("login")}
                    className="bg-blue px-4 py-2 rounded-xl mt-16"
                >
                    <Text className="font-semibold text-white">
                        already have an account? Login
                    </Text>
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
