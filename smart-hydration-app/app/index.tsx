import NavigationBar from "@/components/nav";
import "../global.css"
import { Text, View } from 'react-native';
import { useAtomValue } from "jotai";
import { selectedPageAtom } from "@/atom/nav";
import PageRouter from "@/components/page-router";

export default function Index() {
    const page = useAtomValue(selectedPageAtom);

    return (

        <View className="flex justify-between h-full">
            {/*<Text className="bg-black text-md text-white">you are hydrated</Text>*/}
            <PageRouter />
            <NavigationBar />


        </View>

    );
}


