import { jugUserInfoAtom } from "@/atom/jug-user";
import { registerInfoAtom } from "@/atom/user";
import { router } from "expo-router";
import { useSetAtom } from "jotai";
import { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import StyledTextInput from "../common/text-input";
import GenericOnboardContent from "./generic-onboard-content";
import OnboardingHeader from "./onboarding-header";

interface NameProps {
    isOnboarding: boolean;
    pronoun: string;
    nextHref: string;
}

export default function Name({ isOnboarding, pronoun, nextHref }: NameProps) {
    const [errorMessage, setErrorMessage] = useState("");
    const [proceed, setProceed] = useState(false);
    const [name, setName] = useState("");
    const setInfo = isOnboarding
        ? useSetAtom(registerInfoAtom)
        : useSetAtom(jugUserInfoAtom);

    const validateName = () => {
        if (name.length == 0) {
            setErrorMessage(`You must enter ${pronoun} name.`);
            setProceed(false);
        } else {
            setErrorMessage("");
            setProceed(true);
            setInfo((prev) => ({ ...prev, name: name }));
        }
    };

    return (
        <ScrollView contentContainerClassName="flex-1 gap-8">
            <GenericOnboardContent nextHref={nextHref} proceed={proceed}>
                <View className="py-4" />
                <OnboardingHeader text={`What is ${pronoun} name?`} />
                <StyledTextInput
                    title="Name"
                    placeholder="John Doe"
                    requiredIcon
                    onChangeText={(val) => setName(val)}
                    textContentType="name"
                    returnKeyType="done"
                    autoCapitalize="words"
                    onSubmitEditing={() => {
                        validateName();
                        if (proceed) router.push(nextHref);
                    }}
                    onEndEditing={validateName}
                />
                <View style={{ width: 350 }}>
                    <Text style={{ color: "red", fontSize: 18 }}>
                        {errorMessage}
                    </Text>
                </View>
            </GenericOnboardContent>
        </ScrollView>
    );
}
