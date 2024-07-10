import { View, Text, Pressable } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

const drinkTypes: {
    'Can (330ml)': number,
    'Bottle (500ml)': number,
    'Pint (568ml)': number,
    'Mug (220ml)': number,
    'Wine Glass (415ml)': number,
    'Custom Cup': number,
} = {
    'Can (330ml)': 330,
    'Bottle (500ml)': 500,
    'Pint (568ml)': 568,
    'Mug (220ml)': 220,
    'Wine Glass (415ml)': 415,
    'Custom Cup': 220,
}

interface DrinkButtonProps {
    drinkName: string,
    onPress: (drinkName: string) => void;
}

const storeDrink = async (value) => {
    try {
        const key = value.timestamp.toISOString();
        const storedValue = JSON.stringify({
            drinkName: value.drinkName,
            value: value.value
        });
        await AsyncStorage.setItem(key, storedValue);
        //alert("Drink stored successfully");
    } catch (error) {
        alert("Error storing drink: ");
    }
}

const getDrinks = async () => {
    try {
        const keys = await AsyncStorage.getAllKeys();
        //alert("Retrieved keys: " + JSON.stringify(keys));

        if (keys.length === 0) {
            //alert("No drinks found");
            return;
        }

        const drinks = await AsyncStorage.multiGet(keys);
        //alert("Retrieved drinks: " + JSON.stringify(drinks));

        const formattedDrinks = drinks.map(([key, value]) => {
            try {
                const parsedValue = JSON.parse(value);
                return { key, ...parsedValue };
            } catch (parseError) {
                alert("Error parsing value for key " + key + ": " + parseError.message);
                return { key, value: null };
            }
        });

        alert("Formatted drinks: " + JSON.stringify(formattedDrinks));
    } catch (error) {
        alert("Error getting drinks: " + error.message);
    }
}

function constructDrinkEvent(drinkName) {
    const returnValue = {
        timestamp: new Date(),
        drinkName: drinkName,
        value: drinkTypes[drinkName]
    };
    alert(JSON.stringify(returnValue));
    return returnValue;
}

function handleAddDrink(drinkName: string) {
    const drinkJSON = constructDrinkEvent(drinkName)
    storeDrink(drinkJSON)
    getDrinks()
    return;
}

// TODO define the object before pushing to prod
const DrinkButton: React.FC<DrinkButtonProps> = ({ drinkName, onPress }) => {
    return (
        <Pressable className="bg-gray-200 py-2 w-40 px-3 h-40 rounded-3xl" onPress={() => onPress(drinkName)}>
            <View className="bg-blue w-30 h-32 rounded-2xl"></View>
            <Text className="text-center">{drinkName}</Text>
        </Pressable>
    )
}


const clearStorage = async () => {
    try {
        await AsyncStorage.clear();
        alert("AsyncStorage cleared successfully");
    } catch (error) {
        alert("Error clearing AsyncStorage");
    }
};

export default function AddDrinkPane() {
    return (
        <View className="flex flex-row flex-wrap justify-evenly gap-6">
            <DrinkButton drinkName="Can (330ml)" onPress={handleAddDrink} />
            <DrinkButton drinkName="Bottle (500ml)" onPress={handleAddDrink} />
            <DrinkButton drinkName="Mug (220ml)" onPress={handleAddDrink} />
            <DrinkButton drinkName="Pint (568ml)" onPress={handleAddDrink} />
            <DrinkButton drinkName="Custom Cup" onPress={handleAddDrink} />
            <DrinkButton drinkName="Clear Storage" onPress={clearStorage} />
        </View>
    )
}
