import colors from "@/colors";

import { ReactNode } from "react";
import { View, Text, Pressable } from "react-native";
import { useAtomValue, useSetAtom } from "jotai";
import { useRouter } from "expo-router";
import { MemberInfo } from "@/interfaces/community"
import { DeviceInfo } from "@/interfaces/device"
import { selectedMemberAtom } from "@/atom/community";
import { getAllJugsQAtom, getJugDataQAtom } from "@/atom/query";

export default function MemberRow({ member }: { member: MemberInfo }) {
    const setMember = useSetAtom(selectedMemberAtom);
    //const { data, isLoading } = useAtomValue(getAllJugsQAtom);
    const {data } = useAtomValue(getJugDataQAtom);
    const devicesData: DeviceInfo[] = Array.isArray(data) ? data : [];
    const router = useRouter();

    console.log("This is the data:", data);
    console.log("This is devices data:", devicesData);
    //console.log("Filtered jugs in add-member-row:", filteredJugs);
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
            {devicesData.length > 0 &&
                    devicesData.filter(device => {
                            Array.from(member.jugIDs).forEach(jugID => {
                        });
                    }).map((device, idx) => (
                        <Text key={idx}>{device.name}</Text>
                    ))
                }
            </View>
        </Pressable>
    );
}

//only displays devices that are added to user


