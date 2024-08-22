import { Text, View } from "react-native";

//to do: add multiple colours. for now all tags are blue with white text

export default function Tag({ name }: { name: string }) {
    return (
        <View className="bg-red rounded-full px-2 py-1 mx-1 my-1">
            <Text className="text-white font-bold text-sm">{name}</Text>
        </View>
    );
}
