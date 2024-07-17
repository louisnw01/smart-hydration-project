import { useState } from "react";
import { View, Text, SectionList, Pressable } from "react-native";
import { useAtomValue } from "jotai";
import { getAllJugsQAtom, linkJugToUserMAtom } from "@/atom/query";
import { useNavigation } from "expo-router";
import Loading from "@/components/common/loading";

export default function CreateCommunityModal() {
    const navigation = useNavigation();

    const handlePress = () => {
        navigation.goBack();
    };

    return (
        <View className="flex gap-6 h-full pb-20">
            <View className="flex gap-6 h-full pb-20">
                <View className="flex flex-row justify-center items-center">
                    <Text className="dark:text-white text-2xl">
                        Placeholder message.
                    </Text>
                </View>
            </View>
        </View>
    );
}
