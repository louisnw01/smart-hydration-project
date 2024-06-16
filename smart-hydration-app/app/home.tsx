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



const settingsOptions = ["Profile", ""]





export default function HomePage() {
    const popupPage = useAtomValue(popupPageAtom);
    return (
    <PageWrapper>
        <PageHeading text='home page' />
        <SettingsButton />
        <HydrationPercentage/>
        <Droplet />
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

