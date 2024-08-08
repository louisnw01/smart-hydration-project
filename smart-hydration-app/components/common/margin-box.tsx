import { View, ViewProps } from "react-native";

export default function MarginBox(props: ViewProps) {
    let finalViewClass = "mx-6";
    if (props.className) {
        finalViewClass = props.className;
    } else if (props.className) {
        finalViewClass += " " + props.className;
    } else {
    }
    return <View {...props} className={finalViewClass}></View>;
}
