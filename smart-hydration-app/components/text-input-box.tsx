import { TextInput } from 'react-native';

export interface TextInputProperties {
    placeholder?: string;
    onChange?: (text: string) => void;
    textContentType?: string;
}

//add validation to ensure only text can be entered?
const TextInputBox = ({ placeholder, onChange, textContentType }: TextInputProperties) => {
    return (
        <TextInput
            placeholder={placeholder}
            onChangeText={onChange}
            placeholderTextColor='black'
            textContentType={textContentType}
            secureTextEntry={textContentType == 'password'}
            className="bg-gray-200 w-full h-14 placeholder-black text-xl rounded-xl px-3"
        />
    );
};

export default TextInputBox;
