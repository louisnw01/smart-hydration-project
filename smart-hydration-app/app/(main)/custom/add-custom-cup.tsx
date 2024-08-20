import StyledButton from "@/components/common/button";
import { router, useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

export default function AddCustomCup() {
    const params = useLocalSearchParams();
    return (
        <View className="mx-6 mt-20">
            <Text className="text-xl font-bold dark:text-white">
                Do you know the size of this cup?
            </Text>

            <View className="gap-6 mt-20">
                <StyledButton
                    text="I know the size of this cup"
                    textClass="text-lg font-medium dark:text-white"
                    buttonClass="justify-center rounded-lg"
                    onPress={() =>
                        router.push(`custom/input-size?id=${params.id}`)
                    }
                />
                <StyledButton
                    text="I don't know the size of this cup"
                    textClass="text-lg font-medium dark:text-white"
                    buttonClass="justify-center rounded-lg"
                    onPress={() =>
                        router.push(`custom/select-measure-jug?id=${params.id}`)
                    }
                />
            </View>
        </View>
    );
}
