import GenericOnboardContent from "@/components/onboarding/generic-onboard-content";
import Mode from "../(main)/settings/mode";
import useSettings from "../hooks/user";


export default function UserMode() {
    const { isCarer } = useSettings();
    return (
        <GenericOnboardContent proceed={true} nextHref={isCarer ? "onboarding/submit" : "onboarding/dob"}>
            <Mode></Mode>
        </GenericOnboardContent>
    );
}