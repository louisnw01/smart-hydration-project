import { TextInput } from 'react-native';

export interface TextInputProperties {
    placeholder?: string;
    onChange?: (text: string) => void;
    textContentType?: string;
    keyboardType?: string;
    autoCapitalize?: string;
}

//add validation to ensure only text can be entered?
export default function TextInputBox ({ placeholder, onChange, textContentType, keyboardType, autoCapitalize }: TextInputProperties) {
    return (
        <TextInput
            placeholder={placeholder}
            onChangeText={onChange}
            placeholderTextColor='black'
            textContentType={textContentType}
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize}
            secureTextEntry={textContentType === 'password'}
            className="bg-gray-200 w-full h-14 placeholder-black text-xl rounded-xl px-3"
        />
    );
};
