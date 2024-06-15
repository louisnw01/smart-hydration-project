import { Text, View } from "react-native";

interface PageContent {
  title: string;
  content: React.ReactNode;
}

export default function GenericOnboardContent({ title, content }: PageContent) {
  return (
      <View>
        <Text>{title}</Text>
        {content}
      </View>
  );
}
