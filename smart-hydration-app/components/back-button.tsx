import {Text, Pressable} from "react-native";

interface BackButtonProps {
    onPress: () => void;
  }

//later: refactor copy and pasting between onboarding buttons
export default function BackButton( { onPress }: BackButtonProps) {
    return (
        <Pressable className="absolute bottom-0 left-0 m-5 bg-blue-200 rounded-lg px-2 py-1" onPress={onPress}>
            <Text className="font-bold text-xl">Back</Text>
        </Pressable>
    )
}
