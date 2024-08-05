import colors from "@/colors";
import { WritableAtom, useAtom, useAtomValue, useSetAtom } from "jotai";
import { Switch, View, Text, Pressable, GestureResponderEvent } from "react-native";
import { Entypo } from "@expo/vector-icons";

interface SettingsSwitchProps {
    atom: WritableAtom<unknown, [unknown], void>;
    label: string;
    icon?: React.ReactNode;
}

interface OptionBlockProps {
    text?: string;
    atom?: WritableAtom<unknown, [unknown], void>;
    href?: string;
    isFirst?: boolean;
    isLast?: boolean;
    multiSelect?: boolean;
    icon?: React.ReactNode;
    onPress?: (event: GestureResponderEvent) => void;
}

export function MultiSelectOptionBlock({ text, atom, onPress, icon, isFirst, isLast }:OptionBlockProps) {
    const setValue = useSetAtom(atom);
    return (
        <OptionBlock
            multiSelect
            text={text}
            icon={icon}
            atom={atom}
            onPress={() => {
                setValue(text);
                if(onPress) onPress();
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
            onPress={()=>{if(onPress) onPress();}}
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

export function SettingsSwitch({ atom, label, icon }:SettingsSwitchProps) {
    const [toggled, setToggled] = useAtom(atom);
    return (
        <View className="mt-4 flex-row items-center justify-between h-14 bg-gray-100 px-4 dark:bg-neutral-900 rounded-b-xl rounded-t-xl">
            <View className="flex flex-row items-center gap-3">
                {icon}
                <Text className="text-xl dark:text-white">{label}</Text>
            </View>
            <Switch
                trackColor={{ false: "gray", true: colors.blue }}
                onValueChange={() => setToggled(!toggled)}
                value={toggled as boolean}
            />
        </View>
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
