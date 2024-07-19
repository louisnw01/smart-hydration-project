import colors from "@/colors";

import { ReactNode } from "react";
import { View, Text, Pressable } from "react-native";
import { useAtomValue, useSetAtom } from "jotai";
import { useRouter } from "expo-router";
import { MemberInfo } from "@/interfaces/community"
import { DeviceInfo } from "@/interfaces/device"
import { selectedMemberAtom } from "@/atom/community";
import { getAllJugsQAtom } from "@/atom/query";

export default function MemberRow({ member }: { member: MemberInfo }) {
    const setMember= useSetAtom(selectedMemberAtom);
    const { data, isLoading } = useAtomValue(getAllJugsQAtom);
    const router = useRouter();
    const devicesData: DeviceInfo[] = Array.isArray(data) ? data : [];

    const getFilteredJugs = () =>
        devicesData.filter((device) => member.jugIDs.has(device.id));

    const filteredJugs = getFilteredJugs();
    console.log("Filtered jugs in add-member-row:", filteredJugs);
    console.log("Member's name in add-member-row:", member.name);
    console.log("Member's jug IDs in add-member-row:", member.jugIDs);

    return (
        <Pressable
            className="mx-6 bg-gray-200 px-7 py-4 flex flex-row justify-between rounded-xl dark:bg-neutral-800"
            onPress={() => {
                setMember(member);
                router.push("member-info-modal");
            }}
        >
            <View className="flex">
                <Text className="text-xl font-bold dark:text-white">
                    {member.name}
                </Text>
            </View>
            <View className="mt-2">
                            {filteredJugs.length > 0 ? (
                                filteredJugs.map((jug) => (
                                    <Text key={jug.id} className="text-lg dark:text-white">
                                        {jug.name}
                                    </Text>
                                ))
                            ) : (
                                <Text className="text-lg dark:text-white">
                                    No matching jugs
                                </Text>
                            )}
                        </View>
        </Pressable>
    );
}



