import {
    authTokenAtom,
    colorSchemeAtom,
    userNameAtom,
    drinkListAtom,
} from "@/atom/user";
import { OptionBlock } from "@/components/common/option-block";
import { useRouter } from "expo-router";
import { useAtomValue, useSetAtom } from "jotai";
import { ReactElement, ReactNode, useEffect } from "react";
import { Pressable, SectionList, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather, MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { deleteUser } from "@/atom/query";
import { ISettingsSection } from "@/interfaces/settings";
import { amountDrankTodayAtom } from "@/atom/hydration";

const settingsList: ISettingsSection[] = [
    {
        title: "Account",
        data: [
            {
                name: "Profile",
                component: (name, isFirst, isLast) => {
                    const router = useRouter();
                    return (
                        <OptionBlock
                            isLast={isLast}
                            text={name}
                            onPress={() => router.navigate("settings/profile")}
                            icon={
                                <Feather name="user" size={18} color="gray" />
                            }
                        />
                    );
                },
            },
            {
                name: "User Mode",
                component: (name, isFirst, isLast) => {
                    const router = useRouter();
                    return (
                        <OptionBlock
                            isLast={isLast}
                            text={name}
                            onPress={() => router.navigate("settings/mode")}
                            icon={
                                <MaterialCommunityIcons
                                    name="cards-playing-heart-multiple-outline"
                                    size={16}
                                    color="gray"
                                />
                            }
                        />
                    );
                },
            },
        ],
    },
    {
        title: "Data",
        data: [
            {
                name: "Other Drinks",
                component: (name, isFirst, isLast) => {
                    const router = useRouter();
                    return (
                        <OptionBlock
                            isLast={isLast}
                            text={name}
                            onPress={() => router.navigate("settings/theme")}
                            icon={
                                <MaterialCommunityIcons
                                    name="cup-water"
                                    size={19}
                                    color="gray"
                                />
                            }
                        />
                    );
                },
            },
        ],
    },
    {
        title: "Appearance",
        data: [
            {
                name: "Theme",
                component: (name, isFirst, isLast) => {
                    const router = useRouter();
                    return (
                        <OptionBlock
                            isLast={isLast}
                            text={name}
                            onPress={() => router.navigate("settings/theme")}
                            icon={
                                <Ionicons
                                    name="color-palette"
                                    size={19}
                                    color="gray"
                                />
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
    const setUserNameAtom = useSetAtom(userNameAtom);
    const setAmounDrankTodayAtom = useSetAtom(amountDrankTodayAtom);
    const setDrinksList = useSetAtom(drinkListAtom);
    const router = useRouter();
    //const { mutate: submitDeleteUser, isPending, isSuccess, isError } = useAtomValue(deleteUser);
    //useEffect(() => {
      {/*if (isSuccess) {
        router.replace("onboarding/login-register");
      }
    }, [isSuccess]);

    useEffect(() => {
      if (isError) {

        //router.navigate("settings/theme");
       console.error('error')
      }
    }, [isError]);
  */}
    return (
        <View
            className="flex flex-1 justify-between mx-4"
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
                renderSectionHeader={({ section }) => (
                    <View className="bg-gray-100 dark:bg-neutral-900 py-4 px-4 rounded-t-xl mt-6">
                        <Text className="font-bold dark:text-white">
                            {section.title}
                        </Text>
                    </View>
                )}
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
                        setUserNameAtom("");
                        setAmounDrankTodayAtom(0);
                        setDrinksList([]);
                        router.replace("onboarding/login-register");
                    }}
                >
                    <Text className="text-xl mt-1 text-white">Log Out</Text>
                </Pressable>
                {/*
                <Pressable
                    className="items-center bg-blue rounded-xl px-7 py-3"
                    disabled={isPending}
                    onPress={() => {
                        submitDeleteUser();
                    }}
                >
                    <Text className="text-xl mt-1 text-white">{isPending ? 'Deleting account...' : 'Delete Account'}</Text>
                </Pressable>
                  */}
            </View>
        </View>
    );
}
