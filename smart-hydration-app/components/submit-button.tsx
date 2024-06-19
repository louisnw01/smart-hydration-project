import {Text, Pressable, View} from "react-native";

interface SubmitButtonProps {
    onPress: () => void;
<<<<<<< HEAD
  }
=======
  }  
>>>>>>> 76493d7070a7c311f41169784180511ff99bf82f
//later: refactor copy and pasting between Submit and Next
export default function SubmitButton( { onPress }: SubmitButtonProps) {
    return (
        <Pressable className="absolute bottom-0 right-0 m-5 bg-green-200 rounded-lg px-2 py-1" onPress={onPress}>
            <Text className="font-bold text-xl">Submit</Text>
        </Pressable>
    )
}
