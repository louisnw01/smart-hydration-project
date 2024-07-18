import { Pressable, Text, TextInput, View } from "react-native";
import { useAtomValue } from "jotai";
import { updateJugNameMAtom } from "@/atom/query";
import { selectedDeviceAtom } from "@/atom/device";
import { useState } from "react";
import { useRouter } from "expo-router";

export default function EditDeviceName() {
    const { mutate } = useAtomValue(updateJugNameMAtom);
    const currentJug = useAtomValue(selectedDeviceAtom);

    const [jugName, setJugName] = useState("");
    const router = useRouter();

    const handleSubmit = () => {
        const jugId = currentJug?.id;
        if (!jugId) return;
        mutate({ jugId, name: jugName });

        router.back();
    };

    return (
        <View className="mx-16 gap-5 mt-16 items-center">
            <TextInput
                placeholder={currentJug?.name}
                onChangeText={setJugName}
                className="bg-gray-200 w-full h-14 placeholder-black text-xl rounded-xl px-3"
            />
            <Pressable
                onPress={handleSubmit}
                className="bg-blue px-4 py-2 rounded-xl mt-10"
            >
                <Text className="text-2xl font-semibold text-white">
                    Submit
                </Text>
            </Pressable>
        </View>
    );
}
