import { communityUsersQAtom, deleteCommunityMemberMAtom } from '@/atom/query/community';
import { DialogModal } from '@/components/common/dialogModal';
import Loading from '@/components/common/loading';
import { useAtomValue } from 'jotai';
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal } from 'react-native';

export default function MemberList() {

    const { data: members, isLoading } = useAtomValue(communityUsersQAtom);
    const { mutate, isPending, isSuccess } = useAtomValue(deleteCommunityMemberMAtom);

    // const [members, setMembers] = useState([
    //     { name: 'John Doe', id: 'john' },
    //     { name: 'Jane Smith', id: 'jane' },
    //     { name: 'Alice Johnson', id: 'alice' },
    //     { name: 'Tim Smith', id: 'tim' },
    //     { name: 'Rose Doe', id: 'rose' },
    //     { name: 'Amy Something', id: 'amy' },
    // ]);

    //hard code in details from supabase
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [selectedMemberID, setSelectedMemberID] = useState<number | null>(null);



    useEffect(() => {
        if (isPending || !isSuccess) return;
        setModalVisible(false);
        setSelectedMemberID(null);
    }, [isSuccess])

    const confirmRemoveMember = (value: string) => {
        setModalVisible(true);
        setSelectedMemberID(value);
    };

    const handleRemoveMember = () => {
        //TODO: fetch remove member
        // removeMember(selectectedMember)
        if (selectedMemberID == null) return;
        mutate({ id: selectedMemberID });
    };

    const handleOnReject = () => {
      setModalVisible(false);
      setSelectedMemberID(null);
    }


    if (isLoading) {
        return <Loading isLoading />
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
                            onPress={() => confirmRemoveMember(item.id)}
                        >
                            <Text className="text-black text-lg">-</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />

            <DialogModal text={'Are you sure you want to delete this member?'} isVisible={modalVisible} onConfirm={handleRemoveMember} onReject={handleOnReject} onRequestClose={handleOnReject} />

        </View>
    );
}
