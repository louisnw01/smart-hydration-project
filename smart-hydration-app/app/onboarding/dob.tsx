import { registerInfoAtom } from "@/atom/user";
import GenericOnboardContent from "@/components/onboarding/generic-onboard-content";
import { useSetAtom } from "jotai";
import { TextInput, View, Text } from "react-native";
import { useState } from "react";

export default function DobPage() {
    const setInfo = useSetAtom(registerInfoAtom);
    const [dob, setDob] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [proceed, setProceed] = useState(true);

    const validateDob = () => {
        const regex = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-(19|20)\d{2}$/;
        ;
        if (!regex.test(dob)) {
          setErrorMessage('Invalid date format. Use dd-mm-yyyy.');
          setProceed(false);
        } else {
          setErrorMessage('');
          setProceed(true);
          setInfo((prev) => ({ ...prev, dob: dob }));
        }
      };

      const formatDob = (text:string) => {
    
        let cleaned = ('' + text).replace(/\D/g, '');

        let formattedDob = '';
        if (cleaned.length <= 2) {
          formattedDob = cleaned;
        } else if (cleaned.length <= 4) {
          formattedDob = cleaned.slice(0, 2) + '-' + cleaned.slice(2);
        } else if (cleaned.length <= 8) {
          formattedDob = cleaned.slice(0, 2) + '-' + cleaned.slice(2, 4) + '-' + cleaned.slice(4);
        } else {
          formattedDob = cleaned.slice(0, 2) + '-' + cleaned.slice(2, 4) + '-' + cleaned.slice(4, 8);
        }
        
        setDob(formattedDob);
        
      };

    return (
        <GenericOnboardContent
            title="What is your date of birth?"
            nextHref="onboarding/submit"
        >
            <TextInput
                placeholder="dd-mm-yyyy"
                value={dob}
                onChangeText={formatDob}
                className="bg-gray-200 w-full h-14 placeholder-black text-xl rounded-xl px-3"
                textContentType="birthdate"
                returnKeyType="done"
                keyboardType="decimal-pad"
                onSubmitEditing={validateDob}
            />
            <View style={{ width: 350 }}>
                <Text style={{ color: "red", fontSize: 18 }}>
                    {errorMessage}
                </Text>
            </View>
        </GenericOnboardContent>
    );
}
