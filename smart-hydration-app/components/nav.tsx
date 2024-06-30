import { View, Text, Pressable, Appearance } from "react-native";
import { useAtom, useAtomValue } from "jotai";
import { popupPageAtom, selectedPageAtom } from "@/atom/nav";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function NavItem({ text }: { text: string }) {
    const [page, setPage] = useAtom(selectedPageAtom);

    const activeColor =
        Appearance.getColorScheme() == "dark" ? "white" : "black";
    const baseColor =
        Appearance.getColorScheme() == "dark"
            ? "rgb(200, 200, 200)"
            : "rgb(100, 100, 100)";
    const color = page === text ? activeColor : baseColor;

    return (
        <Pressable
            className="flex flex-col"
            onPress={() => {
                setPage(text);
            }}
        >
            <View
                className="h-8 w-8 mx-2 rounded-lg"
                style={{ backgroundColor: color }}
            />
            <Text style={{ color: color }} className="text-xs text-center">
                {text}
            </Text>
        </Pressable>
    );
}

export default function NavigationBar() {
    const popupShown = useAtomValue(popupPageAtom) !== "none";
    const insets = useSafeAreaInsets();

    if (popupShown) {
        return null;
    }

    return (
        <View
            className="absolute bg-white flex flex-row border-t border-gray-200 justify-between w-screen py-2 px-10 dark:bg-black dark:border-gray-800"
            style={{
                bottom: insets.bottom,
            }}
        >
            <NavItem text="home" />
            <NavItem text="trends" />
            <NavItem text="devices" />
        </View>
    );
}
