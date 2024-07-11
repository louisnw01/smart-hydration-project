import { registerInfoAtom } from "@/atom/user";
import GenericOnboardContent from "@/components/onboarding/generic-onboard-content";
import { useSetAtom } from "jotai";
import { useState } from "react";
import { TextInput, Text, View } from "react-native";

export default function NamePage() {
    const [errorMessage, setErrorMessage] = useState('');
    const [proceed, setProceed] = useState(false);
    const [name, setName] = useState('');
    const setInfo = useSetAtom(registerInfoAtom);

    const validateName = () => {
    
        if (name.length == 0) {
          setErrorMessage('You must enter your name.');
          setProceed(false);
        } else {
          setErrorMessage('');
          setProceed(true);
          setInfo((prev) => ({ ...prev, name: name }))
        }
      };

    return (
        <GenericOnboardContent
            title="What is your name?"
            nextHref="onboarding/dob"
            proceed={proceed}
        >
            <TextInput
                placeholder="Enter your name (required)"
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
