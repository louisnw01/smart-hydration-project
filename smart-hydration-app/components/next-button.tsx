import {Text, Pressable, View} from "react-native";

interface NextButtonProps {
    onPress: () => void;
  }

export default function NextButton( { onPress }: NextButtonProps) {
    return (
        <Pressable className="absolute bottom-0 right-0 m-5 bg-blue-200 rounded-lg px-2 py-1" onPress={onPress}>
            <Text className="font-bold text-xl">Next</Text>
        </Pressable>
    )
}
