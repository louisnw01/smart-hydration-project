import {Dimensions, Switch, Text, View} from "react-native";
import Drop from "../assets/svgs/water-drop-svgrepo-com.svg"
import PageWrapper from "@/components/common/page-wrapper";
import PageHeading from "@/components/common/page-heading";
import HydrationPercentage from "@/components/hydration-pct";
import HydrationStatus from "@/components/hydration-status";
import SettingsButton from "@/components/settings-button";
import { popupPageAtom } from "@/atom/nav";
import {useAtomValue} from "jotai";
import PopupPage from "@/components/popup-page";
import OptionBlock from "@/components/common/option-block";

const settingsOptions = ["Profile", ""]

export default function HomePage() {
    const popupPage = useAtomValue(popupPageAtom);
    const { width, height } = Dimensions.get('window');
    return (
    <PageWrapper>
        <PageHeading text='home page' />
        <SettingsButton />
        <HydrationPercentage/>
        <View className="flex flex-row justify-center mt-16">
            <Drop width={width / 2} height={height / 4} />
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

