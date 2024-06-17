import PageWrapper from "@/components/common/page-wrapper";
import PageHeading from "@/components/common/page-heading";
import HydrationPercentage from "@/components/hydration-pct";
import HydrationStatus from "@/components/hydration-status";
import SettingsButton from "@/components/settings-button";
import { popupPageAtom } from "@/atom/nav";
import {useAtomValue} from "jotai";
import PopupPage from "@/components/popup-page";
import OptionBlock from "@/components/common/option-block";
import Droplet from "@/components/droplet";
import { View } from "react-native";


export default function HomePage() {
    const popupPage = useAtomValue(popupPageAtom);
    return (
    <PageWrapper>
        <PageHeading text='home page'>
            <SettingsButton />
        </PageHeading>

        <View className="flex justify-evenly h-full">
            <HydrationPercentage/>
            <Droplet />
            <HydrationStatus/>
        </View>

        <>
            {popupPage === "settings" &&
                <PopupPage>
                    <OptionBlock text='Dark Mode' />
                    <OptionBlock text='Notifications' />
                    <OptionBlock text='Auto-Update' />
                </PopupPage>
            }
        </>
    </PageWrapper>
    )
}

