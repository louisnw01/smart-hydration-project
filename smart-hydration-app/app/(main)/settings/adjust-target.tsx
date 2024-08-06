import { updateUserTargetMAtom } from "@/atom/query";
import {
    dailyTargetAtom,
    reverseUnitConverter,
    unitConverter,
    unitsAtom,
} from "@/atom/user";
import StyledButton from "@/components/common/button";

import Slider from "@react-native-community/slider";
import { useAtom } from "jotai";
import { useAtomValue } from "jotai/index";
import { useState } from "react";
import { Text, View } from "react-native";

export default function AdjustTarget() {
    const [currentDailyTarget, setCurrentDailyTarget] =
        useAtom(dailyTargetAtom);

    const unit = useAtomValue(unitsAtom);
    const precisionVal: number = unit == "ml" ? 4 : 2;

    const [value, setValue] = useState(unitConverter(currentDailyTarget, unit));
    const [textToDisplay, setText] = useState<string>(
        unitConverter(currentDailyTarget, unit).toPrecision(precisionVal),
    );
    const { mutate: updateUserTargetAtom } = useAtomValue(
        updateUserTargetMAtom,
    );

    return (
        <View className="flex flex-col gap-5 w-full">
            <Text className="text-center text-2xl py-6 font-semibold">
                Your daily target is{" "}
                {unitConverter(currentDailyTarget, unit).toPrecision(
                    precisionVal,
                )}{" "}
                {unit}
            </Text>
            <View className="flex-col px-8 pt-6 gap-6">
                <Text className="text-xl font-semibold">
                    New Target: {textToDisplay} {unit}
                </Text>
                <Slider
                    style={{ width: "100%", height: 40 }}
                    minimumValue={unitConverter(800, unit)}
                    maximumValue={unitConverter(3000, unit)}
                    value={value}
                    minimumTrackTintColor="gray"
                    maximumTrackTintColor="#E5E7EB"
                    onValueChange={(val) => {
                        setText(val.toPrecision(precisionVal));
                        setValue(val);
                    }}
                />
                <StyledButton
                    text="Click to adjust daily target"
                    textClass="text-lg text-center w-full"
                    onPress={() => {
                        setCurrentDailyTarget(
                            reverseUnitConverter(value, unit),
                        );
                        updateUserTargetAtom({
                            newValue: Math.floor(
                                reverseUnitConverter(value, unit),
                            ),
                        });
                    }}
                />
            </View>
        </View>
    );
}
