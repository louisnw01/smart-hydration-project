import useColorPalette from "@/util/palette";
import { Text, TextInput, TextInputProps, View } from "react-native";

interface StyledTextInputProps extends TextInputProps {
    requiredIcon?: boolean;
    width?: number;
}
export default function StyledTextInput(props: StyledTextInputProps) {
    const palette = useColorPalette();
    return (
        <View style={{ width: props.width ?? 350 }}>
            <TextInput
                placeholderTextColor={palette.fglight}
                className="bg-gray-200 w-full h-14 text-xl rounded-xl px-3 dark:bg-neutral-800 dark:text-white"
                {...props}
            />
            {props.requiredIcon && (
                <Text className="absolute right-3 top-1 text-red text-lg">
                    *
                </Text>
            )}
        </View>
    );
}
