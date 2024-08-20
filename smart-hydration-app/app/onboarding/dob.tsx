import Dob from "@/components/onboarding/dob";

export default function DobPage() {
    return (
        <Dob isOnboarding={true} nextHref="onboarding/submit" pronoun="your" />
    );
}
