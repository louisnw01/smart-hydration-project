import Name from "@/components/onboarding/name";
export default function NamePage() {
    return (
        <Name
            isOnboarding={false}
            pronoun="their"
            nextHref="add-jug-user/dob"
        />
    )
}
