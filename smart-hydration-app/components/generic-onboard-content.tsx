import { Text, View } from "react-native";

interface PageContent {
  title: string;
  children: JSX.Element | JSX.Element[];
}

export default function GenericOnboardContent({ children, title }: PageContent) {
  return (
      <View className="flex mt-7 justify-center h-full gap-12">
        <View className="flex flex-row justify-center">
          <Text className="text-2xl font-light text-gray-500 dark:text-gray-400">{title}</Text>
        </View>
        {children}
      </View>
  );
}
