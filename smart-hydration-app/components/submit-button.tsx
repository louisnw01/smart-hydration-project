import {Text, Pressable, View} from "react-native";

interface SubmitButtonProps {
    onPress: () => void;
  }  

export default function SubmitButton( { onPress }: SubmitButtonProps) {
    return (
        <Pressable onPress={onPress}>
            <View style = {{backgroundColor: "green",  alignSelf: 'flex-start' }}>
            <Text>Submit</Text>
            </View>
        </Pressable>
    )
}