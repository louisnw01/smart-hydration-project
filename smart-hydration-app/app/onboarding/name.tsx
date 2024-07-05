import { registerInfoAtom } from "@/atom/user";
import GenericOnboardContent from "@/components/generic-onboard-content";
import { useSetAtom } from "jotai";
import { TextInput } from "react-native";

export default function NamePage() {
    const setInfo = useSetAtom(registerInfoAtom);
    return (
        <GenericOnboardContent
            title="What is your name?"
            nextHref="onboarding/dob"
        >
            <TextInput
                placeholder="Enter your name"
                onChangeText={(val) => setInfo((prev) => ({ ...prev, name: val }))}
                className="bg-gray-200 w-full h-14 placeholder-black text-xl rounded-xl px-3"
            />
        </GenericOnboardContent>
    );
}
