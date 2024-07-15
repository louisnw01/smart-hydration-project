import { registerInfoAtom } from "@/atom/user";
import { useSetAtom } from "jotai";
import { useState } from "react";
import { TextInput, View, Text } from "react-native";
import GenericOnboardContent from "./generic-onboard-content";
import { jugUserInfoAtom } from "@/atom/jug-user";

interface NameProps {
    isOnboarding: boolean,
    pronoun: string,
    nextHref: string,
}

export default function Name({isOnboarding, pronoun, nextHref}:NameProps) {
    const [errorMessage, setErrorMessage] = useState('');
    const [proceed, setProceed] = useState(false);
    const [name, setName] = useState('');
    const setInfo = isOnboarding ? useSetAtom(registerInfoAtom) : useSetAtom(jugUserInfoAtom);

    const validateName = () => {
    
        if (name.length == 0) {
          setErrorMessage(`You must enter ${pronoun} name.`);
          setProceed(false);
        } else {
          setErrorMessage('');
          setProceed(true);
          setInfo((prev) => ({ ...prev, name: name }))
        }
      };

    return (
        <GenericOnboardContent
            nextHref={nextHref}
            proceed={proceed}
        >
            <TextInput
                placeholder={`Enter ${pronoun} name (required)`}
                onChangeText={(val) => setName(val)}
                className="bg-gray-200 w-full h-14 placeholder-black text-xl rounded-xl px-3"
                textContentType="name"
                returnKeyType="done"
                onSubmitEditing={validateName}
                onEndEditing={validateName}
            />
            <View style={{ width: 350 }}>
                <Text style={{ color: "red", fontSize: 18 }}>
                    {errorMessage}
                </Text>
            </View>
        </GenericOnboardContent>
    );
}