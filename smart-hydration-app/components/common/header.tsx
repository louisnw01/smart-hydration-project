import { Text } from "react-native";

export default function PageHeader({ children }: { children: string }) {
    return (
        <Text className="font-semibold text-3xl ml-1 dark:text-white">
            {children === "Home" ? "Smart Hydration" : children}
        </Text>
    );
}
