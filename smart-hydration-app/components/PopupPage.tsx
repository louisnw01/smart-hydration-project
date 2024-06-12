import { Text, View, Pressable } from "react-native";
import {useAtom} from "jotai";
import {popupPageAtom} from "@/atom/nav";
import {useSetAtom} from "jotai/react/useSetAtom";

export default function PopupPage( { children }: { children: JSX.Element | JSX.Element[] } ) {
    const [popupState, setPopupState] = useAtom(popupPageAtom)
    return (
        <View className="position absolute top-0 left-0 w-full h-full">
        <Pressable className="position absolute top-0 w-full h-1/6" onPress={() => setPopupState("none")} />
        <View className="position absolute bottom-0 w-full left-0 h-5/6 bg-gray-200 pl-5 pr-5 pt-5 gap-5 rounded-xl">
            { children }
        </View>
            </View>
    );
}
