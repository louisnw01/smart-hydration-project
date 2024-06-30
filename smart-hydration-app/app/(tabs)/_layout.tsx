import PageHeader from "@/components/common/header";
import {
    Entypo,
    FontAwesome,
    Foundation,
    MaterialIcons,
} from "@expo/vector-icons";
import { Link, Tabs } from "expo-router";

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: "black",
                headerTitleAlign: "left",
                headerTitle: (props) => <PageHeader {...props} />,
            }}
            sceneContainerStyle={{
                backgroundColor: "white",
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Home",
                    tabBarIcon: ({ color }) => (
                        <FontAwesome size={28} name="home" color={color} />
                    ),
                    headerRight: (props) => (
                        <Link className="px-5" href="settings-modal">
                            <Entypo name="cog" size={30} color="black" />
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
                    headerRight: (props) => (
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
