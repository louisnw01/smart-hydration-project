import { useState } from "react";
import { View, Text, SectionList, Pressable } from "react-native";
import { useAtom, useAtomValue } from "jotai";
import { getAllJugsQAtom, getJugDataQAtom } from "@/atom/query";
import { useNavigation } from "expo-router";
import Loading from "@/components/common/loading";
import { selectedJugsForMemberAtom } from "@/atom/community";
import { linkJugsToCommunityMemberMAtom } from "@/atom/query/community";

export default function AddDeviceMemberModal() {
    const { data, isLoading, refetch } = useAtomValue(getJugDataQAtom);
    const [refreshing, setRefreshing] = useState(false);
    console.log(JSON.stringify(data));
    const navigation = useNavigation();
    const [selectedJugs, setSelectedJugs] = useAtom(selectedJugsForMemberAtom);
    const { mutate: linkJugsToCommunityMember } = useAtomValue(
        linkJugsToCommunityMemberMAtom,
    );

    const handleSelect = (jug) => {
        const newSelectedJugs = new Set(selectedJugs);
        if (newSelectedJugs.has(jug)) {
            newSelectedJugs.delete(jug);
        } else {
            newSelectedJugs.add(jug);
        }
        setSelectedJugs(newSelectedJugs);
    };

    const handlePress = () => {
        const communityMember = "exampleCommunityMember"; // Replace this with the actual community member ID
        linkJugsToCommunityMember({
            jugIds: Array.from(selectedJugs),
            communityMember,
        });
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
                    // sections={Object.entries(data).map(([name]) => ({
                    //     title: "Connected Jugs:",
                    //     data: name,
                    // }))}
                    sections={[{ title: "Connected Jugs", data: data }]}
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
                            <Text className="text-xl font-semibold dark:text-white">
                                {item.name}
                            </Text>
                            <Text>Smart Hydration ID: {item.id}</Text>
                        </Pressable>
                    )}
                    renderSectionHeader={({ section }) => (
                        <Text className="text-xl font-bold ml-4 pt-4 dark:text-white">
                            {"Connected Jugs"}
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
                        {`Add ${selectedJugs.size} jug${selectedJugs.size > 1 ? "s" : ""} to member`}
                    </Text>
                </Pressable>
            )}
        </View>
    );
}
