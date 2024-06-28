import { useState } from "react";
import PageHeading from "../common/page-heading";
import PopupPage from "../popup-page";
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
import { getAllJugsQAtom } from "@/atom/query";
import { popupPageAtom } from "@/atom/nav";

export default function MVPAddDeviceModal() {
    const { data, isLoading } = useAtomValue(getAllJugsQAtom);
    const setPopup = useSetAtom(popupPageAtom);

    const handlePress = (jug_id: string) => {
        // TODO add jug to account
        alert(`todo: add jug ${jug_id} to account`);
        setPopup("none");
    };

    return (
        <PopupPage>
            <PageHeading text="Add a device" />
            <View className="bg-purple-200 rounded-lg mt-14 px-4 py-2 mx-2">
                <Text className="text-sm">
                    this page is temporary, and will not be shown in production.
                </Text>
            </View>

            {data && (
                <SectionList
                    sections={Object.entries(data).map(([name, list]) => ({
                        title: name == "real" ? "Real Jugs" : "Test Jugs",
                        data: list,
                    }))}
                    renderItem={({ item }) => (
                        <Pressable
                            className="mx-4 px-4 py-3 bg-gray-200 rounded-xl my-2"
                            onPress={() => handlePress(item)}
                        >
                            <Text className="text-lg">{item}</Text>
                        </Pressable>
                    )}
                    renderSectionHeader={({ section }) => (
                        <Text className="text-xl font-bold ml-4 pt-4">
                            {section.title}
                        </Text>
                    )}
                    keyExtractor={(item) => `jug-list-${item}`}
                    stickySectionHeadersEnabled={false}
                />
            )}
        </PopupPage>
    );
}
