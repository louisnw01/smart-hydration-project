import SodaCan from "@/assets/svgs/soda-can-svgrepo-com.svg";
import { userJugUserIdAtom } from "@/atom/query";
import { addDrinkMAtom, customCupsQAtom } from "@/atom/query/drinks";
import { drinkListAtom, unitConverter, unitsAtom } from "@/atom/user";
import colors from "@/colors";
import { ITimeSeries } from "@/interfaces/device";
import {
    Entypo,
    FontAwesome,
    Ionicons,
    MaterialCommunityIcons,
    SimpleLineIcons,
} from "@expo/vector-icons";

import { router, useLocalSearchParams, useRouter } from "expo-router";
import { useAtom } from "jotai";
import { useAtomValue } from "jotai/index";
import { ReactNode, useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Pressable,
    Text,
    View,
} from "react-native";

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
];

function constructDrinkEvent(drinkType: DrinkType) {
    // const drinkType = drinkTypes.find((drink) => drink.name === drinkName);
    // if (!drinkType) return;
    const returnValue = {
        time: Math.round(new Date().getTime() / 1000),
        value: drinkType.capacity,
    };
    return returnValue;
}

// TODO define the object before pushing to prod
function DrinkButton({ drinkType }: { drinkType: DrinkType }) {
    const [drinkList, setDrinkList] = useAtom(drinkListAtom);
    const { mutate } = useAtomValue(addDrinkMAtom);
    const usersJugUser = useAtomValue(userJugUserIdAtom);
    const params = useLocalSearchParams();
    const juguserIdToAdd = params.id || usersJugUser;
    const router = useRouter();
    const unit = useAtomValue(unitsAtom);

    function postDrinkToDB(drinkJSON: ITimeSeries, drinkName: string) {
        if (!drinkJSON) return;

        mutate({
            timestamp: drinkJSON.time,
            name: drinkName,
            capacity: drinkJSON.value,
            juguser_id: juguserIdToAdd,
        });
    }

    function handleAddDrink() {
        if (drinkType.name == "Add a new cup") {
            router.push(`custom/add-custom-cup?id=${juguserIdToAdd}`);
            return;
        }
        const drinkJSON = constructDrinkEvent(drinkType);
        if (!drinkJSON) return;
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
                        {Math.floor(unitConverter(drinkType.capacity, unit))}
                        {unit}
                    </Text>
                ) : null}
            </View>
        </Pressable>
    );
}

export default function AddDrinkPane() {
    const { isPending, isSuccess } = useAtomValue(addDrinkMAtom);
    const params = useLocalSearchParams<{ id: string }>();
    const usersJugUser = useAtomValue(userJugUserIdAtom);
    const jugUserId = params.id || usersJugUser;
    const [cups, setCups] = useState(drinkTypes);
    const { data: customDrinkTypes, isLoading } = useAtomValue(customCupsQAtom);

    useEffect(() => {
        const newCups = [];
        if (customDrinkTypes && jugUserId) {
            const drinkTypesForUser = customDrinkTypes[jugUserId];
            for (const customDrink of drinkTypesForUser) {
                newCups.push({
                    name: customDrink.name,
                    capacity: customDrink.size,
                    icon: (
                        <View className="-ml-2">
                            <Entypo name="cup" size={24} color={colors.green} />
                        </View>
                    ),
                });
            }
        }
        newCups.push({
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
        });
        setCups([...drinkTypes, ...newCups]);
    }, [customDrinkTypes]);

    useEffect(() => {
        if (!isSuccess) return;
        router.back();
    }, [isSuccess]);

    if (isPending || isLoading) {
        return <ActivityIndicator />;
    }

    return (
        <View className="items-center">
            <FlatList
                data={cups}
                renderItem={({ item }) => <DrinkButton drinkType={item} />}
                keyExtractor={(item) => item.name}
                contentContainerStyle={{}}
                numColumns={3} // Adjust this value as needed for your layout
            />
        </View>
    );
}
