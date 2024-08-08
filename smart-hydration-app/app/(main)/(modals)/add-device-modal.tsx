import {
    getAllJugsQAtom,
    linkJugToUserMAtom,
    userHasCommunityAtom,
} from "@/atom/query";
import Loading from "@/components/common/loading";
import { useNavigation } from "expo-router";
import { useAtomValue, useAtom } from "jotai";
import { Pressable, SectionList, Text, View } from "react-native";
import { router } from "expo-router";
import { selectedJugsAtom } from "@/atom/device";

export default function MVPAddDeviceModal() {
    const { data, isLoading } = useAtomValue(getAllJugsQAtom);
    const navigation = useNavigation();
    const [selectedJugs, setSelectedJugs] = useAtom(selectedJugsAtom);
    const { mutate: linkJugsToUser } = useAtomValue(linkJugToUserMAtom);
    const isInCommunity = useAtomValue(userHasCommunityAtom);
    const handleSelect = (jug_id: string) => {
        if (!selectedJugs) {
            return;
        }
        if (selectedJugs.has(jug_id)) {
            selectedJugs.delete(jug_id);
        } else {
            selectedJugs.add(jug_id);
        }
        setSelectedJugs(new Set(selectedJugs));
    };

    const handlePress = () => {
        if (isInCommunity) {
            router.push("(modals)/add-device-chooser");
        } else {
            linkJugsToUser({ jugIds: Array.from(selectedJugs) });
            router.back();
        }
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
