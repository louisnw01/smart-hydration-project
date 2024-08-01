import {
    View,
    Text,
    Pressable,
    FlatList,
    ActivityIndicator,
} from "react-native";
import { useAtom } from "jotai";
import { drinkListAtom } from "@/atom/user";
import { useAtomValue } from "jotai/index";
import { addDrinkMAtom, updateJugNameMAtom } from "@/atom/query";
import { selectedDeviceAtom } from "@/atom/device";
import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "expo-router";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import SodaCan from "@/assets/svgs/soda-can-svgrepo-com.svg";

interface DrinkType {
    name: string;
    capacity: number;
    icon: ReactNode;
}

const drinkTypes: DrinkType[] = [
    {
        name: "Can",
        capacity: 330,
        icon: (
            <View className="-ml-2">
                <SodaCan
                    className=""
                    fill="rgb(180, 180, 180)"
                    width="34"
                    height="34"
                />
            </View>
        ),
    },
    {
        name: "Bottle",
        capacity: 500,
        icon: (
            <MaterialCommunityIcons
                className="-ml-3"
                name="bottle-soda-classic-outline"
                size={39}
                color="rgb(180, 180, 180)"
            />
        ),
    },
    {
        name: "Pint",
        capacity: 568,
        icon: (
            <Ionicons
                name="pint-outline"
                className="-mx-1.5"
                size={32}
                color="rgb(180, 180, 180)"
            />
        ),
    },
    {
        name: "Mug",
        capacity: 220,
        icon: (
            <SimpleLineIcons name="cup" size={32} color="rgb(180, 180, 180)" />
        ),
    },
    {
        name: "Wine Glass",
        capacity: 415,
        icon: (
            <MaterialCommunityIcons
                className="-mx-3"
                name="glass-wine"
                size={39}
                color="rgb(180, 180, 180)"
            />
        ),
    },
    {
        name: "Add a new cup",
        capacity: 0,
        icon: (
            <View className="-ml-2">
                <FontAwesome
                    className=""
                    color="rgb(180, 180, 180)"
                    name="plus"
                    size={35}
                />
            </View>
        ),
    },
];

function constructDrinkEvent(drinkName) {
    const drinkType = drinkTypes.find((drink) => drink.name === drinkName);
    const returnValue = {
        timestamp: (new Date().getTime() / 1000).toFixed(0),
        value: drinkType.capacity,
    };
    return returnValue;
}

// TODO define the object before pushing to prod
function DrinkButton({ drinkType }: { drinkType: DrinkType }) {
    const [drinkList, setDrinkList] = useAtom(drinkListAtom);
    const { mutate, isSuccess, isPending } = useAtomValue(addDrinkMAtom);
    const router = useRouter();

    function postDrinkToDB(drinkJSON, drinkName: string) {
        if (!drinkJSON) return;
        mutate({
            timestamp: drinkJSON.timestamp,
            name: drinkName,
            capacity: drinkJSON.value,
        });
    }

    function handleAddDrink() {
        if (drinkType.name == "Add a new cup") {
            router.push("custom/add-custom-cup");
            return;
        }
        const drinkJSON = constructDrinkEvent(drinkType.name);
        drinkList.push(drinkJSON);
        postDrinkToDB(drinkJSON, drinkType.name);
        setDrinkList(drinkList);
        return;
    }

    return (
        <Pressable
            className="justify-between bg-gray-200 dark:bg-neutral-800 px-4 pt-3 pb-1 m-2 w-32 h-32 rounded-3xl"
            onPress={handleAddDrink}
        >
            {drinkType.icon}

            <View className=" ">
                <Text
                    className={`dark:text-white bottom-2 font-bold ${drinkType.name.length < 10 ? "text-xl" : "text-md"}`}
                >
                    {drinkType.name}
                </Text>

                {drinkType.capacity ? (
                    <Text className="text-xl bottom-2 font-semibold text-gray-500 dark:text-gray-400">
                        {drinkType.capacity}ml
                    </Text>
                ) : null}
            </View>
        </Pressable>
    );
}

export default function AddDrinkPane() {
    const { isPending, isSuccess } = useAtomValue(addDrinkMAtom);
    const router = useRouter();

    useEffect(() => {
        if (!isSuccess) return;
        router.back();
    }, [isSuccess]);

    if (isPending) {
        return <ActivityIndicator />;
    }

    return (
        <View className="items-center">
            <FlatList
                data={drinkTypes}
                renderItem={({ item }) => <DrinkButton drinkType={item} />}
                keyExtractor={(item) => item.name}
                contentContainerStyle={{}}
                numColumns={3} // Adjust this value as needed for your layout
            />
        </View>
    );
}
