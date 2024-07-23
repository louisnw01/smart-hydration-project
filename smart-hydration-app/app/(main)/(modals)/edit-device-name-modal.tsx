import { Pressable, Text, TextInput, View } from "react-native";
import { useAtomValue } from "jotai";
import { updateJugNameMAtom } from "@/atom/query";
import { selectedDeviceAtom } from "@/atom/device";
import { useState } from "react";
import { useRouter } from "expo-router";
import StyledTextInput from "@/components/common/text-input";
import StyledButton from "@/components/common/button";

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
        <View className="mx-6 gap-20 mt-16">
            <StyledTextInput
                title="New Jug Name"
                placeholder={currentJug?.name}
                onChangeText={setJugName}
            />
            <StyledButton
                text="Submit"
                buttonClass="bg-green rounded-xl justify-center"
                textClass="text-xl text-white"
                onPress={handleSubmit}
            />
        </View>
    );
}
