import { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { atom, useAtom } from "jotai";
import {popupPageAtom, selectedPageAtom} from "@/atom/nav";
import HomePage from "@/app/home";
import TrendsPage from "@/app/trends";
import DevicesPage from "@/app/devices";

interface NavProps {
    text: string,
    handlePress: Function,
    activeButton: boolean,
}

function NavItem({text}: {text: string}) {
    const [page, setPage] = useAtom(selectedPageAtom);
    const [popupStatus, setPopupStatus] = useAtom(popupPageAtom);
    const color = page == text ? 'black' : 'rgb(100, 100, 100)';

    return (
        <Pressable className="flex flex-col"
            onPress={() => {setPage(text); setPopupStatus("none");}}>
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
    return (
        <View className="fixed bottom-0 left-0 flex flex-row border-t border-gray-200 justify-between w-screen py-2 px-10">
            <NavItem text='home' />
            <NavItem text='trends' />
            <NavItem text='devices' />
        </View>
    )
}
