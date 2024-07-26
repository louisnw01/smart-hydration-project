import { useEffect, useState } from "react";
import { View, Text, Pressable, TextInput } from "react-native";
import { createCommunityMAtom } from "@/atom/query/community";
import { router, useNavigation } from "expo-router";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { userHasCommunityAtom, communityNameAtom } from "@/atom/community";

export default function CreateCommunityModal() {
    const [communityName, setCommunityName] = useState('');
    const hasCommunity = useAtomValue(userHasCommunityAtom);
    const { mutate, isPending, isSuccess, data, isError } = useAtomValue(createCommunityMAtom);
    const [showErrorMessage, setShowErrorMessage] = useState(false);

    useEffect(() => {
        if (isPending) return;
        if (isSuccess) {
            router.back();
        } else if (isError) {
            // TODO: show an error message
        }
    }, [isPending])

    const handlePress = () => {
        //to do: check if community exists before allowing creation
        if (communityName !== '') {
            mutate({ name: communityName });
        //     setCommunityNameAtom(communityName);
        //     setUserHasCommunity(true);
        //     navigation.goBack();
        } else {
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
