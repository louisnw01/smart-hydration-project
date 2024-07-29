import { selectedMemberAtom } from "@/atom/community";
import Tag from "./tag";
import { PatientInfo } from "@/interfaces/community";
import { router } from "expo-router";
import { useSetAtom } from "jotai";
import { Pressable, Text, View } from "react-native";

export default function MemberRow({ patient }: { patient: PatientInfo }) {
    const setPatient = useSetAtom(selectedMemberAtom);
    return (
        <Pressable
            className="mx-6 bg-gray-200 px-7 py-4 flex flex-col rounded-xl dark:bg-neutral-800"
            onPress={() => {
                setPatient(patient);
                router.push("member-info-modal");
            }}
        >
            <View className="flex-1">
                <Text className="text-xl font-bold dark:text-white">
                    {patient.name}
                </Text>
                <Text className="text-2l dark:text-white">
                    <Text className="font-bold">Last drank: </Text>
                    {/* {member.last_drank} hours ago */}
                </Text>
                <Text className="text-2l dark:text-white">
                    <Text className="font-bold">Target progress: </Text>
                    {patient.target_percentage}%
                </Text>
            </View>
            {/* create a tag group component */}
            <View className="flex-row flex-wrap my-2">
                <Tag name="Independent"></Tag>
                <Tag name="Likes coffee"></Tag>
                <Tag name="Aggressive"></Tag>
                <Tag name="Four"></Tag>
                <Tag name="Five"></Tag>
                <Tag name="Six"></Tag>
                <Tag name="Seven"></Tag>
                <Tag name="Eight"></Tag>
                <Tag name="Nine"></Tag>
            </View>
        </Pressable>
    );
}

