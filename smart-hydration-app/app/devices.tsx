import PageHeading from "@/components/common/page-heading";
import PageWrapper from "@/components/common/page-wrapper";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";



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


function FetchDemo() {
    const [fetchedValue, setFetchedValue] = useState<string|null>(null);


    const fetchData = async () => {
        const response = await fetch('http://localhost:8081/');
        const data = await response.json();
        setFetchedValue(data.message);
    }

    fetchData();

    if (fetchedValue == null) {
        return null;
    }

    return (
        <Text className="text-xl font-bold">{fetchedValue}</Text>
    )
}



export default function DevicesPage() {
    const [showAddNew, setShowAddNew] = useState<boolean>(false);

    const handlePress = () => {
        setShowAddNew(true);
    }

    const handleClose = () => {
        setShowAddNew(false);
    }

    return (
        <PageWrapper>
            <View className="flex flex-row justify-between">
                <PageHeading text="devices page" />
                <Text className="text-3xl font-semibold mr-6 mt-1" onPress={handlePress}>+</Text>
            </View>

            <View className="mt-12 flex gap-6">
                <DeviceRow name="My Jug" />
                <DeviceRow name="Isaac's Jug" />


                <View className="flex flex-row justify-center">
                    <Pressable className="bg-gray-200 py-2 px-3 rounded-3xl"
                        onPress={handlePress}
                    >
                        <Text >+ add a new device</Text>
                    </Pressable>
                </View>
            </View>

            <FetchDemo />



            {showAddNew &&
                <View className="absolute bottom-0 left-0 w-full h-[80%]">

                    <View className="mx-4 bg-gray-200 rounded-lg p-5 h-full">


                        <Text className="absolute right-0 text-2xl font-bold mr-2" onPress={handleClose}>x</Text>


                        <Text>Add a device</Text>


                    </View>
                </View>
            }

        </PageWrapper>
    )
}