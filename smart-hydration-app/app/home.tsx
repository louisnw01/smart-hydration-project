import { Text, View } from "react-native";
import Drop from "../assets/svgs/water-drop-svgrepo-com.svg"
import PageWrapper from "@/components/common/page-wrapper";
import PageHeading from "@/components/common/page-heading";
import SettingsButton from "@/components/SettingsButton";
import { popupPageAtom } from "@/atom/nav";
import {useAtomValue} from "jotai";
import PopupPage from "@/components/PopupPage";

const settingsOptions = ["Profile", ""]

export default function HomePage() {
    const popupPage = useAtomValue(popupPageAtom)

    return (
                <PageWrapper>
                    <PageHeading text='home page'/>
                    <SettingsButton />
                    <View className="flex flex-row justify-center mt-32">
                        <Drop width={200} height={200}/>
                    </View>
                    {popupPage == "settings" &&
                    <PopupPage>
                        <Text className="text-2xl">Item 1</Text>
                        <Text className="text-2xl">Item 2</Text>
                        <Text className="text-2xl">Item 3</Text>
                    </PopupPage>
                    }
                </PageWrapper>
            )


}
