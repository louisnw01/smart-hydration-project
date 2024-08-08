import useSettings from "@/app/hooks/user";
import SHDrop from "@/assets/svgs/SH_Drop.svg";
import { userHasCommunityAtom } from "@/atom/query";
import { communityTabVisible } from "@/atom/user";
import PageHeader from "@/components/common/header";
import useColorPalette from "@/util/palette";
import {
    Entypo,
    FontAwesome6,
    Foundation,
    MaterialIcons,
} from "@expo/vector-icons";

import { Link, router, Tabs } from "expo-router";
import { useAtomValue } from "jotai";
import { Pressable, Text } from "react-native";

export default function TabLayout() {
    const palette = useColorPalette();
    const { isCarer } = useSettings();
    const isCommunityTabVisible = useAtomValue(communityTabVisible);
    const hasCommunity = useAtomValue(userHasCommunityAtom);
    return (
        <Tabs
            screenOptions={{
                headerTitleAlign: "left",
                headerTitle: (props) => <PageHeader {...props} />,
                headerStyle: {
                    backgroundColor: palette.bg,
                    shadowColor: palette.border,
                },
                tabBarStyle: {
                    backgroundColor: palette.bg,
                    borderTopWidth: 0,
                },
                tabBarActiveTintColor: palette.fg,
                tabBarInactiveTintColor: "rgb(145, 145, 145)",
            }}
            sceneContainerStyle={{
                backgroundColor: palette.bg,
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Home",
                    href: isCarer ? null : undefined,
                    tabBarIcon: ({ color }) => (
                        <SHDrop
                            width={180}
                            height={180}
                            right={12}
                            bottom={9}
                            fill={color}
                        />
                    ),
                    headerRight: () => (
                        <Pressable
                            className="px-5"
                            onPress={() =>
                                router.push("settings/settings-modal")
                            }
                        >
                            <Entypo name="cog" size={30} color={palette.fg} />
                        </Pressable>
                    ),
                }}
            />
            <Tabs.Screen
                name="community"
                options={{
                    title: "Community",
                    href: !isCarer && !isCommunityTabVisible ? null : undefined,
                    tabBarIcon: ({ color }) => (
                        <FontAwesome6
                            name="people-group"
                            size={24}
                            color={color}
                        />
                    ),
                    headerRight: () => (
                        <>
                            {!isCarer && hasCommunity && (
                                <Link className="px-5" href="manage-community">
                                    <Text className="text-xl font-semibold">
                                        Manage
                                    </Text>
                                </Link>
                            )}
                            {isCarer && (
                                <Pressable
                                    className="px-5"
                                    onPress={() =>
                                        router.push("settings/settings-modal")
                                    }
                                >
                                    <Entypo
                                        name="cog"
                                        size={30}
                                        color={palette.fg}
                                    />
                                </Pressable>
                            )}
                        </>
                    ),
                }}
            />
            <Tabs.Screen
                name="trends"
                options={{
                    title: "Trends",
                    tabBarIcon: ({ color }) => (
                        <Foundation size={28} name="graph-bar" color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="devices"
                options={{
                    title: "Devices",
                    tabBarIcon: ({ color }) => (
                        <MaterialIcons
                            size={28}
                            name="device-hub"
                            color={color}
                        />
                    ),
                    headerRight: () => (
                        <Pressable
                            className="px-5"
                            onPress={() => router.push("add-device-modal")}
                        >
                            <Entypo
                                name="circle-with-plus"
                                size={26}
                                color={palette.fg}
                            />
                        </Pressable>
                    ),
                }}
            />
        </Tabs>
    );
}
