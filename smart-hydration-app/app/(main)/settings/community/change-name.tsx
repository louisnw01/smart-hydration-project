import { View, Pressable, Text, TextInput} from "react-native";
import { useRouter } from "expo-router";

export default function ChangeName() {
    const router = useRouter();
    return (
        <View className="flex flex-1 gap-8 mx-16 items-center mt-10">
            <View className="items-center gap-4 mt-20">

                    <Text className="text-black text-2xl font-semibold text-center">
                      Enter Community Name
                    </Text>
                    <TextInput
                        placeholder="Enter Community name"
                        textContentType="emailAddress"
                        autoCapitalize="none"
                        className="bg-gray-200 w-full h-14 placeholder-black text-xl rounded-xl px-3"
                    />
                <Pressable
                    onPress={() => router.push("onboarding/register")}
                    className="bg-blue px-2 py-2 rounded-lg w-32"
                >
                    <Text className="text-white text-2xl font-semibold text-center">
                        Submit
                    </Text>
                </Pressable>


            </View>
        </View>
    );
}
