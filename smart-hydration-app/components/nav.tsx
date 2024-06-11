import { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { atom, useAtom } from "jotai";
import { selectedPageAtom } from "@/atom/nav";
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

    const color = page == text ? 'black' : 'rgb(100, 100, 100)';

    return (
        <TouchableOpacity className="flex flex-col"
            onPress={() => setPage(text)}
        >
            <View className="h-8 w-8 mx-2"
                style={{backgroundColor: color}}
            />
            <Text
                style={{color: color}}
                className="text-xs text-center"
            >
                {text}
            </Text>
        </TouchableOpacity>
    )
}

export default function NavigationBar() {
    return (
        <View className="flex flex-row bg-gray-100 justify-between w-screen py-2 px-10">
            <NavItem text='home' />
            <NavItem text='trends' />
            <NavItem text='devices' />
        </View>
    )
}
