import { Text, View } from "react-native";

interface PageContent {
  title: string;
  children: JSX.Element | JSX.Element[];
}

export default function GenericOnboardContent({ children, title }: PageContent) {
  return (
      <View className="flex justify-center h-full gap-12">
        <View className="flex flex-row justify-center">
          <Text className="text-xl font-semibold">{title}</Text>
        </View>
        {children}
      </View>
  );
}
