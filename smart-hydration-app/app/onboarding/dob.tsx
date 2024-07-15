import Dob from "@/components/onboarding/dob";

export default function DobPage() {

    return (
      <Dob 
        title="What is your date of birth"
        isOnboarding={true}
        nextHref="onboarding/submit"
      />
    )
}
