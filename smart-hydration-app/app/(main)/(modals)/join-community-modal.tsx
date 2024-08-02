import { inviteCodeAtom } from "@/atom/user";
import StyledButton from "@/components/common/button";
import StyledTextInput from "@/components/common/text-input";
import { router } from "expo-router";
import { useSetAtom } from "jotai";
import { useState } from "react";
import { Text, View } from "react-native";

const regex =
    /^https:\/\/hydrationapi\.louisnw\.com\/community\/redirect_invite\/[A-Za-z0-9]{10}$/;

export default function JoinCommunityModal() {
    const [inviteLink, setInviteLink] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const setInviteCode = useSetAtom(inviteCodeAtom);

    const handlePress = () => {
        if (!inviteLink) return;
        if (!regex.test(inviteLink)) {
            setErrorMessage("This link is not valid");
            return;
        }
        setErrorMessage("");
        const code = inviteLink.slice(-10);
        setInviteCode(code);
        router.push("(modals)/confirm-join-community-modal");
    };

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
            {errorMessage && (
                <View className="px-4 py-2 rounded-xl">
                    <Text className="text-red text-lg w-full">
                        {errorMessage}
                    </Text>
                </View>
            )}
            <View className="flex flex-row justify-center items-center">
                <StyledButton
                    text="Submit"
                    textClass="text-lg text-white font-medium"
                    buttonClass="bg-green"
                    onPress={handlePress}
                />
            </View>
        </View>
    );
}
