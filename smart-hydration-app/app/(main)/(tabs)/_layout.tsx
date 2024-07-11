import { hydrationInsightsEAtom } from "@/atom/effect/hydration";
import PageHeader from "@/components/common/header";
import { useWaterLevel } from "@/components/home/water-screen";
import useColorPalette from "@/util/palette";
import {
    Entypo,
    FontAwesome,
    Foundation,
    MaterialIcons,
} from "@expo/vector-icons";
import { Link, Tabs } from "expo-router";
import { useAtomValue } from "jotai";

export default function TabLayout() {
    const palette = useColorPalette();
    const waterLevel = useWaterLevel();
    const underWater = waterLevel && waterLevel >= 0.1;
    const cogUnderwater = waterLevel && waterLevel > 0.89;
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
                    borderTopColor: palette.border,
                },
                tabBarActiveTintColor: palette.fg,
                tabBarInactiveTintColor: underWater
                    ? "white"
                    : "rgb(145, 145, 145)",
            }}
            sceneContainerStyle={{
                backgroundColor: palette.bg,
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Home",
                    tabBarIcon: ({ color }) => (
                        <FontAwesome size={28} name="home" color={color} />
                    ),
                    headerRight: () => (
                        <Link className="px-5" href="settings/settings-modal">
                            <Entypo
                                name="cog"
                                size={30}
                                color={cogUnderwater ? "white" : palette.fg}
                            />
                        </Link>
                    ),
                    headerTransparent: true,
                    tabBarStyle: {
                        elevation: 0,
                        backgroundColor: "transparent",
                        position: "absolute",
                        borderTopWidth: 0,
                    },
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
                        <Link className="px-5" href="add-device-modal">
                            <Entypo
                                name="circle-with-plus"
                                size={26}
                                color={palette.fg}
                            />
                        </Link>
                    ),
                }}
            />
        </Tabs>
    );
}
