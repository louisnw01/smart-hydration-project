import { DeviceInfo } from "@/interfaces/device";
import { ReactNode } from "react";
import { View, Text, Pressable } from "react-native";
import PopupPage from "@/components/popup-page";
import { popupPageAtom } from "@/atom/nav";
import { useAtom, useAtomValue } from "jotai";
import PageHeading from "@/components/common/page-heading";


export default function DeviceRow({device, onPress}: {device: DeviceInfo, onPress: Function}) {
    const [popup, setPopup] = useAtom(popupPageAtom);
    const percentFull = (device.water_level / device.capacity) * 100;

    const isStale = false;
    return (
        <Pressable className="mx-6 bg-gray-200 px-7 py-4 flex flex-row justify-between rounded-xl"
                   onPress={()=>onPress()}
        >
            <View className="flex">
                <Text className="text-xl font-bold">{device.name}</Text>
                <Text>connected</Text>
            </View>
            <View className='flex justify-evenly'>
                <EndText>{percentFull.toFixed(0)}% full ({device.water_level}ml)</EndText>
                <EndText className="text-red-500">{isStale && 'water is stale'}</EndText>
            </View>
        </Pressable>
    )
}

function EndText({children, className}: {children: ReactNode, className?: string}) {
    const style = 'font-semibold text-right' + (className ?? '');
    return <Text className={style}>{children}</Text>;
}
