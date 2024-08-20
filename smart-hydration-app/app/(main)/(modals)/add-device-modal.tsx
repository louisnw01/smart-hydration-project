import { selectedJugsAtom } from "@/atom/device";
import {
    getAllJugsQAtom,
    getJugDataQAtom,
    linkJugMAtom,
    userHasCommunityAtom,
    userJugUserIdAtom,
} from "@/atom/query";
import StyledButton from "@/components/common/button";
import Loading from "@/components/common/loading";
import { router } from "expo-router";
import { useAtom, useAtomValue } from "jotai";
import { useEffect } from "react";
import { FlatList, Pressable, Text, View } from "react-native";

export default function MVPAddDeviceModal() {
    const { data, isLoading } = useAtomValue(getAllJugsQAtom);
    const jugUserId = useAtomValue(userJugUserIdAtom);
    const [selectedJugs, setSelectedJugs] = useAtom(selectedJugsAtom);
    const { mutate, isPending, isSuccess, reset } = useAtomValue(linkJugMAtom);
    const { isLoading: isLoadingNewJugs, isSuccess: isSuccessLoadingNewJugs } =
        useAtomValue(getJugDataQAtom);
    const isInCommunity = useAtomValue(userHasCommunityAtom);

    useEffect(() => {
        if (
            isPending ||
            isLoadingNewJugs ||
            !isSuccess ||
            !isSuccessLoadingNewJugs
        ) {
            return;
        }
        reset();
        router.back();
    }, [isPending, isSuccess, isLoadingNewJugs, isSuccessLoadingNewJugs]);

    const handleSelect = (jug_id: string) => {
        let newSelectedJugs = [...selectedJugs];
        if (!selectedJugs) {
            return;
        }
        if (selectedJugs.find((row) => row == jug_id)) {
            newSelectedJugs = selectedJugs.filter((row) => row != jug_id);
            // selectedJugs.delete(jug_id);
        } else {
            newSelectedJugs.push(jug_id);
            // selectedJugs.add(jug_id);
        }
        setSelectedJugs(newSelectedJugs);
    };

    const handlePress = () => {
        if (isInCommunity) {
            router.push("(modals)/add-device-chooser");
        } else {
            mutate({
                jugIds: Array.from(selectedJugs),
                jugUserId: jugUserId || null,
            });
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
                <FlatList
                    data={data}
                    renderItem={({ item }) => (
                        <Pressable
                            className="mx-4 px-4 py-3 rounded-xl my-2 bg-gray-200 dark:bg-neutral-800"
                            onPress={() => handleSelect(item)}
                            style={{
                                ...(selectedJugs.find((row) => item == row)
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
                    keyExtractor={(item, idx) => idx.toString()}
                />
                // <SectionList
                //     sections={Object.entries(data).map(([name, list]) => ({
                //         title: name === "real" ? "Real Jugs" : "Test Jugs",
                //         data: list,
                //     }))}

                //     )}
                //     renderSectionHeader={({ section }) => (
                //         <Text className="text-xl font-bold ml-4 pt-4 dark:text-white">
                //             {section.title}
                //         </Text>
                //     )}

                //     stickySectionHeadersEnabled={false}
                // />
            )}
            {selectedJugs.length > 0 && (
                <StyledButton
                    text={`Add ${selectedJugs.length} jug${selectedJugs.length > 1 ? "s" : ""} to account`}
                    buttonClass="bg-blue self-center w-72 py-3 rounded-xl"
                    textClass="text-white text-xl font-medium text-center w-full"
                    onPress={handlePress}
                    isLoading={isPending || isLoadingNewJugs}
                />
            )}
        </View>
    );
}
