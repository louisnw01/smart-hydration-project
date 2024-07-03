import { registerInfoAtom } from "@/atom/user";
import GenericOnboardContent from "@/components/generic-onboard-content";
import TextInputBox from "@/components/text-input-box";
import { useSetAtom } from "jotai";

export default function DobPage() {
    const setInfo = useSetAtom(registerInfoAtom);
    return (
        <GenericOnboardContent
            title="What is your date of birth?"
            nextHref="onboarding/submit"
        >
            <TextInputBox
                placeholder="dd-mm-yyyy"
                onChange={(val) => setInfo((prev) => ({ ...prev, dob: val }))}
            />
        </GenericOnboardContent>
    );
}
