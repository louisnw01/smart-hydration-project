import { useState } from "react";
import { View, Text, Pressable, TextInput } from "react-native";
import { createCommunityMAtom } from "@/atom/query/community";
import { useNavigation } from "expo-router";
import { useAtom, useAtomValue } from "jotai";
import { userHasCommunityAtom } from "@/atom/community";

export default function CreateCommunityModal() {
    const navigation = useNavigation();
    const [communityName, setName] = useState('');
    const {mutate} = useAtomValue(createCommunityMAtom);
    const [showErrorMessage, setShowErrorMessage] = useState(false);
    const [, setUserHasCommunity] = useAtom(userHasCommunityAtom);

    const handlePress = () => {
        //to do: check if community exists before allowing creation 
        if(communityName !== ''){
            mutate({ name: communityName });
            setUserHasCommunity(true);
            navigation.goBack();
        }
        else{
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
                <TextInput
                    placeholder={`Community name (required)`}
                    className="bg-gray-200 h-14 placeholder-black text-xl rounded-xl px-3"
                    onChangeText={(val) => { 
                        setName(val); 
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
