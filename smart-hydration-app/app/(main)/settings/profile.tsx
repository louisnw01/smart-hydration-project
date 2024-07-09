import { authTokenAtom, colorSchemeAtom } from "@/atom/user";
import { OptionBlock } from "@/components/common/option-block";
import { useRouter } from "expo-router";
import { useSetAtom } from "jotai";
import { ReactElement, ReactNode } from "react";
import { Pressable, SectionList, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather, MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { ISettingsSection } from "@/interfaces/settings";

const settingsList: ISettingsSection[] = [
    {
        title: "",
        data: [
            {
                name: "Change email",
                component: (name, isFirst, isLast) => {
                    const router = useRouter();
                    return (
                        <OptionBlock
                            isLast={isLast}
                            isFirst={isFirst}
                            text={name}
                            // onPress={() => router.navigate("add-device-modal")}
                            icon={
                                <Feather name="user" size={18} color="gray" />
                            }
                        />
                    );
                },
            },
            {
                name: "Change password",
                component: (name, isFirst, isLast) => {
                    const router = useRouter();
                    return (
                        <OptionBlock
                            isLast={isLast}
                            isFirst={isFirst}
                            text={name}
                            // onPress={() => router.navigate("add-device-modal")}
                            icon={
                                <Feather name="user" size={18} color="gray" />
                            }
                        />
                    );
                },
            },
        ],
    },
];

export default function SettingsModal() {
    const insets = useSafeAreaInsets();
    const setAuthAtom = useSetAtom(authTokenAtom);
    const router = useRouter();

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
                keyExtractor={(item) => `settings-${item.name}`}
                stickySectionHeadersEnabled={false}
            />

            {/* <View className="gap-5">
                <OptionBlock text="Dark Mode" atom={colorSchemeAtom} />
            </View> */}
            <View className="gap-5">
                <View className="w-full h-[1px] bg-gray-300 dark:bg-neutral-800" />
                <Pressable
                    className="items-center bg-red rounded-xl px-7 py-3"
                    onPress={() => {
                        setAuthAtom("");
                        router.replace("onboarding/login-register");
                    }}
                >
                    <Text className="text-xl mt-1 text-white">Log Out</Text>
                </Pressable>
            </View>
        </View>
    );
}
