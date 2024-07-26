import { joinCommunityMAtom } from "@/atom/query/community";
import { router } from "expo-router";
import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import { View, Text, Pressable, TextInput } from "react-native";

export default function JoinCommunityModal() {
    const [inviteLink, setInviteLink] = useState('');
    const [showErrorMessage, setShowErrorMessage] = useState(false);
    const { mutate, isSuccess, isPending } = useAtomValue(joinCommunityMAtom);

    const handlePress = () => {
        if (!inviteLink) return setShowErrorMessage(true);
        // TODO: check invite link is valid
        const code = inviteLink.slice(-10)
        mutate({ code });
    };

    useEffect(() => {
        if (isSuccess && !isPending) {
            router.back();
        }
    }, [isSuccess])

    return (
        <View className="mt-8 flex gap-6">
            <View className="flex flex-row justify-center items-center">
                <Text className="dark:text-white text-2xl">
                    Paste your invite link below:
                </Text>
            </View>
            <View className="flex flex-row justify-center items-center">
                <TextInput
                    placeholder={`Invite link (required)`}
                    className="bg-gray-200 h-14 placeholder-black text-xl rounded-xl px-3"
                    onChangeText={(val) => {
                        setInviteLink(val);
                        setShowErrorMessage(false);
                    }}
                    textContentType="name"
                    returnKeyType="done"
                />
            </View>
            {showErrorMessage && (
            <View className="flex flex-row justify-center items-center">
                <Text className="dark:text-white text-2xl">
                    You must enter an invite link
                </Text>
            </View>
            )}
            <View className="flex flex-row justify-center items-center">
                <Pressable
                    onPress={handlePress}
                    className="bg-blue px-4 py-2 rounded-xl mt-10"
                ><Text className="text-2xl font-semibold text-white">
                        Submit
                    </Text></Pressable>
            </View>
        </View>
    );
}
