import { jugUserInfoAtom } from "@/atom/jug-user";
import { registerInfoAtom } from "@/atom/user";
import { router } from "expo-router";
import { useSetAtom } from "jotai";
import { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import StyledTextInput from "../common/text-input";
import GenericOnboardContent from "./generic-onboard-content";
import OnboardingHeader from "./onboarding-header";

interface RoomProps {
    isOnboarding: boolean;
    pronoun: string;
    nextHref: string;
}

export default function Name({ isOnboarding, pronoun, nextHref }: RoomProps) {
    const [errorMessage, setErrorMessage] = useState("");
    const [proceed, setProceed] = useState(false);
    const [room, setRoom] = useState("");
    const setRegisterInfo = useSetAtom(registerInfoAtom);
    const setJugUserInfo = useSetAtom(jugUserInfoAtom);

    const validateRoomName = () => {
        if (room.length == 0) {
            setErrorMessage(`You must enter ${pronoun} room name or number.`);
            setProceed(false);
        } else {
            setErrorMessage("");
            setProceed(true);
            if (isOnboarding)
                setRegisterInfo((prev) => ({ ...prev, room: room }));
            else setJugUserInfo((prev) => ({ ...prev, room: room }));
        }
    };

    return (
        <ScrollView contentContainerClassName="flex-1 gap-8">
            <GenericOnboardContent nextHref={nextHref} proceed={proceed}>
                <View className="py-4" />
                <OnboardingHeader text={`What is ${pronoun} room?`} />
                <StyledTextInput
                    title="Room"
                    placeholder="Room name"
                    requiredIcon
                    onChangeText={(val) => setRoom(val)}
                    textContentType="name"
                    returnKeyType="done"
                    autoCapitalize="words"
                    onSubmitEditing={() => {
                        validateRoomName();
                        if (proceed) router.push(nextHref);
                    }}
                    onEndEditing={validateRoomName}
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
