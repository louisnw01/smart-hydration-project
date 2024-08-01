import { View, Pressable, Text} from "react-native";
import { useRouter } from "expo-router";
import { SelectInputBox } from "@/components/onboarding/select-input-box";
import { useEffect, useState } from "react";
import { useAtomValue } from "jotai";
import { communityUsersQAtom } from "@/atom/query/community";

export interface ChangeOwnerProps {
  community_id: string;


}



export default function ChangeOwner({ community_id }: ChangeOwnerProps) {
  const { data: communityMembers, isLoading, error, refetch, status } = useAtomValue(communityUsersQAtom);

    const [communityOwner, setCommunityOwner] = useState<string>('')
    const [errorMessage, setErrorMessage] = useState<string>('')

    useEffect(() => {
      setErrorMessage(error?.message || '');
      if (!communityMembers) {
        refetch();
      }
    }, [isLoading])

    const handleOnSubmit = () => {
      //TODO: call api to store the new owner
    }
    const router = useRouter();
    return (
        <View className="flex flex-1 gap-8 mx-16 items-center mt-10">
            <View className="items-center gap-4 mt-20">

                    <Text className="text-black text-2xl font-semibold text-center">
                      Change Community Owner {status}
                    </Text>

                    {errorMessage && <Text className="text-red text-2xl font-semibold text-center">
                      {errorMessage}
                    </Text>}
                    {communityMembers && <SelectInputBox
                        data={communityMembers.map((user: any) => {
                          return {
                            key: user.id,
                            value: JSON.stringify(user),
                          }
                        })}
                        onChange={setCommunityOwner}

                        //placeholder="Enter Community name"
                        //textContentType="emailAddress"
                        //autoCapitalize="none"
                    />}
                <Pressable
                    onPress={handleOnSubmit}
                    className="bg-blue px-2 py-2 rounded-lg w-80 h-14 flex content-center justify-center"
                >
                      <Text className="text-white text-2xl font-semibold text-center">
                          Submit
                      </Text>
                </Pressable>


            </View>
        </View>
    );
}
