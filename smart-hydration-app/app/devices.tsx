import PageHeading from "@/components/common/page-heading";
import PageWrapper from "@/components/common/page-wrapper";

import { ActivityIndicator, Pressable, Text, View } from "react-native";
import JugFetch from "./jug-fetch";

import PopupPage from "@/components/popup-page";
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, Text, View } from "react-native";
import { useSetAtom, useAtomValue } from "jotai";
import { popupPageAtom } from "@/atom/nav";
import { getJugDataQAtom } from "@/atom/query";
import DeviceRow from "@/components/devices/device-row";
import { DeviceInfo } from "@/interfaces/device";
import { useState } from "react";
import { unlinkJugFromUserMAtom } from "@/atom/query";
import TextInputWithButton from "@/components/text-input-box-button";


export default function DevicesPage() {
    const popupPage = useAtomValue(popupPageAtom);
    const setPopup = useSetAtom(popupPageAtom);
    const [refreshing, setRefreshing] = useState(true);
    const [device, setDevice] = useState<DeviceInfo|null>(null);
    const { data, isLoading, refetch } = useAtomValue(getJugDataQAtom);
    const {mutate} = useAtomValue(unlinkJugFromUserMAtom);

    const wait = (timeout: number | undefined) => {
        return new Promise(resolve => setTimeout(resolve, timeout));
      };

    const handleRefresh = () => {
        setRefreshing(true);
        refetch();
        wait(2000).then(() => setRefreshing(false))
    }

    // if (!isLoading && refreshing) {
    //     setRefreshing(false);
    // }
    

    return (
        <PageWrapper>
            <ScrollView
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />

            }>
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

                {data && data.map((device, idx) => <DeviceRow key={idx} device={device} onPress= {()=>{
                    setPopup('device');
                    setDevice(device);
                    }} /> )}

                <View className="flex flex-row justify-center">
                    <Pressable className="bg-gray-200 py-2 px-3 rounded-3xl"
                               onPress={() => setPopup('devices')}
                    >
                        <Text >+ add a new device</Text>
                    </Pressable>
                </View>
            </View>
            <>
                {popupPage === 'devices' &&
                    <PopupPage>
                            <PageHeading text="Add a device"/>
                            <View className="flex flex-row justify-center pt-20">
                                <TextInputWithButton name="jug-link-input" placeholder="e.g. jug001053"
                                label="Input Smart Hydration ID"/>
                            </View>
                    </PopupPage>
                }

                {popupPage === 'device' &&
                    <PopupPage>
                        <PageHeading text={`${device.name} options`} />
                        <View className="flex flex-row justify-center py-20">
                            <Pressable className="bg-red px-4 py-1 rounded-2xl"
                                       onPress={()=>{
                                        mutate(device.id);
                                        setPopup('none');
                                    }}
                            >
                                <Text className="text-xl">Delete device</Text>
                            </Pressable>
                        </View>
                    </PopupPage>
                }   
            </>
            </ScrollView>
        </PageWrapper>
    )
}
