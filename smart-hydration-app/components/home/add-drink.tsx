import {View, Text, Pressable} from "react-native";

const drinkTypes: {
    can: number,
    bottle: number,
    pint: number,
    mug: number,
    redwineglass: number,
    customcup: number,
} = {
    can: 330,
    bottle: 500,
    pint: 568,
    mug: 220,
    redwineglass: 415,
    customcup: 220,
}

interface DrinkButtonProps {
    drinkName: string,
}

// TODO define the object before pushing to prod
function DrinkButton( { drinkName }:DrinkButtonProps) {
    return (
        <Pressable className="bg-gray-200 py-2 w-40 px-3 h-40 rounded-3xl">
            <View className="bg-blue w-30 h-32 rounded-2xl"></View>
            <Text className="text-center">{drinkName}</Text>
        </Pressable>
    )
}


// export default function AddDrinkPane() {
//     return (
//         <View className="flex flex-row flex-wrap justify-evenly gap-6">
//             <DrinkButton drinkName="Can (330ml)" type={drinkTypes.can} />
//             <DrinkButton drinkName="Bottle (500ml)" type={drinkTypes.bottle} />
//             <DrinkButton drinkName="Mug (220ml)" type={drinkTypes.mug}/>
//             <DrinkButton drinkName="Pint (568ml)" type={drinkTypes.pint}/>
//             <DrinkButton drinkName="Custom Cup" type={drinkTypes.customcup}/>
//         </View>
//     )
// }
