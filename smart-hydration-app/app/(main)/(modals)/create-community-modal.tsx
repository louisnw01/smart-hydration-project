import { useState } from "react";
import { View, Text, SectionList, Pressable, TextInput } from "react-native";
import { useAtomValue } from "jotai";
import { getAllJugsQAtom, linkJugToUserMAtom } from "@/atom/query";
import { useNavigation } from "expo-router";
import Button from "@/components/common/button";

export default function CreateCommunityModal() {
    const navigation = useNavigation();

    const handlePress = () => {
        navigation.goBack();
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
                    textContentType="name"
                    returnKeyType="done"
                />
            </View>
            <View className="flex flex-row justify-center items-center">
                <Button text="Submit" href="community"></Button>
            </View>
        </View>
    );
}
