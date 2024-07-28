import { useState } from "react";
import { View, Text, Pressable, TextInput } from "react-native";
import { useNavigation } from "expo-router";
import { userHasCommunityAtom } from "@/atom/community";
import { useAtom } from "jotai";
import StyledButton from "@/components/common/button";
import StyledTextInput from "@/components/common/text-input";

export default function ApplyTags() {
    const navigation = useNavigation();
    const [inviteLink, setInviteLink] = useState('');
    const [showErrorMessage, setShowErrorMessage] = useState(false);
    const [, setUserHasCommunity] = useAtom(userHasCommunityAtom);
    const handlePress = () => {
        
    };

    return (
        <View className="mt-8 flex gap-6">
            <View className="flex flex-row justify-center items-center">
                <Text className="dark:text-white text-2xl">
                    Apply tags
                </Text>
            </View>
        </View>
    );
}
