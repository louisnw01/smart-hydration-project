import { Text, Pressable } from "react-native";

interface SubmitButtonProps {
    onPress: () => void;
}

//later: refactor copy and pasting between Submit and Next
export default function SubmitButton({ onPress }: SubmitButtonProps) {
    return (
        <Pressable className="absolute bottom-0 right-0 m-5 bg-green rounded-lg px-2 py-1" onPress={onPress}>
            <Text className="font-bold text-xl">Submit all</Text>
        </Pressable>
    )
}
