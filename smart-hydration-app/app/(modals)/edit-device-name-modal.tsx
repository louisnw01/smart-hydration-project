import { Pressable, Text, View } from "react-native";
import { useAtomValue, useSetAtom } from "jotai";
import { updateJugNameMAtom } from "@/atom/query";
import { selectedDeviceAtom } from "@/atom/device";
import TextInputBox from "@/components/text-input-box";
import { useState } from "react";
import { useRouter } from "expo-router";


export default function EditDeviceName() {
    const {mutate} = useAtomValue(updateJugNameMAtom)
    const currentJug = useAtomValue(selectedDeviceAtom)
    const [jugName, setJugName] = useState("");
    const router = useRouter()

    const handleSubmit = () => {
        const jugId = currentJug?.id as string;
        mutate({ jugId, name: jugName });
        router.back();
    };

    return(
        <View className="mx-16 gap-5 mt-16 items-center">
            <TextInputBox placeholder={currentJug?.name} onChange={setJugName} />
            <Pressable onPress={handleSubmit} className="bg-blue px-4 py-2 rounded-xl mt-10">
                <Text className="text-2xl font-semibold text-white">
                   Submit
                </Text>
            </Pressable>
        </View>
    )
}
