import React, { useState } from 'react';
import { Text, View, Pressable } from 'react-native';

export interface CheckboxProperties {
    text: string;
}

const Checkbox = ({ text }: CheckboxProperties) => {
    const [checked, setChecked] = React.useState(false);
    const handleCheckboxChange = () => {
        setChecked((prevChecked) => !prevChecked);
    };

    return (
        <View className="flex-row my-4 items-center justify-center">
            <Pressable className="w-4 h-4 bg-gray-300 border border-gray-500 items-center justify-center" onPress={handleCheckboxChange}>
                {checked === true && <View className="h-3 w-3 bg-black" />}
            </Pressable>
            <Text className="mx-2 text-lg">{text}</Text>
        </View>
    );
};

export default Checkbox;





