import { helloWorldQAtom } from "@/atom/query";
import { useAtomValue } from "jotai";
import { DeviceRow } from "./devices"
import {Button, FlatList, Text, View} from "react-native";

export default function FetchDemo() {
    const { data, isLoading, isError, refetch } = useAtomValue(helloWorldQAtom);

    let text;
    if (isLoading) {
        text = 'Loading...'
    } else if (isError) {
        text = 'Error loading data'
    } else if (data == undefined){
        text = []
    } else {
        text = JSON.parse(data);
    }




    return (
        <View>
            {isLoading == false &&
            <View className="mt-16 flex gap-6">{
                text.map((value) => {
                    const firstValue = Object.values(value)[0]
                    const jugName = Object.keys(value)
                    return (
                        <View>
                        <View className="mx-6 bg-gray-200 px-7 py-4 flex flex-row justify-between rounded-xl">
                            <View className="flex">
                                <Text className="text-xl font-bold">{jugName}</Text>
                                {firstValue != 'Jug Not Found' &&
                                <Text className="">connected</Text>
                                }
                            </View>
                            <View className='flex'>
                                {firstValue != 'Jug Not Found' ?
                                <View>
                                    <Text className="text-red-500 font-semibold text-right">
                                        {firstValue.water_after}ml
                                    </Text>
                                    <Text className="text-red-500 font-semibold text-right">
                                        {firstValue.timestamp}
                                    </Text>
                                </View>
                                    :
                                    <Text className="text-l font-semibold">Jug Not Found</Text>
                                }

                            </View>
                        </View>
                        </View>
                    )
                })
            }</View>
            }
            <Button onPress={() => refetch()} title="refetch data" />
        </View>
    )
}
