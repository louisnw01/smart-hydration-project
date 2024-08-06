import { changeUserModeMAtom } from "@/atom/query";
import { authTokenAtom, userModeAtom } from "@/atom/user";
import { MultiSelectOptionBlock } from "@/components/common/option-block";
import { ISettingsSection } from "@/interfaces/settings";
import { FontAwesome6, Fontisto, Ionicons } from "@expo/vector-icons";
import { useAtomValue } from "jotai";
import { SectionList, View } from "react-native";

const settingsList: ISettingsSection[] = [
    {
        title: "",
        data: [
            {
                name: "Standard",
                Component: (name, isFirst, isLast) => {
                    const { mutate } = useAtomValue(changeUserModeMAtom);
                    return (
                        <MultiSelectOptionBlock
                            text={name}
                            atom={userModeAtom}
                            icon={
                                <Ionicons
                                    name="water-outline"
                                    size={18}
                                    color="gray"
                                />
                            }
                            isFirst={isFirst}
                            isLast={isLast}
                            onPress={() => {
                                !!authTokenAtom && mutate();
                            }}
                        />
                    );
                },
            },
            {
                name: "Accessible",
                Component: (name, isFirst, isLast) => {
                    const { mutate } = useAtomValue(changeUserModeMAtom);
                    return (
                        <MultiSelectOptionBlock
                            text={name}
                            atom={userModeAtom}
                            icon={
                                <FontAwesome6
                                    name="universal-access"
                                    size={18}
                                    color="gray"
                                />
                            }
                            isFirst={isFirst}
                            isLast={isLast}
                            onPress={() => {
                                !!authTokenAtom && mutate();
                            }}
                        />
                    );
                },
            },
            {
                name: "Carer",
                Component: (name, isFirst, isLast) => {
                    const { mutate } = useAtomValue(changeUserModeMAtom);
                    return (
                        <MultiSelectOptionBlock
                            text={name}
                            atom={userModeAtom}
                            icon={
                                <Fontisto
                                    name="heartbeat"
                                    size={18}
                                    color="gray"
                                />
                            }
                            isFirst={isFirst}
                            isLast={isLast}
                            onPress={() => {
                                !!authTokenAtom && mutate();
                            }}
                        />
                    );
                },
            },
        ],
    },
];

export default function Mode() {
    return (
        <View className="flex flex-1 justify-between mx-4 mt-4">
            <SectionList
                sections={settingsList}
                renderItem={({ item, index, section }) =>
                    item.Component(
                        item.name || "",
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
