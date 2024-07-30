import { Pressable, Text } from "react-native";

interface SubmitButtonProps {
    onPress: () => void;
}

//later: refactor copy and pasting between onboarding buttons
export default function SubmitButton({ onPress }: SubmitButtonProps) {
    return (
        <Pressable className="absolute bottom-0 left-1/2 m-5 bg-red rounded-lg px-2 py-1" onPress={onPress}>
            <Text className="font-bold text-xl">Skip</Text>
        </Pressable>
    )
}
