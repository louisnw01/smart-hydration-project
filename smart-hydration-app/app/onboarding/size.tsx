import Logo from "@/assets/svgs/SH_logo.svg";
import { registerInfoAtom } from "@/atom/user";
import KeyboardScrollView from "@/components/common/keyboard-scrollview";
import StyledTextInput from "@/components/common/text-input";
import GenericOnboardContent from "@/components/onboarding/generic-onboard-content";
import OnboardingHeader from "@/components/onboarding/onboarding-header";
import { UserUnit } from "@/constants/user";
import { useRouter } from "expo-router";
import {  useSetAtom } from "jotai";
import { useEffect, useState } from "react";
import { Pressable, Switch, Text, View } from "react-native";

export default function SizePage() {
    const router = useRouter();
    const setInfo = useSetAtom(registerInfoAtom);
    const [formData, setFormData] = useState({
      height: '',
      weight: '',
      unit: UserUnit.POUNDS
    });
    const [proceed, setProceed] = useState(false);
    console.log('formData', formData)

    const changeValue = (name: string, value: string) => {
      setFormData({
        ...formData,
        [name]: value,
      })
    }

    useEffect(() => {
      setProceed(!!(formData.height && formData.weight))
    }, [formData])

    const isPounds = formData.unit === UserUnit.POUNDS

    return (
        <GenericOnboardContent nextHref="onboarding/medication" proceed={proceed}>
            <KeyboardScrollView keyboardVerticalOffset={-60}>
                <View className="self-center mb-8" style={{}}>
                    <Logo width={330} height={105} />
                </View>
                <OnboardingHeader text="Sign Up" />
                <View className="gap-5 mt-16">
                    <StyledTextInput
                        requiredIcon
                        title="Height"
                        onChangeText={(val) => changeValue('height', val)}
                        keyboardType="numeric"
                        onSubmitEditing={() => {
                            setInfo((prev) => ({ ...prev, height: formData.height }));
                        }}
                        onEndEditing={() => {
                          setInfo((prev) => ({ ...prev, height: formData.height }));
                        }}
                    />

                    <StyledTextInput
                        requiredIcon
                        title="Weight"
                        onChangeText={(val) => changeValue('weight', val)}
                        keyboardType="numeric"
                        onSubmitEditing={() => {
                            setInfo((prev) => ({ ...prev, weight: formData.weight }));
                        }}
                        onEndEditing={() => {
                          setInfo((prev) => ({ ...prev, weight: formData.weight }));
                        }}
                    />

                      <Text>
                        Pounds&nbsp;
                        <Switch
                          value={!isPounds}
                          onValueChange={
                            () => {
                              const newUnit = isPounds ? UserUnit.KILOS : UserUnit.POUNDS
                              changeValue('unit', newUnit)
                              setInfo((prev) => ({ ...prev, unit: newUnit }));
                            }
                          }
                        />
                      &nbsp;Kilos
                    </Text>

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
