import { View, Pressable, Text} from "react-native";
import { useRouter } from "expo-router";
import { SelectInputBox } from "@/components/onboarding/select-input-box";
import { useEffect, useState } from "react";

export interface EditTagsProps {

}

export default function EditTags({ }: EditTagsProps) {

    const [communityOwner, setCommunityOwner] = useState<string>('')

    const handleStartup = async () => {
      
    }

    useEffect(() => {
      handleStartup();
    })

    const handleOnSubmit = () => {
    }
    const router = useRouter();
    return (
        <View className="flex flex-1 gap-8 mx-16 items-center mt-10">
            <View className="items-center gap-4 mt-20">
                    <Text className="text-black text-2xl font-semibold text-center">
                      Edit community tags
                    </Text>
            </View>
        </View>
    );
}
