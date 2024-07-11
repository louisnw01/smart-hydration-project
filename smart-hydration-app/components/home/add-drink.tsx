import { View, Text, Pressable, FlatList, ActivityIndicator } from "react-native";
import { useAtom } from "jotai";
import { drinkListAtom } from "@/atom/user";
import { useAtomValue } from "jotai/index";
import { addDrinkMAtom, updateJugNameMAtom } from "@/atom/query";
import {selectedDeviceAtom} from "@/atom/device";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import SodaCan from '@/assets/svgs/soda-can-svgrepo-com.svg';


interface DrinkType {
    name: string;
    capacity: number;
}

const drinkTypes: DrinkType[] = [
    {name: "Can", capacity: 330},
    {name: "Bottle", capacity: 500},
    {name: "Pint", capacity: 568},
    {name: "Mug", capacity: 220},
    {name: "Wine Glass", capacity: 415},
];


interface DrinkButtonProps {
    drinkType: DrinkType;
}

function constructDrinkEvent(drinkName) {
    const drinkType = drinkTypes.find((drink) => drink.name === drinkName);
    const returnValue = {
        timestamp: (new Date().getTime() / 1000).toFixed(0),
        value: drinkType.capacity,
    };
    return returnValue;
}

// TODO define the object before pushing to prod
const DrinkButton: React.FC<DrinkButtonProps> = ({drinkType}) => {
    const [drinkList, setDrinkList] = useAtom(drinkListAtom);
    const {mutate, isSuccess, isPending} = useAtomValue(addDrinkMAtom);
    const router = useRouter();
    useEffect(() => {
        if (!isSuccess) return;
        router.back();
    }, [isSuccess]);

    function postDrinkToDB(drinkJSON, drinkName: string) {
        if (!drinkJSON) return;
        mutate({timestamp: drinkJSON.timestamp, name: drinkName, capacity: drinkJSON.value});
    }

    function handleAddDrink() {
        const drinkJSON = constructDrinkEvent(drinkType.name);
        drinkList.push(drinkJSON);
        postDrinkToDB(drinkJSON, drinkType.name);
        setDrinkList(drinkList);
        alert(drinkList)
        return;
    }

    if (isPending) {
        return (
            <ActivityIndicator/>
        )
    } else {
        return (

            <Pressable
                className="justify-between bg-gray-200 px-4 pt-3 pb-1 m-2 w-32 h-32 rounded-3xl"
                onPress={handleAddDrink}
            >

                    {drinkType.name == "Bottle" &&
                        <MaterialCommunityIcons className="-ml-3" name="bottle-soda-classic-outline" size={39}
                                                color="rgb(180, 180, 180)"/>
                    }
                    {drinkType.name == "Pint" &&
                        <Ionicons name="pint-outline" className="-mx-1.5"
                                  size={32} color="rgb(180, 180, 180)"/>
                    }
                    {drinkType.name == "Mug" &&
                        <SimpleLineIcons name="cup"
                                         size={32} color="rgb(180, 180, 180)"/>
                    }
                    {drinkType.name == "Wine Glass" &&
                        <MaterialCommunityIcons className="-mx-3" name="glass-wine" size={39} color="rgb(180, 180, 180)"/>
                    }
                    {drinkType.name == "Can" &&
                        <View className="-ml-2">
                        <SodaCan className="" fill="rgb(180, 180, 180)" width="34" height="34" />
                        </View>
                    }

                <View className=" ">
                    <Text className={`bottom-2 font-bold ${drinkType.name.length < 10 ? 'text-xl' : 'text-md'}`}>{drinkType.name}</Text>
                    <Text className="text-xl bottom-2 font-semibold text-gray-500">{drinkType.capacity}ml</Text>
                </View>
            </Pressable>
        );
    }
}

export default function AddDrinkPane() {
    return (
        <View className="items-center">
            <FlatList
                data={drinkTypes}
                renderItem={({item}) => (
                    <View>
                        <DrinkButton drinkType={item}/>
                    </View>
                )}
                keyExtractor={(item) => item.name}
                contentContainerStyle={{}}
                numColumns={3} // Adjust this value as needed for your layout
            />
        </View>
    );
}
