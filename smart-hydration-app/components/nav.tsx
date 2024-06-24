import { View, Text, Pressable } from "react-native";
import { useAtom, useAtomValue } from "jotai";
import { popupPageAtom, selectedPageAtom } from "@/atom/nav";


function NavItem({text}: {text: string}) {
    const [page, setPage] = useAtom(selectedPageAtom);
    const color = page === text ? 'black' : 'rgb(100, 100, 100)';

    return (
        <Pressable className="flex flex-col"
            onPress={() => {setPage(text)}}>
            <View className="h-8 w-8 mx-2 rounded-lg"
                style={{backgroundColor: color}}
            />
            <Text
                style={{color: color}}
                className="text-xs text-center"
            >
                {text}
            </Text>
        </Pressable>
    )
}

export default function NavigationBar() {
    const popupShown = useAtomValue(popupPageAtom) !== 'none';

    if (popupShown) {
        return null;
    }

    return (
        <View className="absolute bottom-0 bg-white flex flex-row border-t border-gray-200 justify-between w-screen py-2 px-10">
            <NavItem text='home' />
            <NavItem text='trends' />
            <NavItem text='devices' />
        </View>
    )
}
