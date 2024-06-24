import { DeviceInfo } from "@/interfaces/device";
import { ReactNode } from "react";
import { View, Text } from "react-native";


export default function DeviceRow({device}: {device: DeviceInfo}) {
    const percentFull = (device.water_level / device.capacity) * 100;

    const isStale = false;
    return (
        <View className="mx-6 bg-gray-200 px-7 py-4 flex flex-row justify-between rounded-xl">
            <View className="flex">
                <Text className="text-xl font-bold">{device.name}</Text>
                <Text>connected</Text>
            </View>
            <View className='flex justify-evenly'>
                <EndText>{percentFull.toFixed(0)}% full ({device.water_level}ml)</EndText>
                <EndText className="text-red-500">{isStale && 'water is stale'}</EndText>
            </View>
        </View>
    )
}

function EndText({children, className}: {children: ReactNode, className?: string}) {
    const style = 'font-semibold text-right' + (className ?? '');
    return <Text className={style}>{children}</Text>;
}
