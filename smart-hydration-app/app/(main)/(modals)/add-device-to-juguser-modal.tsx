import { selectedJugIdAtom } from "@/atom/device";
import { unlinkJugFromUserMAtom } from "@/atom/jugs";
import { linkJugsToCommunityMemberMAtom, patientInfoQAtom } from "@/atom/query";
import Loading from "@/components/common/loading";
import { MemberInfo } from "@/interfaces/community";
import { useNavigation } from "expo-router";
import { useAtomValue } from "jotai";
import { useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";

export default function MVPAddDeviceModal() {
    const { data, isLoading: patientInfoIsLoading } =
        useAtomValue(patientInfoQAtom);
    const navigation = useNavigation();
    const selectedJugId = useAtomValue(selectedJugIdAtom);
    const { mutate: unlinkJugFromUser } = useAtomValue(unlinkJugFromUserMAtom);
    const [selectedUser, setSelectedUser] = useState<number | null>();
    //const communityJugData = getCommunityJugDataQAtom();
    const { mutate: linkJugToCommunityMember } = useAtomValue(
        linkJugsToCommunityMemberMAtom,
    );

    if (!selectedJugId) return;

    const handleSelect = (juser_id: MemberInfo) => {
        if (selectedUser == juser_id.id) {
            setSelectedUser(null);
        } else {
            setSelectedUser(juser_id.id);
        }
        setSelectedUser(juser_id.id);
    };

    const handlePress = () => {
        linkJugToCommunityMember({
            jugIds: [selectedJugId],
            communityMember: Number(selectedUser),
        });
        unlinkJugFromUser({ jugId: selectedJugId });

        navigation.goBack();
        navigation.goBack();
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
                <FlatList
                    data={data}
                    renderItem={({ item }) => (
                        <Pressable
                            className="mx-4 px-4 py-3 rounded-xl my-2 bg-gray-200 dark:bg-neutral-800"
                            onPress={() => handleSelect(item)}
                            style={{
                                ...(selectedUser == item.id
                                    ? {
                                          backgroundColor: "rgb(90, 240, 130)",
                                      }
                                    : undefined),
                            }}
                        >
                            <View className="flex-row justify-between">
                                <Text className="text-lg dark:text-white">
                                    {item.name}
                                </Text>
                                <Text className="text-lg dark:text-white">
                                    {item.id}
                                </Text>
                            </View>
                        </Pressable>
                    )}
                    // renderSectionHeader={({ section }) => (
                    //     <Text className="text-xl font-bold ml-4 pt-4 dark:text-white">
                    //         {section.title}
                    //     </Text>
                    // )}
                    keyExtractor={(item) => `jug-list-${item}`}
                    // stickySectionHeadersEnabled={false}
                />
            )}
            {selectedUser !== null && (
                <Pressable
                    className="bg-blue items-center mx-16 justify-center px-3 py-3 rounded-3xl"
                    onPress={handlePress}
                >
                    <Text className="text-white text-2xl">
                        {`Add jug to account`}
                    </Text>
                </Pressable>
            )}
        </View>
    );
}
