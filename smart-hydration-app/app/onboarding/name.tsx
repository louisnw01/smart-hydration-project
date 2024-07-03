import { registerInfoAtom } from "@/atom/user";
import GenericOnboardContent from "@/components/generic-onboard-content";
import TextInputBox from "@/components/text-input-box";
import { useSetAtom } from "jotai";

export default function NamePage() {
    const setInfo = useSetAtom(registerInfoAtom);
    return (
        <GenericOnboardContent
            title="What is your name?"
            nextHref="onboarding/dob"
        >
            <TextInputBox
                placeholder="Enter your name"
                onChange={(val) => setInfo((prev) => ({ ...prev, name: val }))}
            />
        </GenericOnboardContent>
    );
}
