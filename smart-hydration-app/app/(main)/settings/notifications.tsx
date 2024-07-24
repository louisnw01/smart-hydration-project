import { notificationFrequencyAtom, notificationsAtom } from "@/atom/user";
import { MultiSelectOptionBlock } from "@/components/common/option-block";
import { Feather } from "@expo/vector-icons";
import { ISettingsActions, ISettingsSection } from "@/interfaces/settings";
import { SectionList, View, Text, SectionListData } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const settingsList: ISettingsSection[] = [
    {
        title: "",
        data: [
            {
                name: "On",
                component: (name, isFirst, isLast) => {
                    return (
                        <MultiSelectOptionBlock
                            text={name}
                            atom={notificationsAtom}
                            icon={<Feather name="bell" size={18} color="gray" />}
                            isFirst={isFirst}
                            isLast={isLast}
                        />
                    );
                },
            },
            {
                name: "Off",
                component: (name, isFirst, isLast) => {
                    return (
                        <MultiSelectOptionBlock
                            text={name}
                            atom={notificationsAtom}
                            icon={
                                <Feather name="bell-off" size={18} color="gray" />
                            }
                            isFirst={isFirst}
                            isLast={isLast}
                        />
                    );
                },
            },
        ],
    },
    {
        title: "Frequency",
        data: [
            {
                name: "1 hour",
                component: (name, isFirst, isLast) => {
                    return (
                        <MultiSelectOptionBlock
                            text={name}
                            atom={notificationFrequencyAtom}
                            icon={null}
                            isFirst={isFirst}
                            isLast={isLast}
                        />
                    );
                },
            },
            {
                name: "3 hours",
                component: (name, isFirst, isLast) => {
                    return (
                        <MultiSelectOptionBlock
                            text={name}
                            atom={notificationFrequencyAtom}
                            icon={null}
                            isFirst={isFirst}
                            isLast={isLast}
                        />
                    );
                },
            },
            {
                name: "6 hours",
                component: (name, isFirst, isLast) => {
                    return (
                        <MultiSelectOptionBlock
                            text={name}
                            atom={notificationFrequencyAtom}
                            icon={null}
                            isFirst={isFirst}
                            isLast={isLast}
                        />
                    );
                },
            },
            {
                name: "12 hours",
                component: (name, isFirst, isLast) => {
                    return (
                        <MultiSelectOptionBlock
                            text={name}
                            atom={notificationFrequencyAtom}
                            icon={null}
                            isFirst={isFirst}
                            isLast={isLast}
                        />
                    );
                },
            },
        ],
    },
];

const shouldRenderHeader = (section: SectionListData<ISettingsActions, ISettingsSection>) => {
    // Condition to render section headers
    // For example, don't render headers for empty sections
    return section.title;
  };

export default function Notifications() {
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
                    item.component(
                        item.name,
                        index == 0,
                        index == section.data.length - 1,
                    )
                }
                renderSectionHeader={({ section }) => 
                    shouldRenderHeader(section) && (
                    <View className="bg-gray-100 dark:bg-neutral-900 py-4 px-4 rounded-t-xl mt-6">
                        <Text className="font-bold dark:text-white">
                            {section.title}
                        </Text>
                    </View>
                )}
                keyExtractor={(item) => `settings-${item.name}`}
                stickySectionHeadersEnabled={false}
            />
        </View>
    );
}
