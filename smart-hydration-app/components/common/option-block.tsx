import colors from "@/colors";
import {useState} from "react";
import {Switch, View, Text} from "react-native";


export default function OptionBlock( { text }) {
    const [toggled, setToggled] = useState(false)
    return (
        <View className="flex-row justify-between bg-gray-100 rounded-xl px-7 py-3 dark:bg-gray-800">
            <Text className="text-xl mt-1 dark:text-white">{text}</Text>
            <Switch
                trackColor={{false: 'gray', true: colors.blue}}
                onValueChange={(value) => setToggled(!toggled)}
                value={toggled}
            />
        </View>
    )
}
