import PageWrapper from "@/components/common/page-wrapper";
import PageHeading from "@/components/common/page-heading";
import HydrationPercentage from "@/components/hydration-pct";
import AddDrinkPane from "@/components/add-drink";
import HydrationStatus from "@/components/hydration-status";
import SettingsButton from "@/components/settings-button";
import { popupPageAtom } from "@/atom/nav";
import {useAtom} from "jotai";
import PopupPage from "@/components/popup-page";
import OptionBlock from "@/components/common/option-block";
import Droplet from "@/components/droplet";
import { View, Text, Pressable } from "react-native";
import {useAtomValue} from "jotai/index";
import {getDailyHydrationAtom, getJugDataQAtom} from "@/atom/query";


export default function HomePage() {
    const [popupPage, setPopupAtom] = useAtom(popupPageAtom);

    return (
    <PageWrapper>
        <PageHeading text='smart hydration'>
            <SettingsButton />
        </PageHeading>
        <View className="flex justify-evenly h-full">
            <HydrationPercentage/>
            <Droplet />

            <HydrationStatus/>
            <View className="flex flex-row justify-center">
                <Pressable className="bg-gray-200 px-4 py-1 rounded-2xl" onPress={() => {setPopupAtom('adddrink')}}>
                <Text className="text-xl">+ add a drink</Text>
                </Pressable>
            </View>
        </View>

        <>
            {popupPage === "settings" &&
                <PopupPage>
                    <OptionBlock text='Dark Mode' />
                    <OptionBlock text='Notifications' />
                    <OptionBlock text='Auto-Update' />
                </PopupPage>
            }
            {popupPage === "adddrink" &&
                <PopupPage>
                    <AddDrinkPane />
                </PopupPage>
            }
        </>
    </PageWrapper>
    )
}

