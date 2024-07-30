import { useState } from "react";
import { View, Text, Pressable, TextInput } from "react-native";
import { useNavigation } from "expo-router";
import { useAtom } from "jotai";
import StyledButton from "@/components/common/button";
import StyledTextInput from "@/components/common/text-input";
import ApplyTagRow from "@/components/community/apply-tag-row";

export default function ApplyTags() {
    const navigation = useNavigation();
    const [inviteLink, setInviteLink] = useState('');
    const [showErrorMessage, setShowErrorMessage] = useState(false);
    const handlePress = () => {

    };
    const [appliedTags, setAppliedTags] = useState([
        { name: "independent" },
        { name: "tea" },
        { name: "aggressive" },
        { name: "friendly" },
        { name: "coffee" }
      ]);
      const [unappliedTags, setUnappliedTags] = useState([
        { name: "squash" },
        { name: "soda" },
        { name: "needs help" },
        { name: "juice" },
      ]);

    //to do: add ScrollView to this page
    //to do: stick search bar to bottom of page

    return (
        <View className="mt-8 flex gap-6">
            <Text className="dark:text-white text-2xl mx-6">
               Press a tag to apply or remove it
            </Text>
            <Text className="dark:text-white text-2xl mx-6">
               Applied tags
            </Text>
            <Text className="dark:text-white text-2xl mx-6">
               Tags to select
            </Text>
            <View className="flex-col justify-start mx-6">
                {appliedTags.map((tag) => (
                    <View key={tag.name} className="">
                        <ApplyTagRow tag={tag} />
                    </View>
                ))}
            </View>
            <View className="flex flex-col justify-center items-center">
                <StyledButton
                    text="Save member's tags"
                    href="member-info-modal"
                    textClass="text-lg"
                />
            </View>
            <View className="flex flex-row items-center p-2">
                <View className="flex-1">
                    <StyledTextInput
                        placeholder={`Search tags...`}
                        onChangeText={(val) => {

                        }}
                        textContentType="name"
                        returnKeyType="done"
                    />
                </View>
                <View className="ml-2">
                    <StyledButton
                        text="Clear search"
                        textClass="text-lg"
                    />
                </View>
            </View>
        </View>
    );
}