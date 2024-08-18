import { addCustomCupMAtom } from "@/atom/query/drinks";
import StyledButton from "@/components/common/button";
import StyledTextInput from "@/components/common/text-input";
import Typography from "@/components/common/typography";
import { router, useLocalSearchParams } from "expo-router";
import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

export default function Success() {
    const params = useLocalSearchParams();
    const [cupName, setCupName] = useState("");
    const { mutate, isPending, isSuccess } = useAtomValue(addCustomCupMAtom);

    useEffect(() => {
        if (isPending || !isSuccess) return;
        router.dismiss();
    }, [isPending, isSuccess]);

    return (
        <View className="mx-6 gap-8 mt-20 h-full">
            <Typography className="text-xl font-semibold dark:text-white text-center">
                Water container size measurement complete!
            </Typography>
            <Text className="font-medium dark:text-white text-center mt-5">
                You measured a cup with a size of:
            </Text>
            <Typography className="font-medium text-4xl w-full text-center">
                {params.size}ml
            </Typography>

            <View className="gap-4">
                <Typography className="mt-10 font-semibold">
                    What would you like to call this cup?
                </Typography>
                <StyledTextInput title="Cup name" onChangeText={setCupName} />
            </View>
            <StyledButton
                text="Add cup to account"
                textClass="text-lg font-semibold text-white"
                buttonClass="bg-green self-center mt-10"
                onPress={() =>
                    mutate({ size: parseInt(params.size), name: cupName })
                }
                isLoading={isPending}
            />
        </View>
    );
}
