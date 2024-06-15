import {useState} from "react";
import {Switch, View, Text} from "react-native";


export default function OptionBlock( { text }) {
    const [toggled, setToggled] = useState(false)
    return (
        <View className="flex-row justify-between pr-10 bg-gray-100 rounded-xl px-7 py-4">
        <Text className="text-2xl">{text}</Text>
        <Switch trackColor={{false: 'gray', true: 'green'}}
            onValueChange={(value) => setToggled(!toggled)}
            value={toggled}/>
        </View>
    )
}
