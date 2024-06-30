import { Text, View } from "react-native";

export default function PageHeading({
    children,
    text,
    marginTop,
}: {
    children?: JSX.Element | JSX.Element[];
    text: string;
    marginTop: number;
}) {
    return (
        <View className="absolute w-full z-10">
            <View className="flex flex-row justify-between mx-6">
                <Text className="text-3xl font-semibold dark:text-white">
                    {text}
                </Text>
                {children}
            </View>
        </View>
    );
}
