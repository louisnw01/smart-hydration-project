import { unitsAtom } from "@/atom/user";
import { MultiSelectOptionBlock } from "@/components/common/option-block";
import { ISettingsSection } from "@/interfaces/settings";
import { SectionList, Text, View } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';


const settingsList: ISettingsSection[] = [
    {
        title: "Choose your preferred units of measurement",
        data: [
            {
                name: "ml",
                Component: (name) => {
                    return (
                        <MultiSelectOptionBlock
                            text={name}
                            atom={unitsAtom}
                            multiSelect={false}
                        />
                    );
                },
            },
            {
                name: "oz",
                Component: (name, isFirst, isLast) => {
                    return (
                        <MultiSelectOptionBlock
                            text={name}
                            atom={unitsAtom}
                            isFirst={isFirst}
                            isLast={isLast}
                            multiSelect={false}
                        />
                    );
                },
            },
        ],
    },
]

export default function Units() {
    const insets = useSafeAreaInsets();
    return (
        <View
            className="flex flex-1 justify-between mx-4 mt-4"
            style={{
                paddingBottom: insets.bottom + 20,
            }}
        >
            <SectionList
                sections={settingsList}
                renderItem={({ item, index, section }) =>
                    item.Component(
                        item.name ?? "",
                        index == 0,
                        index == section.data.length - 1,
                    )
                }
                renderSectionHeader={({ section }) =>
                    <View className="bg-gray-100 dark:bg-neutral-900 py-4 px-4 rounded-t-xl mt-6">
                        <Text className="font-bold dark:text-white">
                            {section.title}
                        </Text>
                    </View>
                }
                keyExtractor={(item) => `settings-${item.name}`}
                stickySectionHeadersEnabled={false}
            />
        </View>
    );
}
