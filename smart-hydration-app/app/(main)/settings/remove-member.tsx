import { communityUsersQAtom, deleteCommunityMemberMAtom } from "@/atom/query";
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
        setMember(null);
    };

    if (isLoading) {
        return <Loading isLoading />;
    }

    return (
        <View className="p-5">
            <Text className="text-black text-xl font-semibold text-center mb-5 dark:text-white">
                Carer List
            </Text>
            <FlatList
                data={members}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <>
                        {!item.isOwner && (
                            <View className="flex-row justify-between items-center p-3 border-b border-gray-300 bg-gray-200 rounded-lg mb-2">
                                <Text className="text-lg dark:text-white">
                                    {item.name}
                                </Text>
                                <TouchableOpacity
                                    className="bg-blue-700 border border-gray-400 py-1 px-4 rounded-lg"
                                    onPress={() => confirmRemoveMember(item)}
                                >
                                    <Text className="text-black text-lg dark:text-white">
                                        -
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </>
                )}
            />

            {/* <DialogModal
                text={"Are you sure you want to delete this member?"}
                isVisible={modalVisible}
                onConfirm={handleRemoveMember}
                onReject={handleOnReject}
                onRequestClose={handleOnReject}
            /> */}

            <ConfirmModal
                message={`Are you sure you want to remove the carer ${member?.name}?`}
                confirmMessage="Remove"
                onReject={handleOnReject}
                onConfirm={handleRemoveMember}
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
            />
        </View>
    );
}

export function ConfirmModal({
    message,
    onReject,
    onConfirm,
    modalVisible,
    setModalVisible,
    confirmMessage,
}: {
    message: string;
    confirmMessage: string;
    onReject?: Function;
    onConfirm: Function;
    modalVisible: boolean;
    setModalVisible: Function;
}) {
    const handleOnReject = () => {
        setModalVisible(false);
        if (onReject) {
            onReject();
        }
    };
    const handleOnConfirm = () => {
        setModalVisible(false);
        onConfirm();
    };
    return (
        <BottomSheet isVisible={modalVisible}>
            <View className="mx-6 gap-4">
                <Text className="text-xl text-center first-letter:font-medium dark:text-white">
                    {message}
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
                        text={confirmMessage}
                        buttonClass="w-40 py-3 rounded-xl justify-center"
                        buttonColors="bg-red"
                        touchButtonColors="bg-darkred"
                        textClass="text-xl text-white"
                        onPress={handleOnConfirm}
                    />
                </View>
            </View>
        </BottomSheet>
    );
}

export function BottomSheet({
    children,
    isVisible,
    bg,
}: {
    children: ReactNode;
    isVisible: boolean;
    bg?: string;
}) {
    const insets = useSafeAreaInsets();

    let className = "rounded-3xl pt-6 ";

    className += bg ? bg : "bg-gray-200 dark:bg-neutral-700";

    return (
        <Modal transparent visible={isVisible} animationType="slide">
            <View className="flex-1 justify-end">
                <View
                    className={className}
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
