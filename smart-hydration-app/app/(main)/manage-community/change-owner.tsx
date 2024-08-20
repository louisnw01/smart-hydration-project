import { SelectInputBox } from "@/components/onboarding/select-input-box";
import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { useAtomValue } from "jotai";
import { communityUsersQAtom, updateCommunityOwnerMAtom } from "@/atom/query/community";
import { router } from "expo-router";
export interface ChangeOwnerProps {
  community_id: string;
}

export default function ChangeOwner({ community_id }: ChangeOwnerProps) {
    const { data: communityMembers, isLoading, error, refetch, status } = useAtomValue(communityUsersQAtom);
    const { isError, isSuccess: ownerHasChanged, error: changeOwnerError, mutate: submitNewOwner } = useAtomValue(updateCommunityOwnerMAtom)
    const [communityOwner, setCommunityOwner] = useState<string>('')
    const [errorMessage, setErrorMessage] = useState<string>('')

    useEffect(() => {
      setErrorMessage(error?.message || '');
      if (!communityMembers) {
        refetch();
      }
    }, [isLoading])

    useEffect(() => {
      console.log(ownerHasChanged)
      if (ownerHasChanged) {
        router.navigate("manage-community/community-settings")
      }
    }, [ownerHasChanged]);

    useEffect(() => {
      if (changeOwnerError) {
        setErrorMessage(changeOwnerError?.message || 'Error changing community owner');
      }
    }, [changeOwnerError]);

    const handleOnSubmit = () => {
      
      if (communityOwner) {
          submitNewOwner({
            new_owner_id: communityOwner,
          })
      }
    }
    return (
        <View className="flex flex-1 gap-8 mx-16 items-center mt-10">
            <View className="items-center gap-4 mt-20">

                    <Text className="text-black text-2xl font-semibold text-center">
                      Change Community Owner

                    </Text>
                    {errorMessage && <Text className="text-red text-2xl font-semibold text-center">
                      {errorMessage}
                    </Text>}
                    {communityMembers && <SelectInputBox
                        data={communityMembers.filter(user => !user.isOwner).map((user: any) => {
                          return {
                            key: user.user_id,
                            value: user.name,
                          }
                        })}
                        onChange={setCommunityOwner}
                        //placeholder="Enter Community name"
                        //textContentType="emailAddress"
                        //autoCapitalize="none"
                        //className="bg-gray-200 w-full h-14 placeholder-black text-xl rounded-xl px-3"
                    />}
                <Pressable
                    onPress={handleOnSubmit}
                    disabled={!communityOwner}
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
