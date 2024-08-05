import { createCommunityMAtom, userInfoQAtom } from "@/atom/query";
import StyledTextInput from "@/components/common/text-input";
import { router } from "expo-router";
import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";

export default function CreateCommunityModal() {
    const { data: userInfo } = useAtomValue(userInfoQAtom);
    const [communityName, setCommunityName] = useState("");
    const { mutate, isPending, isSuccess, isError } =
        useAtomValue(createCommunityMAtom);
    const [showErrorMessage, setShowErrorMessage] = useState(false);

    useEffect(() => {
        if (isPending) return;
        if (isSuccess) {
            router.back();
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
        <View className="mt-8 flex gap-6 mx-6">
            <Text className="dark:text-white text-2xl text-center">
                Enter a community name:
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
            <View className="flex flex-row justify-center items-center">
                <Pressable
                    onPress={handlePress}
                    className="bg-blue px-4 py-2 rounded-xl mt-10"
                >
                    <Text className="text-2xl font-semibold text-white">
                        Submit
                    </Text>
                </Pressable>
            </View>
        </View>
    );
}
