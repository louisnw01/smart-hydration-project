import { View, Pressable, Text, ScrollView } from "react-native";

import { useState } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { loginMAtom } from "@/atom/query";

import { authTokenAtom } from "@/atom/user";
import PageWrapper from "@/components/common/page-wrapper";
import TextInputBox from "@/components/text-input-box";
import Drop from "@/assets/svgs/water-drop-svgrepo-com.svg";
import { useRouter } from "expo-router";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const setAuthToken = useSetAtom(authTokenAtom);

    const { mutate, data, isPending, isError } = useAtomValue(loginMAtom);

    if (data) {
        setAuthToken(data);
        router.replace("(tabs)");
    }

    const handleSubmit = () => {
        mutate({ email, password });
    };


    return (
        <PageWrapper>
            <ScrollView className="flex mt-20 gap-10">
                <View className="items-center gap-14">
                    <Text className="text-4xl font-bold">Login</Text>
                    <Drop width={100} height={100} />
                </View>
                <View className="mx-16 gap-5 mt-16 items-center">
                    <TextInputBox
                        placeholder="Enter your email address"
                        onChange={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                    />
                    <TextInputBox
                        placeholder="Enter your password"
                        onChange={setPassword}
                        textContentType="password"
                    />
                    {isPending && <Text>Logging in..</Text>}
                    {isError && (
                        <Text>
                            Incorrect username or password. Please try again
                        </Text>
                    )}
                    <Pressable
                        onPress={handleSubmit}
                        className="bg-blue px-4 py-2 rounded-xl mt-10"
                    >
                        <Text className="text-2xl font-semibold text-white">
                            Submit
                        </Text>
                    </Pressable>
                    <Pressable
                        onPress={() => router.push("onboarding/register")}
                        className="bg-blue px-4 py-2 rounded-xl mt-10"
                    >
                        <Text className="text-xl font-semibold text-white">
                            Register new account
                        </Text>
                    </Pressable>
                </View>
            </ScrollView>
        </PageWrapper>
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
