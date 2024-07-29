import { View } from "react-native";
import Drop from "@/assets/svgs/water-drop-svgrepo-com.svg";
import { useRouter } from "expo-router";
import useColorPalette from "@/util/palette";
import StyledButton from "@/components/common/button";

export default function LoginRegister() {
    const palette = useColorPalette();
    const router = useRouter();
    return (
        <View className="flex flex-1 gap-4 mx-6 mt-20">
            <View className="self-center">
                <Drop width={100} height={100} fill={palette.border} />
            </View>

            <StyledButton
                text="Login"
                buttonClass="justify-center bg-blue rounded-xl mt-32"
                textClass="text-2xl text-white font-medium"
                onPress={() => router.push("/onboarding/login")}
            />

            <StyledButton
                text="Register"
                buttonClass="justify-center bg-blue rounded-xl"
                textClass="text-2xl text-white font-medium"
                onPress={() => router.push("onboarding/register")}
            />
        </View>
    );
}
