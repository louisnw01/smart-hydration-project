import React, { useState } from 'react';
import { View, Pressable, Text, TextInput, FlatList, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import RNPickerSelect from 'react-native-picker-select';

export default function ChangeName() {
    const router = useRouter();


    const [members, setMembers] = useState([
      { label: 'John Doe', value: 'john' },
      { label: 'Jane Smith', value: 'jane' },
      { label: 'Alice Johnson', value: 'alice' },
  ]);
  const [selectedMember, setSelectedMember] = useState(null);

  const removeMember = (value) => {
      setMembers(members.filter(member => member.value !== value));
  };
    return (

      <View>
          <Text className="text-black text-xl font-semibold text-center mt-10">
              Manage Members
          </Text>

          <RNPickerSelect

              onValueChange={(value) => setSelectedMember(value)}
              items={members}
              placeholder={{ label: 'Select a member', value: null }}
              //style={pickerSelectStyles}
          />
          <TouchableOpacity
              //style={styles.removeButton}
              onPress={() => removeMember(selectedMember)}
              disabled={!selectedMember}
          >
            <FlatList className="w-full mt-5 border-t border-gray-300"
              data={members}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <View className="p-3 border-b border-gray-300">
                <Text className="text-lg">{item.label}</Text>
            </View>
              )}
          />
              {/*<Text style={styles.removeButtonText}>Remove Member</Text>*/}
              <Text className = "text-white text-lg">Remove Member</Text>

          </TouchableOpacity>

      </View>
);
}

