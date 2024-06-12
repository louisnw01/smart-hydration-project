import { Text, View } from "react-native";

export default function PopupPage( { children }: { children: JSX.Element | JSX.Element[] } ) {

    return (
        <View className="position absolute bottom-0 w-full left-0 h-5/6 bg-gray-200 pl-10 pt-10 gap-10 rounded-xl">
            { children }
        </View>
    );
}
