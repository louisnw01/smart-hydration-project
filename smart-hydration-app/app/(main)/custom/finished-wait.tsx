import StyledButton from "@/components/common/button";
import { router } from "expo-router";
import { Text, View } from "react-native";

export default function FinishedWait() {
    return (
        <View className="mx-6 gap-16 mt-20 h-full">
            <Text className="text-xl font-bold dark:text-white text-center">
                All done!
            </Text>
            <Text className="font-medium dark:text-white text-center">
                We will let you know when your measurement has completed. For
                now, you can continue to use the app as normal.
            </Text>
            <StyledButton
                text="Take me home"
                textClass="text-lg font-semibold"
                buttonClass="bg-blue self-center"
                onPress={() => router.replace("(tabs)")}
            />
        </View>
    );
}
