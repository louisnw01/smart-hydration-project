import PageWrapper from "@/components/common/page-wrapper";
import PageHeading from "@/components/common/page-heading";
import HydrationPercentage from "@/components/hydration-pct";
import HydrationStatus from "@/components/hydration-status";
import SettingsButton from "@/components/settings-button";
import { useAtomValue } from "jotai";
import PopupPage from "@/components/popup-page";
import OptionBlock from "@/components/common/option-block";
import Droplet from "@/components/droplet";
import { View, Text, Pressable } from "react-native";
import StyledButton from "@/components/common/button";

export default function HomePage() {
    return (
        <PageWrapper>
            {/* <PageHeading text="smart hydration">
                <SettingsButton />
            </PageHeading> */}

            <View className="flex justify-evenly h-full items-center">
                <HydrationPercentage />
                <Droplet />

                <HydrationStatus />
                <StyledButton text="+ add a drink" textSize="xl" href="home" />
            </View>
        </PageWrapper>
    );
}
