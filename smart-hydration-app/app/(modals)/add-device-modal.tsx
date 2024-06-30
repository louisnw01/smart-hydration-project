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
    ActivityIndicator,
} from "react-native";
import { ScrollView } from "react-native";
import { useAtomValue, useSetAtom } from "jotai";
import { getAllJugsQAtom, linkJugToUserMAtom } from "@/atom/query";
import { popupPageAtom } from "@/atom/nav";
import colors from "@/colors";
import StyledButton from "../../components/common/button";
import { useNavigation } from "expo-router";
import Loading from "@/components/common/loading";

export default function MVPAddDeviceModal() {
    const { data, isLoading } = useAtomValue(getAllJugsQAtom);
    const navigation = useNavigation();
    const [selectedJugs, setSelectedJugs] = useState(new Set());
    const { mutate: linkJugsToUser } = useAtomValue(linkJugToUserMAtom);
    const handleSelect = (jug_id: string) => {
        if (selectedJugs.has(jug_id)) {
            selectedJugs.delete(jug_id);
        } else {
            selectedJugs.add(jug_id);
        }
        setSelectedJugs(new Set(selectedJugs));
    };

    const handlePress = () => {
        // alert(
        //     `todo: add jugs ${Array.from(selectedJugs).join(", ")} to account`,
        // );

        linkJugsToUser(Array.from(selectedJugs));

        // code to add to account here
        navigation.goBack();
    };

    return (
        <View className="flex gap-6 h-full pb-20">
            <View className="bg-purple-200 rounded-lg px-4 py-2 mx-2">
                <Text className="text-sm">
                    this page is temporary, and will not be shown in production.
                </Text>
            </View>

            <Loading isLoading={isLoading} message="Getting all jug names.." />

            {data && (
                <SectionList
                    sections={Object.entries(data).map(([name, list]) => ({
                        title: name == "real" ? "Real Jugs" : "Test Jugs",
                        data: list,
                    }))}
                    renderItem={({ item }) => (
                        <Pressable
                            className="mx-4 px-4 py-3 rounded-xl my-2"
                            onPress={() => handleSelect(item)}
                            style={{
                                backgroundColor: selectedJugs.has(item)
                                    ? "rgb(90, 240, 130)"
                                    : "rgb(240, 240, 240)",
                            }}
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
            {selectedJugs.size > 0 && (
                <Pressable
                    className="bg-blue items-center mx-16 justify-center px-3 py-3 rounded-3xl"
                    onPress={handlePress}
                >
                    <Text className="text-white text-2xl">
                        {`Add ${selectedJugs.size} jug${selectedJugs.size > 1 ? "s" : ""} to account`}
                    </Text>
                </Pressable>
            )}
        </View>
    );
}
