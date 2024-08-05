import Logo from "@/assets/svgs/SH_logo.svg";
import StyledButton from "@/components/common/button";
import { useRouter } from "expo-router";
import { View } from "react-native";

export default function LoginRegister() {
    const router = useRouter();
    return (
        <View className="flex flex-1 mx-6 justify-center">            
            <View className="self-center">
                <Logo width={350} height={125}/>
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
