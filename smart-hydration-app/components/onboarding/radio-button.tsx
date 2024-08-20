import React, { useState } from 'react';
import { View, Pressable, Text } from 'react-native';

export interface RadioInputProperties {
    options: string[];
    defaultString: string;
    onChange?: (val: string) => void;
}

const RadioButton = ({ options, defaultString, onChange }: RadioInputProperties) => {
    const [selectedValue, setSelectedValue] = useState(defaultString);

    const handleOnSelect = (val: string): void => {
      setSelectedValue(val)
      onChange && onChange(val)
    }

    return (
        <View>
            {options.map((option, index) => (
                <View key={index} className="flex-row my-1">
                    <Pressable className="h-5 w-5 mx-1 rounded-full bg-gray-300 border border-gray-500 items-center justify-center" onPress={() => handleOnSelect(option)}>
                        {selectedValue === option && <View className="h-4 w-4 rounded-full border bg-black" />}
                    </Pressable>
                    <Text className="text-l font-light">{option}</Text>
                </View>
            ))}
        </View>
    );
};

export default RadioButton;
