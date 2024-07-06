import { authTokenAtom, colorSchemeAtom } from "@/atom/user";
import {
    MultiSelectOptionBlock,
    OptionBlock,
} from "@/components/common/option-block";
import { useRouter } from "expo-router";
import { atom, useSetAtom } from "jotai";
import { ReactElement, ReactNode } from "react";
import { Pressable, SectionList, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather, MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";

type ActionComponentFunction = (
    name: string,
    isFirst?: boolean,
    isLast?: boolean,
) => ReactElement;

interface ISettingsActions {
    name: string;
    component: ActionComponentFunction;
}

interface ISettingsSection {
    title: string;
    data: ISettingsActions[];
}

const settingsList: ISettingsSection[] = [
    {
        title: "",
        data: [
            {
                name: "Dark",
                component: (name, isFirst, isLast) => {
                    return (
                        <MultiSelectOptionBlock
                            text={name}
                            atom={colorSchemeAtom}
                            icon={
                                <Feather name="moon" size={18} color="gray" />
                            }
                            isFirst={isFirst}
                            isLast={isLast}
                        />
                    );
                },
            },
            {
                name: "Light",
                component: (name, isFirst, isLast) => {
                    return (
                        <MultiSelectOptionBlock
                            text={name}
                            atom={colorSchemeAtom}
                            icon={
                                <Feather name="moon" size={18} color="gray" />
                            }
                            isFirst={isFirst}
                            isLast={isLast}
                        />
                    );
                },
            },
            {
                name: "Auto",
                component: (name, isFirst, isLast) => {
                    return (
                        <MultiSelectOptionBlock
                            text={name}
                            atom={colorSchemeAtom}
                            icon={
                                <Feather name="moon" size={18} color="gray" />
                            }
                            isFirst={isFirst}
                            isLast={isLast}
                        />
                    );
                },
            },
        ],
    },
];

export default function Theme() {
    const setAuthAtom = useSetAtom(authTokenAtom);
    const router = useRouter();

    return (
        <View className="flex flex-1 justify-between mx-4 mt-4">
            <SectionList
                sections={settingsList}
                renderItem={({ item, index, section }) =>
                    item.component(
                        item.name,
                        index == 0,
                        index == section.data.length - 1,
                    )
                }
                keyExtractor={(item) => `settings-${item.name}`}
                stickySectionHeadersEnabled={false}
            />
        </View>
    );
}
