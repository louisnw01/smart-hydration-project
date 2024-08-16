import { membersAtom } from "@/atom/community";
import StyledButton from "@/components/common/button";
import StyledTextInput from "@/components/common/text-input";
import { MemberInfo } from "@/interfaces/community";
import { router, useNavigation } from "expo-router";
import { useSetAtom } from "jotai";
import { useState } from "react";
import { Text, View } from "react-native";

//assume names are unique for now. later, will get unique id for each member from backend

export default function AddMemberModal() {
    const navigation = useNavigation();
    const [showErrorMessage, setShowErrorMessage] = useState(false);
    const setMembers = useSetAtom(membersAtom);
    const [memberName, setMemberName] = useState("");
    const createMember = ({ name }: MemberInfo) => ({
        name,
    });

    const handlePress = () => {
        if (memberName) {
            //bug: can add member even if they have no devices
            const member = createMember({ name: memberName });
            setMembers((prevMembers) => {
                const newMembers = new Map(prevMembers);
                newMembers.set(memberName, member);
                return newMembers;
            });
            //TODO later: send member details to DB when each member added
            setMemberName("");
            setShowErrorMessage(false);
            navigation.goBack();
        } else {
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
                <StyledTextInput
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
                    onPress={() => router.push("add-device-member-modal")}
                    textClass="text-lg"
                />
            </View>
            <View className="flex flex-row justify-center items-center">
                <StyledButton
                    text="Submit"
                    onPress={() => router.push("community")}
                    textClass="text-lg"
                    onPress={handlePress}
                />
            </View>
        </View>
    );
}
