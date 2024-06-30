import { Text, Pressable } from "react-native";
import { popupPageAtom } from "@/atom/nav";
import { useSetAtom } from "jotai";
import { Link } from "expo-router";

export default function SettingsButton() {
    const setButtonAction = useSetAtom(popupPageAtom);
    return (
        <Link href="/settings-modal" className="dark:text-white">
            Settings
        </Link>
    );
}
