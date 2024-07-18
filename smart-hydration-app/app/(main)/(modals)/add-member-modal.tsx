import { useState } from "react";
import { View, Text, Pressable, TextInput } from "react-native";
import { createCommunityMAtom } from "@/atom/query/community";
import { useNavigation } from "expo-router";
import { useAtom, useAtomValue } from "jotai";
import { userHasCommunityAtom, memberNamesAtom } from "@/atom/community";
import StyledButton from "@/components/common/button";

export default function AddMemberModal() {
    const navigation = useNavigation();
    const [communityName, setCommunityName] = useState('');
    const [, setMemberNameAtom] = useAtom(memberNamesAtom);
    const {mutate} = useAtomValue(createCommunityMAtom);
    const [showErrorMessage, setShowErrorMessage] = useState(false);
    const [, setUserHasCommunity] = useAtom(userHasCommunityAtom);

    const handlePress = () => {
        //button press logic
        //don't allow press when no member name added or no jug added
    
    };
    //need to store member name in array
    //to do later: send member details to db when each member added 

    return (
        <View className="mt-8 flex gap-6">
            <View className="flex flex-row justify-center items-center">
                <Text className="dark:text-white text-2xl">
                    Enter the member's name:
                </Text>
            </View>
            <View className="flex flex-row justify-center items-center">
                <TextInput
                    placeholder={`Member name (required)`}
                    className="bg-gray-200 h-14 placeholder-black text-xl rounded-xl px-3"
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
                    You must enter a member name
                </Text>
            </View>
            )}
            <View className="flex flex-row justify-center">
                            <StyledButton
                                text="+Add member's jug(s)"
                                href="add-device-modal"
                                textSize="lg"
                            />
                        </View>
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
