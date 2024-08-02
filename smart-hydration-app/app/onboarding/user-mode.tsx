import GenericOnboardContent from "@/components/onboarding/generic-onboard-content";
import OnboardingHeader from "@/components/onboarding/onboarding-header";
import { useSetAtom } from "jotai";
import { View } from "react-native";
import Mode from "../(main)/settings/mode";
import useSettings from "../hooks/user";

export default function UserMode() {
    const { isCarer } = useSettings();
    return (
        <GenericOnboardContent
            proceed={true}
            nextHref={isCarer ? "onboarding/submit" : "onboarding/dob"}
        >
            <View className="py-4" />
            <OnboardingHeader text="What mode would you like to use?" />
            <Mode></Mode>
        </GenericOnboardContent>
    );
}
