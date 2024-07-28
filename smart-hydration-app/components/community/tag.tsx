import { View, Text } from "react-native";

//to do: add multiple colours. for now all tags are blue with white text

export default function Tag({ name }: { name: string }) {
    return (
        <View className="bg-blue dark:bg-neutral-800 rounded-full px-3 py-1 mx-1 my-1">
            <Text className="text-white font-bold dark:text-black text-sm">{name}</Text>
        </View>
        
    );
}

