import Logo from "@/assets/svgs/SH_logo.svg";
import { registerInfoAtom } from "@/atom/user";
import KeyboardScrollView from "@/components/common/keyboard-scrollview";
import StyledTextInput from "@/components/common/text-input";
import GenericOnboardContent from "@/components/onboarding/generic-onboard-content";
import OnboardingHeader from "@/components/onboarding/onboarding-header";
import { useRouter } from "expo-router";
import { useSetAtom } from "jotai";
import { useEffect, useState } from "react";
import { Pressable, Text,  View } from "react-native";

export default function MedicationPage() {
    const router = useRouter();
    const setInfo = useSetAtom(registerInfoAtom);
    const [formData, setFormData] = useState({
      medication: '',
    });
    const [proceed, setProceed] = useState(false);

    const changeValue = (name: string, value: string) => {
      setFormData({
        ...formData,
        [name]: value,
      })
    }

    useEffect(() => {
      setProceed(!!formData.medication)
    }, [formData])

    return (
        <GenericOnboardContent nextHref="onboarding/submit" proceed={proceed}>
            <KeyboardScrollView keyboardVerticalOffset={-60}>
                <View className="self-center mb-8" style={{}}>
                    <Logo width={330} height={105} />
                </View>
                <View className="gap-5 mt-16">
                    <StyledTextInput
                        requiredIcon
                        title="Medication"
                        onChangeText={(val) => changeValue('medication', val)}
                        keyboardType="default"
                        onSubmitEditing={() => {
                            setInfo((prev) => ({ ...prev, medication: formData.medication }));
                        }}
                        onEndEditing={() => {
                          setInfo((prev) => ({ ...prev, medication: formData.medication }));
                        }}
                    />

                    <Text style={{ color: "red", fontSize: 18 }}>

                    </Text>

                    <Pressable
                        onPress={() => router.push("onboarding/login")}
                        style={{ marginTop: 24 }}
                        //accessibilityRole="link"
                        //accessibilityLabel="Navigate to login"
                    >
                        {({ pressed }) => (
                            <Text
                                style={{
                                    fontWeight: "600",
                                    color: pressed ? "darkblue" : "blue",
                                    textDecorationLine: "underline",
                                }}
                            >
                                Already have an account? Login
                            </Text>
                        )}
                    </Pressable>
                </View>
            </KeyboardScrollView>
        </GenericOnboardContent>
    );
}
