import { router } from "expo-router";
import { Alert } from "react-native";
import WifiManager from "react-native-wifi-reborn";

export function connectToWifi(jugId: number, setLoading) {
    setLoading(true);
    WifiManager.connectToProtectedSSID(
        `SmartHydration: ${jugId}`,
        null,
        false,
        false,
    ).then(
        () => {
            router.replace("wifisetup/connect");
            setLoading(false);
        },
        () => {
            setLoading(false);
            Alert.alert(
                "Connection failed",
                "Ensure the jug is in pairing mode and try again.",
            );
        },
    );
}

export async function getWifiName() {
    const res = await WifiManager.getCurrentWifiSSID();
    return res;
}
