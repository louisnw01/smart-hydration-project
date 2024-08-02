import useColorPalette from "@/util/palette";
import { Ref, useState } from "react";
import { Text, TextInput, TextInputProps, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons"

interface StyledTextInputProps extends TextInputProps {
    requiredIcon?: boolean;
    width?: number;
    title?: string;
    inputRef?: any;
}
export default function StyledTextInput(props: StyledTextInputProps) {
    const palette = useColorPalette();
    const [showPassword, setShowPassword] = useState(props.secureTextEntry)
    // const showIcon = useState(props.secureTextEntry != undefined ? true : false);
    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <View
            style={{ width: props.width }}
            className="bg-gray-200 rounded-xl dark:bg-neutral-800 px-4 py-3"
        >
            {props.title && (
                <View className="flex flex-row gap-1">
                    <Text className="font-medium text-neutral-500">
                        {props.title}
                    </Text>
                    {props.requiredIcon && (
                        <Text className="-mt-1 text-red text-lg">*</Text>
                    )}
                </View>
            )}
            <View className="flex-row">
            <TextInput
                ref={props.inputRef}
                placeholderTextColor={palette.fglight}
                className="flex-1 h-8 text-xl dark:bg-neutral-800 dark:text-white"
                secureTextEntry={props.secureTextEntry == undefined ? undefined : !showPassword}
                {...props}
            />
            { props.secureTextEntry != undefined && (
            <MaterialCommunityIcons
                name={showPassword ? 'eye-off' : 'eye'}
                size={24}
                color="#aaa"
                onPress={toggleShowPassword}
            />)}
            </View>
        </View>
    );
}
