import { useState } from "react";
import { View, Text, Pressable, TextInput } from "react-native";
import { router, useNavigation } from "expo-router";
import { useAtom } from "jotai";
import { MemberInfo } from "@/interfaces/community";
import { membersAtom, selectedJugsForMemberAtom } from "@/atom/community";
import StyledButton from "@/components/common/button";
import { useEffect } from "react";

export default function MemberInfoModal() {
    const navigation = useNavigation();

    return (
        <View className="mt-8 flex gap-6">
            <Text className="dark:text-white text-2xl text-center">
                This page is a non-functional placeholder
            </Text>
            <View className="mx-6 bg-gray-200 px-7 py-4 flex flex-col justify-between rounded-xl dark:bg-neutral-800">
                <Text className="text-xl font-bold dark:text-white">
                    Profile details
                </Text>
                <Text className="text-xl dark:text-white">Name</Text>
                <Text className="text-xl dark:text-white">Jugs</Text>
                <Text className="text-xl dark:text-white">Last drank</Text>
                <Text className="text-xl dark:text-white">Tags</Text>
            </View>
            <View className="mx-6 bg-gray-200 px-7 py-4 flex flex-col justify-between rounded-xl dark:bg-neutral-800">
                <Text className="text-xl font-bold dark:text-white">
                    Progress to target
                </Text>
                <Text className="text-xl dark:text-white">
                    Data here (tap to read more)
                </Text>
            </View>
            <View className="mx-6 bg-gray-200 px-7 py-4 flex flex-col justify-between rounded-xl dark:bg-neutral-800">
                <Text className="text-xl font-bold dark:text-white">
                    Trends
                </Text>
                <Text className="text-xl dark:text-white">
                    Data here (tap to read more)
                </Text>
            </View>
            <View className="mx-6 bg-gray-200 px-7 py-4 flex flex-col justify-between rounded-xl dark:bg-neutral-800">
                <Text className="text-xl font-bold dark:text-white">
                    Favourite drink
                </Text>
                <Text className="text-xl dark:text-white">Tea</Text>
            </View>
            <View className="mx-6 bg-gray-200 px-7 py-4 flex flex-col justify-between rounded-xl dark:bg-neutral-800">
                <Text className="text-xl font-bold dark:text-white">
                    Location
                </Text>
                <Text className="text-xl dark:text-white">Room 101</Text>
            </View>
            <View className="flex flex-row justify-center items-center">
                <Pressable
                    className="bg-blue px-4 py-2 rounded-xl"
                    onPress={() => {
                        router.push("add-device-member-modal");
                    }}
                >
                    <Text className="text-2xl font-semibold text-white">
                        Link jug to member
                    </Text>
                </Pressable>
            </View>
            <View className="flex flex-row justify-center items-center">
                <Pressable className="bg-blue px-4 py-2 rounded-xl">
                    <Text className="text-2xl font-semibold text-white">
                        Add drink
                    </Text>
                </Pressable>
            </View>
        </View>
    );
}
