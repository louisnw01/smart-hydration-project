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

