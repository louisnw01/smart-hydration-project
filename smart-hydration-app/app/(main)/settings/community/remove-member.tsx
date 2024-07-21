import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';

export default function MemberList() {
    const [members, setMembers] = useState([
        { label: 'John Doe', value: 'john' },
        { label: 'Jane Smith', value: 'jane' },
        { label: 'Alice Johnson', value: 'alice' },
        { label: 'Tim Smith', value: 'tim' },
        { label: 'Rose Doe', value: 'rose' },
        { label: 'Amy Something', value: 'amy' },
    ]);

    const removeMember = (value) => {
        setMembers(members.filter(member => member.value !== value));
    };


    return (
      <View className="p-5">
          <Text className="text-black text-xl font-semibold text-center mb-5">
              Member List
          </Text>
          <FlatList
              data={members}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                  <View className="flex-row justify-between items-center p-3 border-b border-gray-300 bg-gray-200 rounded-lg mb-2">
                      <Text className="text-lg">{item.label}</Text>
                      <TouchableOpacity
                          className="bg-blue-700 border border-gray-400 py-1 px-4 rounded-lg"
                          onPress={() => removeMember(item.value)}
                      >
                          <Text className="text-black-500 text-lg">-</Text>
                      </TouchableOpacity>
                  </View>
              )}
          />
      </View>
  );
}
