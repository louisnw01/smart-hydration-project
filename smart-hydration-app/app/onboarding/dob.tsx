import { registerInfoAtom } from "@/atom/user";
import GenericOnboardContent from "@/components/generic-onboard-content";
import { useSetAtom } from "jotai";
import { TextInput } from "react-native";

export default function DobPage() {
    const setInfo = useSetAtom(registerInfoAtom);
    return (
        <GenericOnboardContent
            title="What is your date of birth?"
            nextHref="onboarding/submit"
        >
            <TextInput
                placeholder="dd-mm-yyyy"
                onChangeText={(val) => setInfo((prev) => ({ ...prev, dob: val }))}
            />
        </GenericOnboardContent>
    );
}
