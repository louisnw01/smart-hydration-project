import Drop from "@/assets/svgs/water-drop-svgrepo-com.svg";
import StyledButton from "@/components/common/button";
import OnboardingHeader from "@/components/onboarding/onboarding-header";
import useColorPalette from "@/util/palette";
import { useRouter } from "expo-router";
import { View } from "react-native";

export default function LoginRegister() {
    const palette = useColorPalette();
    const router = useRouter();
    return (
        <View className="flex flex-1 gap-4 mx-6 justify-center">
            <OnboardingHeader text="smart hydration" />
            <View className="self-center">
                <Drop width={100} height={100} fill={palette.border} />
            </View>

            <View className="gap-4">
                <StyledButton
                    text="Login"
                    buttonClass="py-3 justify-center bg-blue rounded-xl mt-28"
                    textClass="text-2xl text-white"
                    onPress={() => router.push("/onboarding/login")}
                />

                <StyledButton
                    text="Register"
                    buttonClass="py-3 justify-center bg-blue rounded-xl"
                    textClass="text-2xl text-white"
                    onPress={() => router.push("onboarding/register")}
                />
            </View>
        </View>
    );
}
