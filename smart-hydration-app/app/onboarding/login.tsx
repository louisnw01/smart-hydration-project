import { View, Pressable, Text, ScrollView, TextInput } from "react-native";

import { useEffect, useState } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { loginMAtom } from "@/atom/query";

import { authTokenAtom } from "@/atom/user";
import PageWrapper from "@/components/common/page-wrapper";
import Drop from "@/assets/svgs/water-drop-svgrepo-com.svg";
import { Redirect, useRouter } from "expo-router";
import useColorPalette from "@/util/palette";
import StyledTextInput from "@/components/common/text-input";
import StyledButton from "@/components/common/button";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const setAuthToken = useSetAtom(authTokenAtom);
    const palette = useColorPalette();

    const { mutate, data, isPending, isError, isSuccess } =
        useAtomValue(loginMAtom);

    const handleSubmit = () => {
        mutate({ email, password });
    };

    if (isSuccess && data) {
        setAuthToken(data);
        return <Redirect href="(tabs)" />;
    }

    return (
        <PageWrapper>
            <ScrollView className="mt-20 gap-10">
                <View className="self-center">
                    <Drop width={100} height={100} fill={palette.border} />
                </View>
                <View className="mx-6 gap-5 mt-16">
                    <StyledTextInput
                        placeholder="example@gmail.com"
                        onChangeText={(val) => setEmail(val.toLowerCase())}
                        textContentType="emailAddress"
                        autoCapitalize="none"
                        keyboardType="email-address"
                        title="Email Address"
                    />
                    <StyledTextInput
                        onChangeText={setPassword}
                        textContentType="password"
                        secureTextEntry={true}
                        title="Password"
                    />
                    {isPending && <Text>Logging in..</Text>}
                    {isError && (
                        <Text>
                            Incorrect username or password. Please try again
                        </Text>
                    )}
                    <StyledButton
                        text="Log In"
                        textSize="xl"
                        buttonClass="py-3 bg-black justify-center rounded-xl mt-10 dark:bg-white"
                        textClass="font-medium text-white dark:text-black"
                        onPress={handleSubmit}
                    />

                    <StyledButton
                        text="Register"
                        textSize="xl"
                        buttonClass="py-3 justify-center rounded-xl -mt-2 border border-black dark:border-neutral-600"
                        textClass="font-medium dark:text-white"
                        onPress={() => router.push("onboarding/register")}
                    />
                    {/* <Pressable
                        onPress={handleSubmit}
                        className="bg-blue px-4 py-2 rounded-xl mt-10"
                    >
                        <Text className="text-2xl font-semibold text-white">
                            Submit
                        </Text>
                    </Pressable> */}
                    {/* <Pressable
                        onPress={() => router.push("onboarding/register")}
                        className="mt-10"
                    >
                        {({ pressed }) => (
                            <Text
                                style={{
                                    fontWeight: "600",
                                    color: pressed ? "darkblue" : "blue",
                                    textDecorationLine: "underline",
                                }}
                            >
                                Register new account
                            </Text>
                        )}
                    </Pressable> */}
                </View>
            </ScrollView>
        </PageWrapper>
    );
}
