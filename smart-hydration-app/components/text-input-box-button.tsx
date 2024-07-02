import React, { useState } from "react";
import { Text, TextInput, View, Pressable } from "react-native";
import { useAtomValue, useAtom } from "jotai";
import { linkJugToUserMAtom } from "@/atom/query";

interface TextInputProperties {
    name: string;
    label?: string;
    placeholder?: string;
}

//add validation to ensure only text can be entered?
export default function TextInputWithButton({
    name,
    label,
    placeholder,
}: TextInputProperties) {
    const [text, setText] = useState("");
    const { mutate } = useAtomValue(linkJugToUserMAtom);

    return (
        <View className="flex justify-center">
            <Text className="block mb-4 text-sm font-medium text-gray-900 dark:text-black">
                {label}
            </Text>
            <TextInput
                placeholder={placeholder}
                onChangeText={setText}
                id={name}
                className="bg-gray-50 border-0 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
            <View className="py-5">
                <Pressable
                    className="bg-gray-200 py-1 rounded-2xl flex flex-row justify-center"
                    onPress={() => {
                        mutate(text);
                        setPopup("none");
                    }}
                >
                    <Text className="text-xl">Click to add</Text>
                </Pressable>
            </View>
        </View>
    );
}
