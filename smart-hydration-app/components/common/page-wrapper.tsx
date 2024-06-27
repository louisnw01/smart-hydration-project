import { View } from "react-native";

export default function PageWrapper({ children }: { children: JSX.Element | JSX.Element[] }) {
    return (
        <View className="flex flex-1 w-screen h-full">
            {children}
        </View>
    )
}