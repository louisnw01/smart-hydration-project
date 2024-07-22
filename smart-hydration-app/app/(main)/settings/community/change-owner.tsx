import { View, Pressable, Text} from "react-native";
import { useRouter } from "expo-router";
import { SelectInputBox } from "@/components/onboarding/select-input-box";
import { useEffect, useState } from "react";

export interface ChangeOwnerProps {
  community_id: string;
}

export default function ChangeOwner({ community_id }: ChangeOwnerProps) {

    const [communityOwner, setCommunityOwner] = useState<string>('')
    const [members, setMembers] = useState([
        { name: 'John Doe', id: 'john' },
        { name: 'Jane Smith', id: 'jane' },
        { name: 'Alice Johnson', id: 'alice' },
        { name: 'Tim Smith', id: 'tim' },
        { name: 'Rose Doe', id: 'rose' },
        { name: 'Amy Something', id: 'amy' },
    ]);

    const handleStartup = async () => {
      // TODO: fetch community data in order to get current owner
      // await fetchCommunityData so we know who's the owner
      // TODO: fetch member list and remove current owner
    }

    useEffect(() => {
      handleStartup();
    })

    const handleOnSubmit = () => {
      //TODO: call api to store the new owner
    }
    const router = useRouter();
    return (
        <View className="flex flex-1 gap-8 mx-16 items-center mt-10">
            <View className="items-center gap-4 mt-20">

                    <Text className="text-black text-2xl font-semibold text-center">
                      Change Community Owner
                    </Text>
                    <SelectInputBox
                        data={members.map((user) => {
                          return {
                            key: user.id,
                            value: user.name,
                          }
                        })}
                        onChange={setCommunityOwner}
                        //placeholder="Enter Community name"
                        //textContentType="emailAddress"
                        //autoCapitalize="none"
                        //className="bg-gray-200 w-full h-14 placeholder-black text-xl rounded-xl px-3"
                    />
                <Pressable
                    onPress={handleOnSubmit}
                    className="bg-blue px-2 py-2 rounded-lg w-32"
                >
                    <Text className="text-white text-2xl font-semibold text-center">
                        Submit
                    </Text>
                </Pressable>


            </View>
        </View>
    );
}
