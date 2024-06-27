import { TextInput, TextInputProps } from 'react-native';

export interface TextInputProperties {
    placeholder?: string;
    onChange?: (text: string) => void;
    textContentType?: TextInputProps['textContentType'];
    setValue: (value: string) => void;
}

//passing setValue function into this component, so that the value entered in text box can be used in onboardin.tsx

//add validation to ensure only text can be entered?
const TextInputBox = ({ placeholder, textContentType, setValue }: TextInputProperties) => {
    return (
        <TextInput
            placeholder={placeholder}
            onChangeText={setValue}
            placeholderTextColor='black'
            textContentType={textContentType}
            secureTextEntry={textContentType == 'password'}
            className="bg-gray-200 w-full h-14 placeholder-black text-xl rounded-xl px-3"
        />
    );
};

export default TextInputBox;
