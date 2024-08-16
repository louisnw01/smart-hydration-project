import StyledButton from "@/components/common/button";
import { router } from "expo-router";
import { View } from "react-native";

export default function AddJugUser() {
    return (
        <View className="flex flex-row justify-center py-10">
            <StyledButton
                text="Click to continue"
                textClass="text-lg"
                onPress={() => router.push("add-jug-user/name")}
            />
        </View>
    );
}
