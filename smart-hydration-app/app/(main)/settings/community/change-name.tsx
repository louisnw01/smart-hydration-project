import { View, Pressable, Text, TextInput} from "react-native";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import StyledTextInput from "@/components/common/text-input";

export interface ChangeNameProps {
  community_id: string;
}

export default function ChangeName({ community_id }: ChangeNameProps) {

    const [communityName, setCommunityName] = useState<string>('')
    useEffect(() => {
      // TODO: fetch community data in order to get current name
    })

    const handleOnSubmit = () => {
      //TODO: call api to store the new name
    }

    const router = useRouter();
    return (
        <View className="flex flex-1 gap-8 mx-16 items-center mt-10">
            <View className="items-center gap-4 mt-20">

                    <Text className="text-black text-2xl font-semibold text-center">
                      Enter Community Name
                    </Text>
                    <StyledTextInput
                        placeholder="Enter Community name"
                        textContentType="emailAddress"
                        autoCapitalize="none"
                        // defaultValue={communityName}
                        onChangeText={(value) => setCommunityName(value)}
                        width={284}
                        className="bg-gray-200 w-full h-14 placeholder-black text-xl rounded-xl px-3 m-7"
                    />
                <Pressable
                    onPress={() => router.push("settings/community/community-profile")}
                    className="bg-blue px-2 py-2 rounded-lg w-80 h-16 flex content-center justify-center"
                >
                    <Text className="text-white text-3xl font-semibold text-center">
                        Submit
                    </Text>
                </Pressable>


            </View>
        </View>
    );
}
