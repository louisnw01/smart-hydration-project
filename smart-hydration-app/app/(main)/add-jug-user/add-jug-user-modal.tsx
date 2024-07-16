import StyledButton from "@/components/common/button";
import { View } from "react-native";

export default function AddJugUser() {
    return(
        <View className="flex flex-row justify-center py-10">
            <StyledButton
                text="Click to continue"
                textSize="xl"
                href="add-jug-user/name"
            />
        </View>
    )
}