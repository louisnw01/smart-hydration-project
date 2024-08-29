import AddDrinkPane from "@/components/home/add-drink";
import { View, Text } from "react-native";

export default function AddDrinkModal() {
    return (
        <View>
            <Text className="dark:text-white font-bold text-2xl mt-4 mx-6 text-center">
                Select a volume of water
            </Text>
            <View className="top-5">
                <AddDrinkPane />
            </View>
        </View>
    );
}
