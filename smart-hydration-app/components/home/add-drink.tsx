import {View, Text, Pressable, FlatList, ActivityIndicator} from "react-native";
import {useAtom} from "jotai";
import {drinkListAtom} from "@/atom/user";
import {useAtomValue} from "jotai/index";
import {addDrinkMAtom, updateJugNameMAtom} from "@/atom/query";
import {selectedDeviceAtom} from "@/atom/device";
import {useEffect, useState} from "react";
import {useRouter} from "expo-router";
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
    drinkName: string;
}

// const storeDrink = async (value) => {
//   try {
//     const key = value.timestamp.toString();
//     const storedValue = JSON.stringify({
//       drinkName: value.drinkName,
//       value: value.value,
//     });
//     await AsyncStorage.setItem(key, storedValue);
//     //alert("Drink stored successfully");
//   } catch (error) {
//     alert("Error storing drink: ");
//   }
// };

// const getDrinks = async () => {
//   try {
//     const keys = await AsyncStorage.getAllKeys();

//     if (keys.length === 0) {
//       return;
//     }
//     const drinks = await AsyncStorage.multiGet(keys);
//     const formattedDrinks = drinks.map(([key, value]) => {
//       try {
//         const parsedValue = JSON.parse(value);
//         return { key, ...parsedValue };
//       } catch (error) {
//         alert("Error parsing value for key " + key + ": " + error.message);
//         return { key, value: null };
//       }
//     });
//     alert("Formatted drinks: " + JSON.stringify(formattedDrinks));
//   } catch (error) {
//     alert("Error getting drinks: " + error.message);
//   }
// };

function constructDrinkEvent(drinkName) {
    const drinkType = drinkTypes.find((drink) => drink.name === drinkName);
    const returnValue = {
        timestamp: (new Date().getTime() / 1000).toFixed(0),
        value: drinkType.capacity,
    };
    return returnValue;
}

// TODO define the object before pushing to prod
const DrinkButton: React.FC<DrinkButtonProps> = ({drinkName}) => {
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
        const drinkJSON = constructDrinkEvent(drinkName);
        drinkList.push(drinkJSON);
        postDrinkToDB(drinkJSON, drinkName);
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
                className="bg-gray-200 py-2 w-40 px-3 h-40 rounded-3xl"
                onPress={handleAddDrink}
            >
                <View className=" w-30 h-32 rounded-2xl">
                    {drinkName == "Bottle" &&
                        <MaterialCommunityIcons className="justify-center items-center text-center" name="bottle-soda-classic-outline" size={110} color="rgb(180, 180, 180)" />
                    }
                    {drinkName == "Pint" &&
                        <Ionicons className="justify-center items-center text-center top-2" name="pint-outline" size={100} color="rgb(180, 180, 180)" />
                    }
                    {drinkName == "Mug" &&
                        <SimpleLineIcons className="justify-center items-center text-center top-3 left-2" name="cup" size={80} color="rgb(180, 180, 180)" />
                    }
                    {drinkName == "Wine Glass" &&
                        <MaterialCommunityIcons className="justify-center items-center text-center top-2 left-0.5" name="glass-wine" size={100} color="rgb(180, 180, 180)" />
                    }
                    {drinkName == "Can" &&
                        <SodaCan fill="rgb(180, 180, 180)" width="100" height="100" style={{
                            left: 10,
                        }}/>
                    }


                </View>
                <Text className="text-center text-xl bottom-2">{drinkName}</Text>
            </Pressable>
        );
    }
}

export default function AddDrinkPane() {
    return (
        <View className="flex flex-row flex-wrap justify-evenly gap-6">
            <FlatList
                data={drinkTypes}
                renderItem={({item}) => (
                    <View style={{flex: 1, margin: 6}}>
                        <DrinkButton drinkName={item.name}/>
                    </View>
                )}
                keyExtractor={(item) => item.name}
                style={{flex: 1}}
                contentContainerStyle={{padding: 10}}
                columnWrapperStyle={{
                    justifyContent: "space-evenly",
                    marginBottom: 12,
                    marginLeft: 36,
                }}
                numColumns={2} // Adjust this value as needed for your layout
            />
        </View>
    );
}
