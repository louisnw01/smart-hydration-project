import { authTokenAtom, userModeAtom } from "@/atom/user";
import {
    MultiSelectOptionBlock,
} from "@/components/common/option-block";
import { SectionList, View } from "react-native";
import { Ionicons, FontAwesome6, Fontisto } from "@expo/vector-icons";
import { ISettingsSection } from "@/interfaces/settings";
import { useAtomValue, useSetAtom } from "jotai";
import { changeUserModeMAtom } from "@/atom/query/user";

const settingsList: ISettingsSection[] = [
    {
        title: "",
        data: [
            {
                name: "Standard",
                component: (name, isFirst, isLast) => {
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
                            onPress={ ()=> {!!authTokenAtom && mutate()}}
                        />
                    );
                },
            },
            {
                name: "Accessible",
                component: (name, isFirst, isLast) => {
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
                            onPress={ ()=> {!!authTokenAtom && mutate()}}
                        />
                    );
                },
            },
            {
                name: "Carer",
                component: (name, isFirst, isLast) => {
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
                            onPress={ ()=> {!!authTokenAtom && mutate()}}
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
