import { selectedDeviceAtom, selectedJugsAtom } from "@/atom/device";
import { linkJugMAtom, patientInfoQAtom, userInfoQAtom } from "@/atom/query";
import StyledButton from "@/components/common/button";
import Loading from "@/components/common/loading";
import { MemberInfo } from "@/interfaces/community";
import { router } from "expo-router";
import { useAtom, useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";

export default function MVPAddDeviceModal() {
    const { data, isLoading: patientInfoIsLoading } =
        useAtomValue(patientInfoQAtom);
    const selectedDevice = useAtomValue(selectedDeviceAtom);
    const [selectedUser, setSelectedUser] = useState<number | null>(null);
    const [selectedJugs, setSelectedJugs] = useAtom(selectedJugsAtom);
    const {
        mutate: linkJugToCommunityMember,
        isPending,
        isSuccess,
        reset,
    } = useAtomValue(linkJugMAtom);
    const { data: userInfo } = useAtomValue(userInfoQAtom);

    useEffect(() => {
        if (isPending || !isSuccess) return;
        setSelectedJugs([]);
        reset();
        router.replace("/devices");
    }, [isPending, isSuccess]);

    const handleSelect = (juser_id: MemberInfo) => {
        if (selectedUser == juser_id.id) {
            setSelectedUser(null);
        } else {
            setSelectedUser(juser_id.id);
        }
        setSelectedUser(juser_id.id);
    };

    if (!selectedDevice && !selectedJugs) return;

    const handlePress = (unassigned: boolean) => {
        if (selectedUser == null && !unassigned) return;
        linkJugToCommunityMember({
            jugIds: selectedJugs,
            jugUserId: unassigned ? null : selectedUser,
        });
    };

    return (
        <View className="flex gap-6 h-full pb-20">
            <View className="flex-row justify-between">
                <Text className="text-xl font-semibold pt-6 pl-8">Name</Text>
                <Text className="text-xl font-semibold pt-6 pr-8">ID</Text>
            </View>
            <Loading
                isLoading={patientInfoIsLoading}
                message="Getting all jug names.."
            />

            {data && (
                <View>
                    <FlatList
                        data={data}
                        renderItem={({ item }) => (
                            <View>
                                <Pressable
                                    className="mx-4 px-4 py-3 rounded-xl my-2 bg-gray-200 dark:bg-neutral-800"
                                    onPress={() => handleSelect(item)}
                                    style={{
                                        ...(selectedUser == item.id
                                            ? {
                                                  backgroundColor:
                                                      "rgb(90, 240, 130)",
                                              }
                                            : undefined),
                                    }}
                                >
                                    <View className="flex-row justify-between">
                                        <Text className="text-lg dark:text-white">
                                            {`${item.name}${item.id == userInfo?.juguser ? " (You)" : ""}`}
                                        </Text>
                                        <Text className="text-lg dark:text-white">
                                            {item.id}
                                        </Text>
                                    </View>
                                </Pressable>
                            </View>
                        )}
                        // renderSectionHeader={({ section }) => (
                        //     <Text className="text-xl font-bold ml-4 pt-4 dark:text-white">
                        //         {section.title}
                        //     </Text>
                        // )}
                        keyExtractor={(item, idx) => idx.toString()}
                        // stickySectionHeadersEnabled={false}
                    />
                </View>
            )}

            {selectedUser !== null && (
                <StyledButton
                    onPress={() => handlePress(false)}
                    text="Add jug to account"
                    buttonClass="bg-blue items-center mx-16 justify-center px-3 py-3 rounded-3xl"
                    textClass="text-white text-2xl"
                    isLoading={isPending}
                />
            )}
            <View className="px-16">
                <StyledButton
                    text="Nobody, for now"
                    textClass="w-full text-center text-2xl py-4"
                    onPress={() => handlePress(true)}
                />
                <Text className="flex-wrap text-center pt-4">
                    After clicking this, you can assign the jug to a member of
                    your community at a later time.
                </Text>
            </View>
        </View>
    );
}
