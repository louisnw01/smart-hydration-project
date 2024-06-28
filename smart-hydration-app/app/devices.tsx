import PageHeading from "@/components/common/page-heading";
import PageWrapper from "@/components/common/page-wrapper";

import { ActivityIndicator, Pressable, Text, View } from "react-native";
import JugFetch from "./jug-fetch";
import PopupPage from "@/components/popup-page";
import { useAtom, useAtomValue } from "jotai";
import { popupPageAtom } from "@/atom/nav";
import { getJugDataQAtom } from "@/atom/query";
import DeviceRow from "@/components/devices/device-row";


export default function DevicesPage() {
    const [popup, setPopup] = useAtom(popupPageAtom);
    const { data, isLoading, isError, refetch } = useAtomValue(getJugDataQAtom);

    return (
        <PageWrapper>
            <PageHeading text="Devices">
                <Text className="text-3xl font-semibold" onPress={() => setPopup('devices')}>+</Text>
            </PageHeading>

            <View className="mt-16 flex gap-6">

                {isLoading &&
                    <View>
                        <ActivityIndicator className="justify-center top-2/4" />
                        <Text className="mt-16 flex justify-center text-center">Getting your jugs...</Text>
                    </View>
                }

                {data && data.map((device, idx) => <DeviceRow key={idx} device={device} /> )}

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
