import { useState } from "react";
// import PageHeading from "../common/page-heading";
// import PopupPage from "../popup-page";
import { start } from "react-native-esp-smartconfig";
import {
    Button,
    View,
    Text,
    TextInput,
    SectionList,
    Pressable,
} from "react-native";
import { ScrollView } from "react-native";
import { useAtomValue, useSetAtom } from "jotai";
import { getAllJugsQAtom, unlinkJugFromUserMAtom } from "@/atom/query";
import { popupPageAtom } from "@/atom/nav";
import colors from "@/colors";
import StyledButton from "../../components/common/button";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { DeviceInfo } from "@/interfaces/device";
import { selectedDeviceAtom } from "@/atom/device";

export default function DeviceInfoModal() {
    const navigation = useNavigation();
    const device = useAtomValue(selectedDeviceAtom);
    const { mutate: unlinkJugFromUser } = useAtomValue(unlinkJugFromUserMAtom);
    if (!device) return;
    return (
        <View className="flex flex-row justify-center py-20">
            <Pressable
                className="bg-red px-4 py-1 rounded-2xl"
                onPress={() => {
                    unlinkJugFromUser(device.id);
                    navigation.goBack();
                }}
            >
                <Text className="text-xl">Delete device</Text>
            </Pressable>
        </View>
    );
}
