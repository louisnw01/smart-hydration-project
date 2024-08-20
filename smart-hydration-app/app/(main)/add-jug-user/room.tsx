import Room from "@/components/onboarding/room";
export default function NamePage() {
    return (
        <Room
            isOnboarding={false}
            pronoun="their"
            nextHref="add-jug-user/submit"
        />
    )
}