import { registerInfoAtom } from "@/atom/user";
import { useSetAtom } from "jotai";
import { useState } from "react";
import { TextInput, View, Text } from "react-native";
import GenericOnboardContent from "./generic-onboard-content";
import { jugUserInfoAtom } from "@/atom/jug-user";

interface DobProps {
    isOnboarding: boolean,
    title: string,
}

export default function Dob({isOnboarding, title}:DobProps) {
    const setInfo = isOnboarding ? useSetAtom(registerInfoAtom) : useSetAtom(jugUserInfoAtom);
    const [dob, setDob] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [proceed, setProceed] = useState(false);

    const validateDob = () => {
        const regex = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-(19|20)\d{2}$/;
        
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
            title={title}
            nextHref="onboarding/submit"
            proceed={proceed}
        >
            <TextInput
                placeholder="dd-mm-yyyy (required)"
                value={dob}
                onChangeText={formatDob}
                className="bg-gray-200 w-full h-14 placeholder-black text-xl rounded-xl px-3"
                textContentType="birthdate"
                returnKeyType="done"
                keyboardType="decimal-pad"
                onSubmitEditing={validateDob}
                onEndEditing={validateDob}
                
            />
            <View style={{ width: 350 }}>
                <Text style={{ color: "red", fontSize: 18 }}>
                    {errorMessage}
                </Text>
            </View>
        </GenericOnboardContent>
    );
}