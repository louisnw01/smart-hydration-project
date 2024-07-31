import { KeyboardAvoidingView, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function KeyboardScrollView({
    children,
    keyboardVerticalOffset,
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
                    paddingBottom: insets.bottom + 20,
                }}
            >
                {children}
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
