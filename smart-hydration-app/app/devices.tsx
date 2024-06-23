import PageHeading from "@/components/common/page-heading";
import PageWrapper from "@/components/common/page-wrapper";
import { Pressable, Text, View } from "react-native";
import JugFetch from "./jug-fetch";
import PopupPage from "@/components/popup-page";
import { useAtom } from "jotai";
import { popupPageAtom } from "@/atom/nav";


function DeviceRow({name}) {
    return (
        <View className="mx-6 bg-gray-200 px-7 py-4 flex flex-row justify-between rounded-xl">
            <View className="flex">
                <Text className="text-xl font-bold">{name}</Text>
                <Text className="">connected</Text>
            </View>
            <View className='flex'>
                <Text className="text-red-500 font-semibold text-right">water is stale</Text>

            </View>
        </View>
    )
}


export default function DevicesPage() {
    const [popup, setPopup] = useAtom(popupPageAtom);

    return (
        <PageWrapper>
            <PageHeading text="devices page">
                <Text className="text-3xl font-semibold" onPress={() => setPopup('devices')}>+</Text>
            </PageHeading>



            <JugFetch />
            <View className="mt-16 flex gap-6">


                <View className="flex flex-row justify-center">
                    <Pressable className="bg-gray-200 py-2 px-3 rounded-3xl"
                               onPress={() => setPopup('devices')}
                    >
                        <Text >+ add a new device</Text>
                    </Pressable>
                </View>
            </View>
            <>
                {popup === 'devices' &&
                    <PopupPage>
                            <PageHeading text="Add a device" />
                    </PopupPage>
                }
            </>

        </PageWrapper>
    )
}
