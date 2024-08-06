import { deleteUserMAtom } from "@/atom/query";
import { OptionBlock } from "@/components/common/option-block";
import { ISettingsSection } from "@/interfaces/settings";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAtomValue } from "jotai";
import { useEffect } from "react";
import { Pressable, SectionList, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const settingsList: ISettingsSection[] = [
    {
        title: "",
        data: [
            {
                name: "Change email",
                Component: (name, isFirst, isLast) => {
                    return (
                        <OptionBlock
                            isLast={isLast}
                            isFirst={isFirst}
                            text={name}
                            // onPress={() => router.navigate("add-device-modal")}
                            icon={
                                <Feather name="inbox" size={18} color="gray" />
                            }
                        />
                    );
                },
            },
            {
                name: "Change password",
                Component: (name, isFirst, isLast) => {
                    return (
                        <OptionBlock
                            isLast={isLast}
                            isFirst={isFirst}
                            text={name}
                            // onPress={() => router.navigate("add-device-modal")}
                            icon={
                                <Feather name="key" size={18} color="gray" />
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
    const router = useRouter();
    const {
        mutate: submitDeleteUser,
        isPending,
        isSuccess,
        isError,
    } = useAtomValue(deleteUserMAtom);

    useEffect(() => {
        if (isSuccess) {
            router.replace("onboarding/login-register");
        }
    }, [isSuccess]);

    useEffect(() => {
        if (isError) {
            //router.navigate("settings/theme");
            console.error("error");
        }
    }, [isError]);

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
                        item.name || "",
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
                {/*<Pressable
                    className="items-center bg-red rounded-xl px-7 py-3"
                    onPress={() => {
                        setAuthAtom("");
                        router.replace("onboarding/login-register");
                    }}
                >
                    {/*<Text className="text-xl mt-1 text-white">Delete Account</Text>
                  </Pressable>*/}
                <Pressable
                    className="items-center bg-red rounded-xl px-7 py-3"
                    disabled={isPending}
                    onPress={() => {
                        submitDeleteUser();
                    }}
                >
                    <Text className="text-xl mt-1 text-white">
                        {isPending ? "Deleting account..." : "Delete Account"}
                    </Text>
                </Pressable>
            </View>
        </View>
    );
}
