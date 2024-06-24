import colors from "@/colors";
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
                <View className="flex-row gap-3">
                    <Text>connected</Text>
                    <BatteryIndicator charge={0.2123}/>
                </View>
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

function BatteryIndicator({charge}: {charge: number}) {
    const scaledCharge = (charge/5)*100;

    return (
        <View className="flex-row h-full gap-2">
            <View className="absolute h-3 my-1 rounded-md" style={{
                width: scaledCharge,
                backgroundColor: charge >= 0.3 ? colors.green : colors.red
            }}/>
            <View className="w-6 h-3 my-1 border rounded-md"/>
            <Text>{charge*100}%</Text>
        </View>
    )
}
