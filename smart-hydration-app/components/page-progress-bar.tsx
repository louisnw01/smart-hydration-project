import React from 'react';
import { Text, View } from 'react-native';

export interface PageProgressProperties {
    currentPage: number;
    totalPages: number;
}

//To do: make this a visual progress bar 

const PageProgressBar = ({ currentPage, totalPages }: PageProgressProperties) => {
    return (
        <View className="flex items-center">
            <Text className="text-sm font-medium text-gray-900 dark:text-white">Page {currentPage}/{totalPages}</Text>
        </View>
    );
};

export default PageProgressBar;
