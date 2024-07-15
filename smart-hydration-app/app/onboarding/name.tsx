import Name from "@/components/onboarding/name";
export default function NamePage() {
    return (
        <Name
            isOnboarding={true}
            pronoun="their"
            nextHref="onboarding/dob"
        />
    )
}
