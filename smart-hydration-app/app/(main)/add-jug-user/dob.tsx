import Dob from "@/components/onboarding/dob";

export default function DobPage() {
    return (
        <Dob
            isOnboarding={false}
            nextHref="add-jug-user/room"
            pronoun="their"
        />
    );
}
