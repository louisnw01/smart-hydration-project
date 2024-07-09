import colors from "@/colors";
import { WritableAtom, useAtom, useAtomValue, useSetAtom } from "jotai";
import { Switch, View, Text, Pressable } from "react-native";
import { Entypo } from "@expo/vector-icons";

interface OptionBlockProps {
    text: string;
    atom: WritableAtom<unknown, [unknown], void>;
    href: string;
}

export function MultiSelectOptionBlock({ text, atom, icon, isFirst, isLast }) {
    const setValue = useSetAtom(atom);
    return (
        <OptionBlock
            multiSelect
            text={text}
            icon={icon}
            atom={atom}
            onPress={() => {
                setValue(text);
            }}
            isFirst={isFirst}
            isLast={isLast}
        />
    );
}

export function OptionBlock({
    text,
    atom,
    onPress,
    icon,
    multiSelect,
    isFirst,
    isLast,
}: OptionBlockProps) {
    let className = isLast
        ? "rounded-b-xl"
        : "border-b border-gray-200 dark:border-neutral-800";
    className += isFirst ? " rounded-t-xl" : "";
    return (
        <Pressable
            className={`flex-row items-center justify-between h-14 bg-gray-100 px-4 dark:bg-neutral-900 ${className}`}
            onPress={onPress}
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

function SettingsSwitch({ atom }) {
    const [toggled, setToggled] = useAtom(atom);
    return (
        <Switch
            trackColor={{ false: "gray", true: colors.blue }}
            onValueChange={() => setToggled(!toggled)}
            value={toggled as boolean}
        />
    );
}

function MultiSelectSwitch({ atom, name }) {
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
