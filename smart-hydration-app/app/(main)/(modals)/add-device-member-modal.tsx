import { selectedMemberAtom } from "@/atom/community";
import { getJugDataQAtom, linkJugMAtom } from "@/atom/query";
import colors from "@/colors";
import StyledButton from "@/components/common/button";
import Loading from "@/components/common/loading";
import MarginBox from "@/components/common/margin-box";
import DeviceSection from "@/components/devices/device-section";
import { DeviceInfo } from "@/interfaces/device";
import { useNavigation } from "expo-router";
import { useAtomValue } from "jotai";
import { useState } from "react";
import { Text, View } from "react-native";

export default function AddDeviceMemberModal() {
    const { data, isLoading } = useAtomValue(getJugDataQAtom);
    const navigation = useNavigation();
    const [selectedJugs, setSelectedJugs] = useState<Set<DeviceInfo>>(
        new Set(),
    );
    const selectedMember = useAtomValue(selectedMemberAtom);
    const { mutate: linkJugsToCommunityMember } = useAtomValue(linkJugMAtom);

    if (!selectedMember) return null;

    const handleSelect = (jug: DeviceInfo) => {
        const newSelectedJugs = new Set(selectedJugs);
        if (newSelectedJugs.has(jug)) {
            newSelectedJugs.delete(jug);
        } else {
            newSelectedJugs.add(jug);
        }
        setSelectedJugs(newSelectedJugs);
    };

    const handlePress = () => {
        let jugIdArray = [];
        for (let j of selectedJugs) {
            jugIdArray.push(j.id);
        }
        linkJugsToCommunityMember({
            jugIds: jugIdArray,
            jugUserId: selectedMember.id,
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
                <MarginBox>
                    <DeviceSection
                        queryAtom={getJugDataQAtom}
                        onPress={handleSelect}
                        activeColor={colors.green}
                    />
                </MarginBox>

                // <SectionList
                //     // sections={Object.entries(data).map(([name]) => ({
                //     //     title: "Connected Jugs:",
                //     //     data: name,
                //     // }))}
                //     sections={[{ title: "Connected Jugs", data: data }]}
                //     renderItem={({ item }) => (
                //         <Pressable
                //             className="mx-4 px-4 py-3 rounded-xl my-2 bg-gray-200 dark:bg-neutral-800"
                //             onPress={() => handleSelect(item)}
                //             style={{
                //                 ...(selectedJugs.has(item)
                //                     ? {
                //                           backgroundColor: "rgb(90, 240, 130)",
                //                       }
                //                     : undefined),
                //                 // backgroundColor: selectedJugs.has(item)
                //                 //     ? "rgb(90, 240, 130)"
                //                 //     : undefined,
                //             }}
                //         >
                //             <Text className="text-xl font-semibold dark:text-white">
                //                 {item.name}
                //             </Text>
                //             <Text>Smart Hydration ID: {item.id}</Text>
                //         </Pressable>
                //     )}
                //     renderSectionHeader={({ section }) => (
                //         <Text className="text-xl font-bold ml-4 pt-4 dark:text-white">
                //             {"Connected Jugs"}
                //         </Text>
                //     )}
                //     keyExtractor={(item) => `jug-list-${item}`}
                //     stickySectionHeadersEnabled={false}
                // />
            )}
            {selectedJugs.size > 0 && (
                <StyledButton
                    text={`Add ${selectedJugs.size} jug${selectedJugs.size > 1 ? "s" : ""} to member`}
                    textClass="text-lg"
                    onPress={handlePress}
                />
            )}
        </View>
    );
}
