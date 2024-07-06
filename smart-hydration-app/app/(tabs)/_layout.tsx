import PageHeader from "@/components/common/header";
import useColorPalette from "@/util/palette";
import {
    Entypo,
    FontAwesome,
    Foundation,
    MaterialIcons,
} from "@expo/vector-icons";
import { Link, Tabs } from "expo-router";

export default function TabLayout() {
    const palette = useColorPalette();
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
                            <Entypo name="cog" size={30} color={palette.fg} />
                        </Link>
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
                        <Link className="px-5" href="add-device-modal">
                            <Entypo
                                name="circle-with-plus"
                                size={24}
                                color="black"
                            />
                        </Link>
                    ),
                }}
            />
        </Tabs>
    );
}
