import Logo from "@/assets/svgs/SH_logo.svg";
import { registerInfoAtom } from "@/atom/user";
import KeyboardScrollView from "@/components/common/keyboard-scrollview";
import StyledTextInput from "@/components/common/text-input";
import GenericOnboardContent from "@/components/onboarding/generic-onboard-content";
import OnboardingHeader from "@/components/onboarding/onboarding-header";
import RadioButton from "@/components/onboarding/radio-button";
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
      unit: UserUnit.KILOS
    });
    const [proceed, setProceed] = useState(false);
    console.log('formData', formData)

    const changeValue = (name: string, value: string) => {
      if (['height', 'weight'].includes(name)) {
        value = value.replace(/[^\d.-]/g, '')
      }

      setFormData({
        ...formData,
        [name]: value,
      })
    }

    useEffect(() => {
      setProceed(!!(formData.height && formData.weight))
    }, [formData])

    const isPounds = formData.unit === UserUnit.POUNDS

    const capitalized = (val: string): string => {
      return val.charAt(0).toUpperCase() + val.slice(1)
    }

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
                        placeholder="0.00"
                        value={formData.height}
                        onChangeText={(val) => changeValue('height', val)}
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
                        placeholder="0.00"
                        value={formData.weight}
                        onChangeText={(val) => changeValue('weight', val)}
                        keyboardType="numeric"
                        onSubmitEditing={() => {
                            setInfo((prev) => ({ ...prev, weight: formData.weight }));
                        }}
                        onEndEditing={() => {
                          setInfo((prev) => ({ ...prev, weight: formData.weight }));
                        }}
                    />

                      <RadioButton
                        onChange={(val) => {
                          const newVal = val.toLowerCase() as UserUnit
                          changeValue('unit', newVal)
                          setInfo((prev) => ({ ...prev, unit: newVal }));
                        }}
                        options={[capitalized(UserUnit.KILOS), capitalized(UserUnit.POUNDS)]}
                        defaultString={capitalized(formData.unit)}
                      />

                    <Text style={{ color: "red", fontSize: 18 }}>

                    </Text>


                </View>
            </KeyboardScrollView>
        </GenericOnboardContent>
    );
}
