import SodaCan from "@/assets/svgs/soda-can-svgrepo-com.svg";
import { selectedMemberAtom } from "@/atom/community";
import { addCommunityDrinkMAtom } from "@/atom/query";
import { customCupsQAtom } from "@/atom/query/drinks";
import { drinkListAtom } from "@/atom/user";
import colors from "@/colors";
import { ITimeSeries } from "@/interfaces/device";
import {
    Entypo,
    FontAwesome,
    Ionicons,
    MaterialCommunityIcons,
    SimpleLineIcons,
} from "@expo/vector-icons";
import { router, useRouter } from "expo-router";
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

function constructDrinkEvent(drinkType: DrinkType) {
    const returnValue = {
        time: parseInt((new Date().getTime() / 1000).toFixed(0)),
        value: drinkType.capacity,
    };
    return returnValue;
}

// TODO define the object before pushing to prod
function DrinkButton({ drinkType }: { drinkType: DrinkType }) {
    const [drinkList, setDrinkList] = useAtom(drinkListAtom);
    const { mutate } = useAtomValue(addCommunityDrinkMAtom);
    const juguser = useAtomValue(selectedMemberAtom);
    const router = useRouter();

    function postCommunityDrinkToDB(drinkJSON: ITimeSeries, drinkName: string) {
        if (!drinkJSON || !juguser) return;
        mutate({
            juser_id: juguser.id,
            timestamp: drinkJSON.time,
            name: drinkName,
            capacity: drinkJSON.value,
        });
        juguser.drankToday += drinkJSON.value;
        console.log("Current amount: " + juguser.drankToday);
    }

    function handleAddDrink() {
        if (drinkType.name == "Add a new cup") {
            return router.push("custom/add-custom-cup");
        }
        const drinkJSON = constructDrinkEvent(drinkType);
        if (!drinkJSON) return;
        drinkList.push(drinkJSON);
        postCommunityDrinkToDB(drinkJSON, drinkType.name);
        setDrinkList(drinkList);
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
    const { isPending, isSuccess } = useAtomValue(addCommunityDrinkMAtom);
    const [cups, setCups] = useState(drinkTypes);
    const { data: customDrinkTypes, isLoading } = useAtomValue(customCupsQAtom);

    useEffect(() => {
        if (customDrinkTypes == undefined) return;
        const newCups = [];
        for (const customDrink of customDrinkTypes) {
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

    if (isPending) {
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
