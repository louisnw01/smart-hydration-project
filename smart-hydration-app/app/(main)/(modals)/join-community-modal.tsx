import { joinCommunityMAtom } from "@/atom/query/community";
import StyledTextInput from "@/components/common/text-input";
import { router } from "expo-router";
import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";

export default function JoinCommunityModal() {
    const [inviteLink, setInviteLink] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const { mutate, isSuccess, isPending, error } =
        useAtomValue(joinCommunityMAtom);

    const handlePress = () => {
        if (!inviteLink) return;
        // TODO: check invite link is valid
        const code = inviteLink.slice(-10);
        mutate({ code });
    };

    useEffect(() => {
        if (error) setErrorMessage(error.message);
    }, [error]);

    useEffect(() => {
        if (isSuccess && !isPending) {
            router.back();
        }
    }, [isSuccess]);

    return (
        <View className="mt-8 flex gap-6 mx-6">
            <Text className="dark:text-white text-2xl w-full text-center">
                Paste your invite link below:
            </Text>
            <StyledTextInput
                title={`Invite link (required)`}
                onChangeText={(val) => {
                    setInviteLink(val);
                }}
                textContentType="name"
                returnKeyType="done"
            />
            {!!error && (
                <View className="bg-red px-4 py-2 rounded-xl">
                    <Text className="dark:text-white text-lg w-full">
                        {errorMessage}
                    </Text>
                </View>
            )}
            <View className="flex flex-row justify-center items-center">
                <Pressable
                    onPress={handlePress}
                    className="bg-blue px-4 py-2 rounded-xl mt-10"
                >
                    <Text className="text-2xl font-semibold text-white">
                        Submit
                    </Text>
                </Pressable>
            </View>
        </View>
    );
}
