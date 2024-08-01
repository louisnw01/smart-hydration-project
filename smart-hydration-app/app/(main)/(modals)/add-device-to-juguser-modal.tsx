import { selectedJugIdAtom } from "@/atom/device";
import {
    fetchJugData,
    getAllJugsQAtom,
    getCommunityJugDataQAtom,
    getJugDataQAtom,
    linkJugToUserMAtom,
    unlinkJugFromUserMAtom,
} from "@/atom/query";
import {
    communityInfoQAtom,
    isCommunityOwnerAtom,
    linkJugsToCommunityMemberMAtom,
    patientInfoQAtom,
} from "@/atom/query/community";
import { authTokenAtom } from "@/atom/user";
import Loading from "@/components/common/loading";
import { useNavigation } from "expo-router";
import { useAtomValue } from "jotai";
import { useState } from "react";
import { Pressable, FlatList, Text, View } from "react-native";

export default function MVPAddDeviceModal() {
    const { data, isLoading: patientInfoIsLoading } =
        useAtomValue(patientInfoQAtom);
    const navigation = useNavigation();
    const selectedJugId = useAtomValue(selectedJugIdAtom);
    const { mutate: unlinkJugFromUser } = useAtomValue(unlinkJugFromUserMAtom);
    const [selectedUser, setSelectedUser] = useState("0");
    //const communityJugData = getCommunityJugDataQAtom();
    const { mutate: linkJugToCommunityMember } = useAtomValue(
        linkJugsToCommunityMemberMAtom,
    );
    const handleSelect = (juser_id: string) => {
        console.log("Setting user to " + juser_id.id);
        if (selectedUser == juser_id.id) {
            setSelectedUser("0");
        } else {
            setSelectedUser(juser_id.id);
        }
        setSelectedUser(juser_id.id);
    };
    console.log(JSON.stringify(data));

    const handlePress = () => {
        linkJugToCommunityMember({
            jugIds: [selectedJugId],
            communityMember: Number(selectedUser),
        });
        unlinkJugFromUser(selectedJugId);

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
                    renderSectionHeader={({ section }) => (
                        <Text className="text-xl font-bold ml-4 pt-4 dark:text-white">
                            {section.title}
                        </Text>
                    )}
                    keyExtractor={(item) => `jug-list-${item}`}
                    stickySectionHeadersEnabled={false}
                />
            )}
            {selectedUser != "0" && (
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
