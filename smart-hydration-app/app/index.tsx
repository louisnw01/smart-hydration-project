import NavigationBar from "@/components/nav";
import "../global.css"
import { Text, View } from 'react-native';
import { useAtomValue } from "jotai";
import { selectedPageAtom } from "@/atom/nav";
import PageRouter from "@/components/page-router";

export default function Index() {
    return (
        <View className="flex flex-1 justify-between h-full">
            <PageRouter />
            <NavigationBar />
        </View>
    );
}