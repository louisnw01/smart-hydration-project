import { useState } from "react";
import { View, Text, Pressable, TextInput } from "react-native";
import { useNavigation } from "expo-router";
import { userHasCommunityAtom } from "@/atom/community";
import { useAtom } from "jotai";
import StyledButton from "@/components/common/button";
import StyledTextInput from "@/components/common/text-input";

export default function JoinCommunityModal() {
    const navigation = useNavigation();
    const [inviteLink, setInviteLink] = useState('');
    const [showErrorMessage, setShowErrorMessage] = useState(false);
    const [, setUserHasCommunity] = useAtom(userHasCommunityAtom);
    const handlePress = () => {
        if (inviteLink !== '') {
            //to do: check invite link is valid 
            //to do: create atom to send invite link to backend
            setUserHasCommunity(true);
            navigation.goBack();
        }
        else {
            setShowErrorMessage(true);
        }
    };

    return (
        <View className="mt-8 flex gap-6">
            <View className="flex flex-row justify-center items-center">
                <Text className="dark:text-white text-2xl">
                    Paste your invite link below:
                </Text>
            </View>
            <View className="flex flex-row justify-center items-center">
                <StyledTextInput
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
                <StyledButton
                    text="Submit"
                    href="community"
                    textClass="text-lg"
                    onPress={handlePress}
                />
            </View>
        </View>
    );
}
