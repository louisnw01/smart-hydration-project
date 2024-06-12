import { Text, View } from "react-native";
import Drop from "../assets/svgs/water-drop-svgrepo-com.svg"
import PageWrapper from "@/components/common/page-wrapper";
import PageHeading from "@/components/common/page-heading";

export default function HomePage() {
    return (
    <PageWrapper>
        <PageHeading text='smart hydration' />

        <Text className="w-full text-center text-8xl mt-16">70%</Text>

        <View className="flex flex-row justify-center mt-32">
            <Drop width={200} height={200}/>
        </View>

    </PageWrapper>
    )
}