import {
    communityUsersQAtom,
    deleteCommunityMemberMAtom,
} from "@/atom/query/community";
import StyledButton from "@/components/common/button";
import Loading from "@/components/common/loading";
import { useAtomValue } from "jotai";
import React, { ReactNode, useEffect, useState } from "react";
import { FlatList, Modal, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface Member {
    id: number;
    name: string;
}

export default function MemberList() {
    const { data: members, isLoading } = useAtomValue(communityUsersQAtom);
    const { mutate, isPending, isSuccess } = useAtomValue(
        deleteCommunityMemberMAtom,
    );

    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [member, setMember] = useState<Member | null>(null);

    useEffect(() => {
        if (isPending || !isSuccess) return;
        setModalVisible(false);
        setMember(null);
    }, [isSuccess]);

    const confirmRemoveMember = (value: Member) => {
        setMember(value);
        setModalVisible(true);
    };

    const handleRemoveMember = () => {
        if (member == null) return;
        mutate({ id: member.id });
    };

    const handleOnReject = () => {
        setModalVisible(false);
        setMember(null);
    };

    if (isLoading) {
        return <Loading isLoading />;
    }

    return (
        <View className="p-5">
            <Text className="text-black text-xl font-semibold text-center mb-5">
                Member List
            </Text>
            <FlatList
                data={members}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View className="flex-row justify-between items-center p-3 border-b border-gray-300 bg-gray-200 rounded-lg mb-2">
                        <Text className="text-lg">{item.name}</Text>
                        <TouchableOpacity
                            className="bg-blue-700 border border-gray-400 py-1 px-4 rounded-lg"
                            onPress={() => confirmRemoveMember(item)}
                        >
                            <Text className="text-black text-lg">-</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />

            {/* <DialogModal
                text={"Are you sure you want to delete this member?"}
                isVisible={modalVisible}
                onConfirm={handleRemoveMember}
                onReject={handleOnReject}
                onRequestClose={handleOnReject}
            /> */}
            <BottomSheet isVisible={modalVisible}>
                <View className="mx-6 gap-4">
                    <Text className="text-xl text-center first-letter:font-medium dark:text-white">
                        {`Are you sure you want to remove the member ${member?.name}?`}
                    </Text>
                    <View className="flex-row justify-evenly">
                        <StyledButton
                            text="Cancel"
                            buttonClass="w-40 py-3 rounded-xl justify-center"
                            buttonColors="bg-gray-300"
                            touchButtonColors="bg-neutral-400"
                            textClass="text-xl text-red dark:text-red"
                            onPress={handleOnReject}
                        />
                        <StyledButton
                            text="Remove User"
                            buttonClass="w-40 py-3 rounded-xl justify-center"
                            buttonColors="bg-red"
                            touchButtonColors="bg-darkred"
                            textClass="text-xl text-white"
                            onPress={handleRemoveMember}
                        />
                    </View>
                </View>
            </BottomSheet>
        </View>
    );
}

function BottomSheet({
    children,
    isVisible,
}: {
    children: ReactNode;
    isVisible: boolean;
}) {
    const insets = useSafeAreaInsets();

    return (
        <Modal transparent visible={isVisible} animationType="slide">
            <View className="flex-1 justify-end">
                <View
                    className="bg-gray-200 dark:bg-neutral-700 rounded-3xl pt-6"
                    style={{
                        paddingBottom: insets.bottom,
                    }}
                >
                    {children}
                </View>
            </View>
        </Modal>
    );
}
