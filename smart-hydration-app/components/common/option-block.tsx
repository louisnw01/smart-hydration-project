import colors from "@/colors";
import { useAtom } from "jotai";
import { useState } from "react";
import { Switch, View, Text } from "react-native";

export default function OptionBlock({ text, atom }) {
    const [toggled, setToggled] = useAtom(atom);
    return (
        <View className="flex-row justify-between bg-gray-100 rounded-xl px-7 py-3 dark:bg-neutral-800">
            <Text className="text-xl mt-1 dark:text-white">{text}</Text>
            <Switch
                trackColor={{ false: "gray", true: colors.blue }}
                onValueChange={(value) => setToggled(!toggled)}
                value={toggled}
            />
        </View>
    );
}
