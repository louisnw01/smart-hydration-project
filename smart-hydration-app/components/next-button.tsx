import {Text, Pressable, View} from "react-native";

interface NextButtonProps {
    onPress: () => void;
  }  

export default function NextButton( { onPress }: NextButtonProps) {
    return (
        <Pressable onPress={onPress}>
            <View style = {{backgroundColor: "cyan",  alignSelf: 'flex-start' }}>
            <Text>Next</Text>
            </View>
        </Pressable>
    )
}