import Name from "@/components/onboarding/name";
export default function NamePage() {
    return (
        <Name
            isOnboarding={true}
            pronoun="your"
            nextHref="onboarding/user-mode"
        />
    )
}
