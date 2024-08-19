import { wifiPairInfoAtom } from "@/atom/wifi";
import StyledButton from "@/components/common/button";
import Typography from "@/components/common/typography";
import JugBaseDiagram from "@/components/devices/jug-base-diagram";
import { connectToWifi } from "@/components/devices/test";
import { router } from "expo-router";
import { useAtomValue } from "jotai";
import { View } from "react-native";
import WifiManager from "react-native-wifi-reborn";
import * as WifiTest from "react-native-wifi-reborn";

function NumberSection({ number, text }: { number: number; text: string }) {
    return (
        <View className="flex-row">
            <Typography className="text-3xl mr-4">{number}.</Typography>
            <Typography className="text-lg flex-1">{text}</Typography>
        </View>
    );
}

export default function PairingPage() {
    console.log(JSON.stringify(WifiTest, null, 4));
    const pairInfo = useAtomValue(wifiPairInfoAtom);
    return (
        <View className="mx-6 flex-1 justify-center mb-12">
            <Typography className="text-xl text-center font-medium">
                To start, put your jug into pairing mode
            </Typography>

            <JugBaseDiagram />

            <View className="gap-5 mt-5">
                <NumberSection
                    number={1}
                    text="Press the RESET button. This will restart the jug."
                />
                <NumberSection
                    number={2}
                    text="When the startup sequence begins (lights will begin to flash), hold the USER button
                    until there are three fast green flashes, which will be preceded by slow green flashes. This takes around
                    20-30 seconds."
                />
                <NumberSection
                    number={3}
                    text="The jug base should now light up with red, green and
                    blue."
                />
            </View>

            <StyledButton
                text="I've put my jug into pairing mode!"
                buttonClass="bg-green mt-5"
                textClass="text-center w-full text-lg font-medium text-white"
                onPress={() => {
                    // todo fix this
                    WifiManager.getBSSID().then(() => alert("got here") );

                    connectToWifi(pairInfo?.id);

                    // WifiManager.connectToProtectedSSID(
                    //     `SmartHydration: ${pairInfo?.id}`,
                    //     null,
                    //     false,
                    //     false
                    // ).then(
                    //     () => {
                    //         router.replace("wifisetup/connect");
                    //     },
                    //     () => {
                    //         alert(
                    //             "Connection to the jug failed; ensure the jug is in pairing mode and try again.",
                    //         );
                    //     },
                    // );
                }}
            />
        </View>
    );
}
