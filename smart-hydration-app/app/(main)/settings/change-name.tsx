import { updateCommunityMAtom } from "@/atom/query";
import StyledButton from "@/components/common/button";
import StyledTextInput from "@/components/common/text-input";
import { router } from "expo-router";
import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

export interface ChangeNameProps {
    community_id: string;
}

export default function ChangeName({ community_id }: ChangeNameProps) {
    const [communityName, setCommunityName] = useState<string>("");
    const { mutate, isPending, isSuccess } = useAtomValue(updateCommunityMAtom);
    useEffect(() => {
        if (isSuccess) {
            router.back();
        }
    }, [isSuccess]);

    return (
        <View className="gap-10 mx-6 mt-20">
            <Text className="text-2xl font-medium text-center dark:text-white">
                Enter Community Name:
            </Text>
            <StyledTextInput
                title="New Community Name"
                onChangeText={(value) => setCommunityName(value)}
            />
            <StyledButton
                onPress={
                    communityName
                        ? () => mutate({ name: communityName })
                        : undefined
                }
                buttonClass="bg-blue rounded-lg self-center"
                textClass="text-white text-2xl font-medium"
                text="Submit"
                isLoading={isPending}
            />
        </View>
    );
}
