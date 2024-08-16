import StyledButton from "@/components/common/button";
import Typography from "@/components/common/typography";
import JugBaseDiagram from "@/components/devices/jug-base-diagram";
import { router } from "expo-router";
import { View } from "react-native";

export default function SuccessPage() {
    return (
        <View className="mx-6 flex-1 justify-center mb-12 gap-10">
            <Typography className="text-lg font-medium">
                Pairing is now complete. You can now put your jug back into
                normal mode, by pressing the RESET button again.
            </Typography>

            <JugBaseDiagram />

            <StyledButton
                text="Back to devices"
                buttonClass="bg-green mt-5"
                textClass="text-center w-full text-lg font-medium text-white"
                onPress={() => {
                    router.replace("devices");
                }}
            />
        </View>
    );
}
