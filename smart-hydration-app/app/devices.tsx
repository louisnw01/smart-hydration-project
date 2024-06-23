import PageHeading from "@/components/common/page-heading";
import PageWrapper from "@/components/common/page-wrapper";
import { Pressable, Text, View } from "react-native";
import FetchDemo from "./fetch-demo";
import PopupPage from "@/components/popup-page";
import { useAtom } from "jotai";
import { popupPageAtom } from "@/atom/nav";


function DeviceRow({name, isStale, percentFull}) {


    const staleness = isStale ? 'water is stale' : ''

    return (
        <View className="mx-6 bg-gray-200 px-7 py-4 flex flex-row justify-between rounded-xl">
            <View className="flex">
                <Text className="text-xl font-bold">{name}</Text>
                <Text className="">connected</Text>
            </View>
            <View className='flex justify-evenly'>

                <Text className="font-semibold text-right">{percentFull}% full</Text>
                <Text className="font-semibold text-right" style={{color: 'red'}}>{staleness}</Text>

            </View>
        </View>
    )
}


export default function DevicesPage() {
    const [popup, setPopup] = useAtom(popupPageAtom);

    return (
        <PageWrapper>
            <PageHeading text="Devices">
                <Text className="text-3xl font-semibold" onPress={() => setPopup('devices')}>+</Text>
            </PageHeading>

            <View className="mt-16 flex gap-6">
                <DeviceRow name="My Jug" isStale percentFull={43}/>
                <DeviceRow name="Isaac's Jug" percentFull={23}/>


                <View className="flex flex-row justify-center">
                    <Pressable className="bg-gray-200 py-2 px-3 rounded-3xl"
                        onPress={() => setPopup('devices')}
                    >
                        <Text >+ add a new device</Text>
                    </Pressable>
                </View>
            </View>

            <FetchDemo />
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