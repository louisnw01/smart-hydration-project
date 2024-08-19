import WifiManager from "react-native-wifi-reborn"
import { router } from "expo-router"


export function connectToWifi(jugId: number) {
    WifiManager.connectToProtectedSSID(
        `SmartHydration: ${jugId}`,
        null,
        false,
        false
    ).then(
        () => {
            router.replace("wifisetup/connect");
        },
        () => {
            alert(
                "Connection to the jug failed; ensure the jug is in pairing mode and try again.",
            );
        },
    );
};

export async function getWifiName() {
    const res  = await WifiManager.getCurrentWifiSSID();
    return res;
}