import { popupPageAtom } from "@/atom/nav";
import { useAtomValue } from "jotai";
import { View } from "react-native";

export default function PageWrapper({ children }: { children: JSX.Element | JSX.Element[] }) {
    const popup = useAtomValue(popupPageAtom);
    
    return (
        <View className="flex flex-1 w-screen h-full">
            {children}
        </View>
    )
}