import { useState } from "react";
import { View, Text, Pressable, TextInput } from "react-native";
import { createCommunityMAtom } from "@/atom/query/community";
import { useNavigation } from "expo-router";
import { useAtom, useAtomValue } from "jotai";
import { userHasCommunityAtom, membersAtom } from "@/atom/community";
import StyledButton from "@/components/common/button";

//assume names are unique for now. later, will get unique id for each member from backend
interface memberProps {
    name: string,
    devices: string[],
}

export default function AddMemberModal() {
    const navigation = useNavigation();
    const [communityName, setCommunityName] = useState('');
    const { mutate } = useAtomValue(createCommunityMAtom);
    const [showErrorMessage, setShowErrorMessage] = useState(false);
    const [, setUserHasCommunity] = useAtom(userHasCommunityAtom);
    const [members, setMembers] = useAtom(membersAtom);
    const [memberName, setMemberName] = useState('');
    const [memberDevices, setMemberDevices] = useState('');
    const createMember = ({ name, devices }: memberProps) => ({
        name,
        devices,
    });

    const handlePress = () => {
        //only member name is required, can add a member without a jug
        if (memberName) {
            const newMember = createMember({ name: memberName, devices: memberDevices.split(',') });
            setMembers((prevMembers) => {
                const newMembers = new Map(prevMembers);
                newMembers.set(memberName, newMember);
                return newMembers;
            });
            //to do later: send member details to db when each member added 
            setMemberName('');
            setMemberDevices('');
        }
        else {
            setShowErrorMessage(true);
        }
    };


    return (
        <View className="mt-8 flex gap-6">
            <View className="flex flex-row justify-center items-center">
                <Text className="dark:text-white text-2xl">
                    Enter the member's name:
                </Text>
            </View>
            <View className="flex flex-row justify-center items-center">
                <TextInput
                    placeholder={`Member name (required)`}
                    className="bg-gray-200 h-14 placeholder-black text-xl rounded-xl px-3"
                    onChangeText={(val) => {
                        setCommunityName(val);
                        setShowErrorMessage(false);
                    }}
                    textContentType="name"
                    returnKeyType="done"
                />
            </View>
            {showErrorMessage && (
                <View className="flex flex-row justify-center items-center">
                    <Text className="dark:text-white text-2xl">
                        You must enter a member name
                    </Text>
                </View>
            )}
            <View className="flex flex-row justify-center">
                <StyledButton
                    text="+Add member's jug(s)"
                    href="add-device-member-modal"
                    textSize="lg"
                />
            </View>
            <View className="flex flex-row justify-center items-center">
                <Pressable
                    onPress={handlePress}
                    className="bg-blue px-4 py-2 rounded-xl mt-10"
                ><Text className="text-2xl font-semibold text-white">
                        Submit
                    </Text></Pressable>
            </View>
        </View>
    );
}
