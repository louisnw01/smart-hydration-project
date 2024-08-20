import Logo from "@/assets/svgs/SH_logo.svg";
import { registerInfoAtom } from "@/atom/user";
import KeyboardScrollView from "@/components/common/keyboard-scrollview";
import GenericOnboardContent from "@/components/onboarding/generic-onboard-content";
import { SelectInputBox } from "@/components/onboarding/select-input-box";
import { useRouter } from "expo-router";
import { useSetAtom } from "jotai";
import { useEffect, useState } from "react";
import { Text,  View } from "react-native";

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

    const onSelectMedicine = (value: string[]) => {
      let medicationData = ''
      if (value.length) {
        medicationData = value.join(', ')
      }

      setInfo((prev) => ({ ...prev, medication: medicationData }))
      changeValue('medication', medicationData)
    }

    useEffect(() => {
      setProceed(!!formData.medication)
    }, [formData])

    return (
        <GenericOnboardContent nextHref="onboarding/dob" proceed={proceed}>
            <KeyboardScrollView keyboardVerticalOffset={-60}>
                <View className="self-center mb-8" style={{}}>
                    <Logo width={330} height={105} />
                </View>
                <View className="gap-5 mt-16">
                    <SelectInputBox
                      onChangeMultiple={onSelectMedicine}
                      multiple
                      data={[
                        {
                          key: '1',
                          value: "Medicine 1"
                        },
                        {
                          key: '2',
                          value: "Medicine 2"
                        }
                      ]}
                    />

                    <Text style={{ color: "red", fontSize: 18 }}>

                    </Text>


                </View>
            </KeyboardScrollView>
        </GenericOnboardContent>
    );
}
