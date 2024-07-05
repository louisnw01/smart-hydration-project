import { View, Pressable, Text, ScrollView, TextInput } from "react-native";

import { useEffect, useState } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { loginMAtom } from "@/atom/query";

import { authTokenAtom } from "@/atom/user";
import PageWrapper from "@/components/common/page-wrapper";
import Drop from "@/assets/svgs/water-drop-svgrepo-com.svg";
import { useRouter } from "expo-router";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const setAuthToken = useSetAtom(authTokenAtom);

    const { mutate, data, isPending, isError, isSuccess } = useAtomValue(loginMAtom);

    const handleSubmit = () => {
        mutate({ email, password });
    };

    useEffect(()=> {
        if(isSuccess){
            setAuthToken(data);
            router.replace("(tabs)");
        }
    }, [isSuccess])


    return (
        <PageWrapper>
            <ScrollView className="flex mt-20 gap-10">
                <View className="items-center gap-14">
                    <Text className="text-4xl font-bold">Login</Text>
                    <Drop width={100} height={100} />
                </View>
                <View className="mx-16 gap-5 mt-16 items-center">
                    <TextInput
                        placeholder="Enter your email address"
                        onChangeText={setEmail}
                        textContentType="emailAddress"
                        autoCapitalize="none"
                        keyboardType="email-address"
                        className="bg-gray-200 w-full h-14 placeholder-black text-xl rounded-xl px-3"
                    />
                    <TextInput
                        placeholder="Enter your password"
                        onChangeText={setPassword}
                        textContentType="password"
                        secureTextEntry={true}
                        className="bg-gray-200 w-full h-14 placeholder-black text-xl rounded-xl px-3"
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

