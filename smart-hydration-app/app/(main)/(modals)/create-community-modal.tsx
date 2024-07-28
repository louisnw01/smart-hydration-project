import { useState } from "react";
import { View, Text, Pressable, TextInput } from "react-native";
import { createCommunityMAtom } from "@/atom/query/community";
import { useNavigation } from "expo-router";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { userHasCommunityAtom, communityNameAtom } from "@/atom/community";
import StyledTextInput from "@/components/common/text-input";
import StyledButton from "@/components/common/button";

export default function CreateCommunityModal() {
    const navigation = useNavigation();
    const setCommunityNameAtom = useSetAtom(communityNameAtom);
    const { mutate } = useAtomValue(createCommunityMAtom);
    const [showErrorMessage, setShowErrorMessage] = useState(false);
    const [, setUserHasCommunity] = useAtom(userHasCommunityAtom);
    const [communityName, setCommunityName] = useState('');

    const handlePress = () => {
        //to do: check if community exists before allowing creation 
        if (communityName !== '') {
            mutate({ name: communityName });
            setCommunityNameAtom(communityName);
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
                    Enter a community name:
                </Text>
            </View>
            <View className="flex flex-row justify-center items-center">
                <StyledTextInput
                    placeholder={`Community name (required)`}
                    onChangeText={(val) => {
                        setCommunityName(val);
                        setShowErrorMessage(false);
                    }}
                    textContentType="name"
                    returnKeyType="done"
                />
            </View>
            {showErrorMessage && (
                <View className="flex flex-row justify-center items-center">
                    <Text className="dark:text-white text-2xl">
                        You must enter a community name
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
