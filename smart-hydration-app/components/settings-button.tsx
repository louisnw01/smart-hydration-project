import { Text, Pressable} from "react-native";
import { popupPageAtom } from "@/atom/nav";
import { useSetAtom } from "jotai";


export default function SettingsButton() {
    const setButtonAction = useSetAtom(popupPageAtom)
    return (
        <Pressable className="w-12 h-12" onPress={() => setButtonAction("settings")}>
            <Text>Settings</Text>
        </Pressable>
    )
}
