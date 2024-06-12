import {View, Text, Pressable} from "react-native";
import {popupPageAtom} from "@/atom/nav";
import {useSetAtom} from "jotai/react/useSetAtom";
import {useAtom} from "jotai";


export default function SettingsButton() {
    const [buttonAction, setButtonAction] = useAtom(popupPageAtom)
    return (
        <Pressable className="position absolute right-[20px] top-[10px]" onPress={() => {(buttonAction == "none") ? setButtonAction("settings") : setButtonAction("none")}}>
            <Text>Settings</Text>
        </Pressable>
    )
}
