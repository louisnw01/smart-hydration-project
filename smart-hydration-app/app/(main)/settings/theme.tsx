import { authTokenAtom, colorSchemeAtom } from "@/atom/user";
import { MultiSelectOptionBlock } from "@/components/common/option-block";
import { useRouter } from "expo-router";
import { useSetAtom } from "jotai";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { ISettingsSection } from "@/interfaces/settings";
import { SectionList, View } from "react-native";

const settingsList: ISettingsSection[] = [
    {
        title: "",
        data: [
            {
                name: "Light",
                component: (name, isFirst, isLast) => {
                    return (
                        <MultiSelectOptionBlock
                            text={name}
                            atom={colorSchemeAtom}
                            icon={<Feather name="sun" size={18} color="gray" />}
                            isFirst={isFirst}
                            isLast={isLast}
                        />
                    );
                },
            },
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
                name: "Auto",
                component: (name, isFirst, isLast) => {
                    return (
                        <MultiSelectOptionBlock
                            text={name}
                            atom={colorSchemeAtom}
                            icon={
                                <MaterialCommunityIcons
                                    name="theme-light-dark"
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
