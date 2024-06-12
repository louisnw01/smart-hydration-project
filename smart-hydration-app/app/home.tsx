import { Text, View } from "react-native";
import Drop from "../assets/svgs/water-drop-svgrepo-com.svg"
import PageWrapper from "@/components/common/page-wrapper";
import PageHeading from "@/components/common/page-heading";
import HydrationPercentage from "@/components/hydration-pct";
import HydrationStatus from "@/components/hydration-status";

export default function HomePage() {
    return (
    <PageWrapper>
        <PageHeading text='home page' />
        <HydrationPercentage/>
        <View className="flex flex-row justify-center mt-32">
            <Drop width={200} height={200}/>
        </View>
        <HydrationStatus/>
    </PageWrapper>
    )
}