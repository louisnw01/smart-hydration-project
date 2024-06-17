import { Text, View } from "react-native";

export default function PageHeading({children, text}: {children?: JSX.Element | JSX.Element[], text: string}) {
    return (
        <View className="absolute w-full z-10">
            <View className="flex flex-row justify-between mx-6">
                <Text className="text-3xl font-semibold">{text}</Text>
                {children}
            </View>
        </View>
    )
}