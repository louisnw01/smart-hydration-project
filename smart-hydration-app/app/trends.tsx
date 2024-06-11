import PageHeading from "@/components/common/page-heading";
import PageWrapper from "@/components/common/page-wrapper";
import { ScrollView, Text, View } from "react-native";

export default function TrendsPage() {
    return (
        <PageWrapper>
            <PageHeading text='trends page' />


            <ScrollView>
                <View className="flex mx-8">
                    <Text className="w-full h-72 bg-gray-800 mt-12 text-3xl text-white text-center" >chart</Text>
                    <Text className="w-full h-72 bg-gray-800 mt-12 text-3xl text-white text-center" >insights</Text>
                    <Text className="w-full h-72 bg-gray-800 mt-12 text-3xl text-white text-center" >more insights</Text>
                </View>
            </ScrollView>
        </PageWrapper>
    )
}