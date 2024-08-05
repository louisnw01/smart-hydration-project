import { ReactNode } from "react";
import { KeyboardAvoidingView, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function KeyboardScrollView({
    children,
    keyboardVerticalOffset,
}: {
    children: ReactNode;
    keyboardVerticalOffset: number;
}) {
    const insets = useSafeAreaInsets();
    return (
        <KeyboardAvoidingView
            behavior="position"
            className="flex-1"
            keyboardVerticalOffset={keyboardVerticalOffset}
        >
            <ScrollView
                contentContainerClassName="flex h-full justify-end"
                style={{
                    paddingBottom: insets.bottom + 80,
                }}
            >
                {children}
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
