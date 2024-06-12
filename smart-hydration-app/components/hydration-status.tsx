import { View, Text } from "react-native";

export default function HydrationStatus () {
    return (
        <View className="mx-6 px-7 bg-gray-200 py-4 flex flex-row rounded-xl mt-16">
            <Text className="w-full text-center text-3xl" >
                Well done! You're on track!
            </Text>
        </View>
    )
}