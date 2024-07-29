import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Loading from "./loading";

export default function PageWrapper({
    children,
    isLoading,
    message,
    className,
}: {
    children: JSX.Element | JSX.Element[];
    isLoading?: boolean;
    message?: string;
}) {
    const insets = useSafeAreaInsets();
    if (isLoading) return <Loading isLoading message={message} />;
    return (
        <View
            className="flex flex-1 dark:bg-black"
            style={{
                paddingTop: insets.top + 30,
            }}
        >
            {children}
        </View>
    );
}
