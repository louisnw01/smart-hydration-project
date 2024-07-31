import { useState } from "react";
import { View, Text, SectionList, Pressable } from "react-native";
import { useAtom, useAtomValue } from "jotai";
import { getAllJugsQAtom } from "@/atom/query";
import { useNavigation } from "expo-router";
import Loading from "@/components/common/loading";
import { selectedJugsForMemberAtom } from "@/atom/community";
import StyledButton from "@/components/common/button";

export default function AddDeviceMemberModal() {
    const { data, isLoading } = useAtomValue(getAllJugsQAtom);
    const navigation = useNavigation();
    const [selectedJugs, setSelectedJugs] = useAtom(selectedJugsForMemberAtom);

    const handleSelect = (jug_id: string) => {
        if (selectedJugs.has(jug_id)) {
            selectedJugs.delete(jug_id);
        } else {
            selectedJugs.add(jug_id);
        }
        setSelectedJugs(new Set(selectedJugs));
    };

    const handlePress = () => {

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
                        title: name === "real" ? "Real Jugs" : "Test Jugs",
                        data: list,
                    }))}
                    renderItem={({ item }) => (
                        <Pressable
                            className="mx-4 px-4 py-3 rounded-xl my-2 bg-gray-200 dark:bg-neutral-800"
                            onPress={() => handleSelect(item)}
                            style={{
                                ...(selectedJugs.has(item)
                                    ? {
                                        backgroundColor: "rgb(90, 240, 130)",
                                    }
                                    : undefined),
                                // backgroundColor: selectedJugs.has(item)
                                //     ? "rgb(90, 240, 130)"
                                //     : undefined,
                            }}
                        >
                            <Text className="text-lg dark:text-white">
                                {item}
                            </Text>
                        </Pressable>
                    )}
                    renderSectionHeader={({ section }) => (
                        <Text className="text-xl font-bold ml-4 pt-4 dark:text-white">
                            {section.title}
                        </Text>
                    )}
                    keyExtractor={(item) => `jug-list-${item}`}
                    stickySectionHeadersEnabled={false}
                />
            )}
            {selectedJugs.size > 0 && (
                <StyledButton
                    text={`Add ${selectedJugs.size} jug${selectedJugs.size > 1 ? "s" : ""} to member`}
                    href="add-member-modal"
                    textClass="text-lg"
                    onPress={handlePress}
                />
            )}
        </View>
    );
}
