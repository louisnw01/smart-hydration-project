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
import { Ionicons, FontAwesome6, Fontisto } from "@expo/vector-icons";
import { ISettingsSection } from "@/interfaces/settings";

const tempAtom = atom("");

const settingsList: ISettingsSection[] = [
    {
        title: "",
        data: [
            {
                name: "Standard",
                component: (name, isFirst, isLast) => {
                    return (
                        <MultiSelectOptionBlock
                            text={name}
                            atom={tempAtom}
                            icon={
                                <Ionicons
                                    name="water-outline"
                                    size={18}
                                    color="gray"
                                />
                            }
                            isFirst={isFirst}
                            isLast={isLast}
                        />
                    );
                },
            },
            {
                name: "Accessible",
                component: (name, isFirst, isLast) => {
                    return (
                        <MultiSelectOptionBlock
                            text={name}
                            atom={tempAtom}
                            icon={
                                <FontAwesome6
                                    name="universal-access"
                                    size={18}
                                    color="gray"
                                />
                            }
                            isFirst={isFirst}
                            isLast={isLast}
                        />
                    );
                },
            },
            {
                name: "Carer",
                component: (name, isFirst, isLast) => {
                    return (
                        <MultiSelectOptionBlock
                            text={name}
                            atom={tempAtom}
                            icon={
                                <Fontisto
                                    name="heartbeat"
                                    size={18}
                                    color="gray"
                                />
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
