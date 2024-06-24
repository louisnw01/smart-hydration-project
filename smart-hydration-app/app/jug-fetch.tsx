import { getJugDataQAtom, helloWorldQAtom } from "@/atom/query";
import { useAtomValue } from "jotai";
import { ActivityIndicator, Button, FlatList, Text, View } from "react-native";

export default function DeviceFetch() {
    const { data, isLoading, isError, refetch } = useAtomValue(getJugDataQAtom);

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

    const formattedDate: {
        date: string,
        time: string,
    } = {
        date: "",
        time: "",
    };

    function convertDateTime(dateString: string) {
        // makes sense as the timestamps are always the same length
        formattedDate.date = dateString.substring(0, 10);
        formattedDate.time = dateString.substring(11, 16);
        return formattedDate;
    }




    return (
        <View>
            {isLoading == false ?
                <View className="mt-16 flex gap-6">{
                text.map((value: object) => {
                    const firstValue = Object.values(value)[0]
                    const jugName = Object.keys(value)
                    return (
                        <View>
                        <View className="mx-6 bg-gray-200 px-7 py-4 flex flex-row justify-between rounded-xl">
                            <View className="flex">
                                <Text key="{jugName}" className="text-xl font-bold">{jugName}</Text>
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
                                        {convertDateTime(firstValue.timestamp).time}
                                    </Text>
                                    <Text className="text-red-500 font-semibold text-right">
                                        {convertDateTime(firstValue.timestamp).date}
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
                :
                <View>
                    <ActivityIndicator className="justify-center top-2/4"></ActivityIndicator>
                <Text className="mt-16 flex justify-center text-center">Loading Jugs, Please Wait...</Text>

                </View>
            }
            <Button onPress={() => refetch()} title="refetch data" />
        </View>
    )
}
