import { useRouter } from "expo-router";
import { ReactNode, useState } from "react";
import { Pressable, Text, PressableProps} from "react-native";

interface ButtonProps extends PressableProps {
    text: string;
    href?: string;
    textClass: string;
    buttonClass?: string;
    icon?: ReactNode;
}
export default function StyledButton(props: ButtonProps) {
    const router = useRouter();
    const [touched, setTouched] = useState(false);

    props.textClass +=
        props.textClass && !props.textClass.includes("dark:text") ? " dark:text-white" : "";

    const buttonColors = touched
        ? "bg-gray-300 dark:bg-neutral-700"
        : "bg-gray-200 dark:bg-neutral-800";

    const buttonClass = !props.buttonClass
        ? buttonColors
        : !props.buttonClass.includes("bg-")
            ? (props.buttonClass += " " + buttonColors)
            : props.buttonClass;

    const finalButtonClass =
        "flex-row gap-[3px] px-4 py-2 rounded-3xl " + buttonClass;

    return (
        <Pressable
            className={finalButtonClass}
            onPress={() =>
                props.onPress ? props.onPress : props.href ? router.navigate(props.href) : undefined
            }
            onTouchStart={() => setTouched(true)}
            onTouchEnd={() => setTouched(false)}
            {...props}
        >
            {props.icon && props.icon}
            <Text className={props.textClass}>{props.text}</Text>
        </Pressable>
    );
}
