import { ReactNode } from "react";
import { Text } from "react-native";

export default function Typography({
    children,
    className,
}: {
    children: ReactNode;
    className: string;
}) {
    let finalTextClass = "";
    if (className && className.includes("dark:text")) {
        finalTextClass = className;
    } else if (className) {
        finalTextClass = className + " dark:text-white";
    } else {
        finalTextClass = "dark:text-white";
    }
    return <Text className={finalTextClass}>{children}</Text>;
}
