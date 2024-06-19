import React, {useState} from 'react';
import { Text, TextInput, View } from 'react-native';

export interface TextInputProperties {
  name: string;
  label?: string;
  placeholder?: string;
}

const TextInputBox = ({ name, label, placeholder }: TextInputProperties) => {
  const [text, setText] = useState('');
  return (
    <View>
      <Text className="block mb-4 text-sm font-medium text-gray-900 dark:text-white">{label}</Text>
      <TextInput
        placeholder={placeholder}
        onChangeText={newText => setText(newText)}
        defaultValue={text}
        id={name}
        className="bg-gray-50 border-0 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      />
    </View>
  );
};

export default TextInputBox;
