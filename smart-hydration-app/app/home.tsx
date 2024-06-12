import {Switch, Text, View} from "react-native";
import Drop from "../assets/svgs/water-drop-svgrepo-com.svg"
import PageWrapper from "@/components/common/page-wrapper";
import PageHeading from "@/components/common/page-heading";
import HydrationPercentage from "@/components/hydration-pct";
import HydrationStatus from "@/components/hydration-status";
import SettingsButton from "@/components/SettingsButton";
import { popupPageAtom } from "@/atom/nav";
import {useAtomValue} from "jotai";
import PopupPage from "@/components/PopupPage";
import OptionBlock from "@/components/common/OptionBlock";

const settingsOptions = ["Profile", ""]

export default function HomePage() {
    const popupPage = useAtomValue(popupPageAtom);

    return (
    <PageWrapper>
        <PageHeading text='home page' />
        <SettingsButton />
        <HydrationPercentage/>
        <View className="flex flex-row justify-center mt-32">
            <Drop width={200} height={200}/>
        </View>
        <HydrationStatus/>
        {popupPage == "settings" &&
            <PopupPage>
                <OptionBlock text='Dark Mode' />
                <OptionBlock text='Notifications' />
                <OptionBlock text='Auto-Update' />
            </PopupPage>
        }
    </PageWrapper>
    )
}

