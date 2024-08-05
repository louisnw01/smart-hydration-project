import StyledButton from "@/components/common/button";
import { Text, View } from "react-native";

export default function AddCupSizeInMls() {
    return (
        <View className="mx-6 mt-20">
            <Text className="text-xl font-bold dark:text-white">
                Do you know the size of this cup?
            </Text>

            <View className="gap-6 mt-20">
                <StyledButton
                    text="I know the size of this cup"
                    textClass="text-lg text-white font-medium"
                    buttonClass="justify-center rounded-lg"
                />
                <StyledButton
                    text="I don't know the size of this cup"
                    textClass="text-lg text-white font-medium"
                    buttonClass="justify-center rounded-lg"
                />
            </View>
        </View>
    );
}
