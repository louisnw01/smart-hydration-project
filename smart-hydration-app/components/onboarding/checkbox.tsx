import { useState } from 'react';
import { View, Pressable } from 'react-native';

const Checkbox = () => {
    const [checked, setChecked] = useState(false);
    const handleCheckboxChange = () => {
        setChecked((prevChecked) => !prevChecked);
    };

    return (
        <View>
            <Pressable className="w-4 h-4 bg-gray-300 border border-gray-500 mr-2" onPress={handleCheckboxChange}>
                {checked === true && <View className="h-3 w-3 bg-black" />}
            </Pressable>
        </View>
    );
};

export default Checkbox;





