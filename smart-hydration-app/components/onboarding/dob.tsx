import { jugUserInfoAtom } from "@/atom/jug-user";
import { registerInfoAtom } from "@/atom/user";
import { router } from "expo-router";
import { useSetAtom } from "jotai";
import { useState } from "react";
import { Text, View, ScrollView } from "react-native";
import StyledTextInput from "../common/text-input";
import GenericOnboardContent from "./generic-onboard-content";
import OnboardingHeader from "./onboarding-header";

interface DobProps {
    isOnboarding: boolean;
    nextHref: string;
    pronoun: string;
}

export default function Dob({ isOnboarding, nextHref, pronoun }: DobProps) {
    const setRegiserInfo = useSetAtom(registerInfoAtom);
    const setJugUserInfo = useSetAtom(jugUserInfoAtom);
    const [dob, setDob] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [proceed, setProceed] = useState(false);

    const validateDob = () => {
        const regex = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-(19|20)\d{2}$/;

        if (!regex.test(dob)) {
            setErrorMessage("Invalid date format. Use dd-mm-yyyy.");
            setProceed(false);
            return false;
        } else {
            setErrorMessage("");
            setProceed(true);

            if (isOnboarding) setRegiserInfo((prev) => ({ ...prev, dob: dob }));
            else setJugUserInfo((prev) => ({ ...prev, dob: dob }));
            return true;
        }
    };

    const formatDob = (text: string) => {
        let cleaned = ("" + text).replace(/\D/g, "");

        let formattedDob = "";
        if (cleaned.length <= 2) {
            formattedDob = cleaned;
        } else if (cleaned.length <= 4) {
            formattedDob = cleaned.slice(0, 2) + "-" + cleaned.slice(2);
        } else if (cleaned.length <= 8) {
            formattedDob =
                cleaned.slice(0, 2) +
                "-" +
                cleaned.slice(2, 4) +
                "-" +
                cleaned.slice(4);
        } else {
            formattedDob =
                cleaned.slice(0, 2) +
                "-" +
                cleaned.slice(2, 4) +
                "-" +
                cleaned.slice(4, 8);
        }

        setDob(formattedDob);
    };

    return (
        <ScrollView contentContainerClassName="flex-1 gap-8">
            <GenericOnboardContent nextHref={nextHref} proceed={proceed}>
                <View className="py-4" />
                <OnboardingHeader text={`What is ${pronoun} date of birth?`} />
                <StyledTextInput
                    requiredIcon
                    title="Date of Birth"
                    placeholder="dd-mm-yyyy"
                    value={dob}
                    onChangeText={formatDob}
                    textContentType="birthdate"
                    returnKeyType="done"
                    keyboardType="decimal-pad"
                    onSubmitEditing={() => {
                        if (validateDob()) router.push(nextHref);
                    }}
                    onEndEditing={validateDob}
                />

                <Text style={{ color: "red", fontSize: 18 }}>{errorMessage}</Text>
            </GenericOnboardContent>
        </ScrollView>
    );
}
