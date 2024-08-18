import { addCustomCupMAtom } from "@/atom/query/drinks";
import { unitConverter, unitsAtom } from "@/atom/user";
import StyledButton from "@/components/common/button";
import StyledTextInput from "@/components/common/text-input";

import Slider from "@react-native-community/slider";
import { router } from "expo-router";
import { useAtomValue } from "jotai/index";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

export default function AdjustTarget() {
    const unit = useAtomValue(unitsAtom);
    const precisionVal: number = unit == "ml" ? 4 : 2;

    const { mutate, isPending, isSuccess } = useAtomValue(addCustomCupMAtom);

    const [name, setName] = useState("");
    const [value, setValue] = useState(0);

    useEffect(() => {
        if (isPending || !isSuccess) return;
        router.replace("(tabs)");
    }, [isPending, isSuccess]);

    return (
        <View className="flex flex-col gap-5 w-full">
            <Text className="text-center text-2xl py-6 font-semibold">
                What is the size of the cup?
            </Text>
            <View className="flex-col px-8 pt-6 gap-6">
                <Text className="text-xl font-semibold">
                    Size: {unitConverter(value, unit).toPrecision(precisionVal)}{" "}
                    {unit}
                </Text>
                <Slider
                    style={{ width: "100%", height: 40 }}
                    minimumValue={0}
                    maximumValue={1000}
                    value={value}
                    minimumTrackTintColor="gray"
                    maximumTrackTintColor="#E5E7EB"
                    onValueChange={(val) => {
                        setValue(parseInt(val));
                    }}
                />
                <StyledTextInput title="Cup name" onChangeText={setName} />
                <StyledButton
                    text="Add cup to account"
                    textClass="text-lg font-semibold text-white"
                    buttonClass="bg-green self-center mt-10"
                    onPress={() => mutate({ name: name, size: value })}
                    isLoading={isPending}
                />
            </View>
        </View>
    );
}
