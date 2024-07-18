import { useState } from "react";
import { View, Text, Pressable, TextInput } from "react-native";
import { useAtomValue } from "jotai";
import { getAllJugsQAtom, linkJugToUserMAtom } from "@/atom/query";
import { useNavigation } from "expo-router";

//to do: create atom to send invite link to backends
export default function JoinCommunityModal() {
    const navigation = useNavigation();
    const handlePress = () => {
        navigation.goBack();
    };

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
                    textContentType="name"
                    returnKeyType="done"
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
