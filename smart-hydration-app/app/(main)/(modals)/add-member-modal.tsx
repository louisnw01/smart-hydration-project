import { useState } from "react";
import { View, Text, Pressable, TextInput } from "react-native";
import { useNavigation } from "expo-router";
import { useAtom } from "jotai";
import { membersAtom, selectedJugsForMemberAtom } from "@/atom/community";
import StyledButton from "@/components/common/button";

//assume names are unique for now. later, will get unique id for each member from backend
interface memberProps {
    name: string,
    devices: Set<string>,
}

export default function AddMemberModal() {
    const navigation = useNavigation();
    const [showErrorMessage, setShowErrorMessage] = useState(false);
    const [members, setMembers] = useAtom(membersAtom);
    const [memberName, setMemberName] = useState('');
    const [memberDevices, setMemberDevices] = useState<Set<string>>(new Set());
    const createMember = ({ name, devices }: memberProps) => ({
        name,
        devices,
    });
    const [selectedJugs, setSelectedJugs] = useAtom(selectedJugsForMemberAtom);

    const handlePress = () => {
        //for now, must have member name and add devices. In future, probably just name should be required
        if (memberName && memberDevices) {
            setMemberDevices(selectedJugs);
            const member = createMember({ name: memberName, devices: memberDevices });
            setMembers((prevMembers) => {
                const newMembers = new Map(prevMembers);
                newMembers.set(memberName, member);
                return newMembers;
            });
            //to do later: send member details to DB when each member added 
            setMemberName('');
            setMemberDevices(new Set());
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
                        setMemberName(val);
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
