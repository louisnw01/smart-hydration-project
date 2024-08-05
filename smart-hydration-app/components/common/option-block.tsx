import colors from "@/colors";
import { Entypo } from "@expo/vector-icons";
import { WritableAtom, useAtom, useAtomValue, useSetAtom } from "jotai";
import { Pressable, Switch, Text, View } from "react-native";

interface OptionBlockProps {
    text?: string;
    href?: string;
    isFirst?: boolean;
    isLast?: boolean;
    multiSelect?: boolean;
    icon?: React.ReactNode;
    onPress?: Function;
}

interface MultiSelectProps extends OptionBlockProps {
    atom: WritableAtom<unknown, [unknown], void>;
}

export function MultiSelectOptionBlock({
    text,
    atom,
    onPress,
    icon,
    isFirst,
    isLast,
}: MultiSelectProps) {
    const setValue = useSetAtom(atom);
    return (
        <OptionBlock
            multiSelect
            text={text}
            icon={icon}
            atom={atom}
            onPress={() => {
                setValue(text);
                if (onPress) onPress();
            }}
            isFirst={isFirst}
            isLast={isLast}
        />
    );
}

interface SingleOptionBlockProps extends OptionBlockProps {
    atom?: WritableAtom<unknown, [unknown], void>;
}
export function OptionBlock({
    text,
    atom,
    onPress,
    icon,
    multiSelect,
    isFirst,
    isLast,
}: SingleOptionBlockProps) {
    let className = isLast
        ? "rounded-b-xl"
        : "border-b border-gray-200 dark:border-neutral-800";
    className += isFirst ? " rounded-t-xl" : "";
    return (
        <Pressable
            className={`flex-row items-center justify-between h-14 bg-gray-100 px-4 dark:bg-neutral-900 ${className}`}
            onPress={() => {
                if (onPress) onPress();
            }}
        >
            <View className="flex flex-row items-center gap-3">
                {icon}
                <Text className="text-xl dark:text-white">{text}</Text>
            </View>
            {atom ? (
                multiSelect ? (
                    <MultiSelectSwitch atom={atom} name={text} />
                ) : (
                    <SettingsSwitch atom={atom} />
                )
            ) : (
                <Entypo name="chevron-right" size={18} color="gray" />
            )}
        </Pressable>
    );
}

function SettingsSwitch({
    atom,
}: {
    atom: WritableAtom<unknown, [unknown], void>;
}) {
    const [toggled, setToggled] = useAtom(atom);
    return (
        <Switch
            trackColor={{ false: "gray", true: colors.blue }}
            onValueChange={() => setToggled(!toggled)}
            value={toggled as boolean}
        />
    );
}

function MultiSelectSwitch({
    atom,
    name,
}: {
    atom: WritableAtom<unknown, [unknown], void>;
    name: string | undefined;
}) {
    const selectedValue = useAtomValue(atom);
    const isSelected = selectedValue == name;
    return (
        <View>
            <View
                className={`w-5 h-5 rounded-xl ${isSelected ? "bg-blue" : "border border-gray-300"}`}
            />
        </View>
    );
}
