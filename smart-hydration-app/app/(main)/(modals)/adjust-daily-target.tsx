import { Text, View, Button } from "react-native";
import Slider from '@react-native-community/slider';
import { useAtom } from "jotai";
import { dailyTargetAtom} from "@/atom/user";
import React from "react";
import { useAtomValue } from "jotai/index";
import { getUserTargetQAtom, linkJugToUserMAtom, updateUserTarget } from "@/atom/query";




export default function AdjustDailyTarget() {
    const [currentDailyTarget, setCurrentDailyTarget] = useAtom(dailyTargetAtom);
    const [textToDisplay, setText] = React.useState(currentDailyTarget);
    const { mutate: updateUserTargetAtom } = useAtomValue(updateUserTarget);

    function updateText(value: number) {
        setText(value.toPrecision(4));
        return;
    }


    return (
        <View className="flex-col px-8 pt-6 gap-6">
            <Text className="text-xl font-semibold">New Target: {textToDisplay}ml</Text>
            <Slider
                style={{width: "100%", height: 40}}
                minimumValue={1800}
                maximumValue={3000}
                value={textToDisplay}
                minimumTrackTintColor="gray"
                maximumTrackTintColor="#E5E7EB"
                onValueChange={updateText}
            />
            <Button
                onPress={() => {
                    updateUserTargetAtom({ newValue: textToDisplay });
                }}
                title="Submit"
            />
        </View>
    )
}
