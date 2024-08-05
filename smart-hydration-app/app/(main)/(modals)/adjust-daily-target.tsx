import { dailyTargetAtom, updateUserTarget } from "@/atom/query";

import Slider from "@react-native-community/slider";
import { useAtomValue } from "jotai/index";
import React from "react";
import { Button, Text, View } from "react-native";

export default function AdjustDailyTarget() {
    const currentDailyTarget = useAtomValue(dailyTargetAtom);
    const [textToDisplay, setText] = React.useState(currentDailyTarget);
    const { mutate: updateUserTargetAtom } = useAtomValue(updateUserTarget);

    function updateText(value: number) {
        setText(value.toPrecision(4));
    }

    return (
        <View className="flex-col px-8 pt-6 gap-6">
            <Text className="text-xl font-semibold">
                New Target: {textToDisplay}ml
            </Text>
            <Slider
                style={{ width: "100%", height: 40 }}
                minimumValue={1800}
                maximumValue={3000}
                value={textToDisplay}
                minimumTrackTintColor="gray"
                maximumTrackTintColor="#E5E7EB"
                onValueChange={updateText}
            />
            <Button
                onPress={() => {
                    updateUserTargetAtom(textToDisplay);
                }}
                title="Submit"
            />
        </View>
    );
}
