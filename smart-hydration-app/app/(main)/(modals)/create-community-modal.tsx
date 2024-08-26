import { createCommunityMAtom, userInfoQAtom } from "@/atom/query";
import StyledButton from "@/components/common/button";
import StyledTextInput from "@/components/common/text-input";
import { router } from "expo-router";
import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

export default function CreateCommunityModal() {
    const { data: userInfo } = useAtomValue(userInfoQAtom);
    const [communityName, setCommunityName] = useState("");
    const { mutate, isPending, isSuccess, isError } =
        useAtomValue(createCommunityMAtom);
    const [showErrorMessage, setShowErrorMessage] = useState(false);

    useEffect(() => {
        if (isPending) return;
        if (isSuccess) {
            router.dismissAll();
        } else if (isError) {
            // TODO: show an error message
        }
    }, [isPending, isSuccess, isError]);

    const handlePress = () => {
        //TODO: check if community exists before allowing creation
        if (communityName !== "") {
            mutate({ name: communityName });
            //     setCommunityNameAtom(communityName);
            //     setUserHasCommunity(true);
            //     navigation.goBack();
        } else {
            setShowErrorMessage(true);
        }
    };

    return (
        <View className="mt-16 flex gap-16 mx-6">
            <Text className="dark:text-white text-2xl text-center">
                What would you like to call your community?
            </Text>
            <StyledTextInput
                requiredIcon
                placeholder={`${userInfo?.name}'${userInfo?.name && userInfo.name[userInfo.name.length - 1] != "s" ? "s" : ""} Community`}
                title="Community Name"
                onChangeText={(val) => {
                    setCommunityName(val);
                    setShowErrorMessage(false);
                }}
                textContentType="name"
                returnKeyType="done"
            />
            {showErrorMessage && (
                <View className="flex flex-row justify-center items-center">
                    <Text className="dark:text-white text-2xl">
                        You must enter a community name
                    </Text>
                </View>
            )}

            <StyledButton
                text="Submit & Create Community"
                buttonClass="bg-green px-4 py-2 rounded-xl self-center mt-8"
                textClass="text-xl font-medium text-white"
                onPress={handlePress}
                isLoading={isPending}
            />
        </View>
    );
}
