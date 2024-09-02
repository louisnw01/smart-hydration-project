import { wifiPairInfoAtom } from "@/atom/wifi";
import StyledButton from "@/components/common/button";
import StyledTextInput from "@/components/common/text-input";
import Typography from "@/components/common/typography";
import { router } from "expo-router";
import { useAtomValue } from "jotai";
import { atomWithMutation } from "jotai-tanstack-query";
import { useEffect, useState } from "react";
import { Alert, View } from "react-native";
import WifiManager from "react-native-wifi-reborn";

const pairJugToNetworkMAtom = atomWithMutation<
    void,
    { ssid: string; password: string }
>((get) => ({
    mutationKey: ["pair-jug"],
    mutationFn: async ({ ssid, password }) => {
        // alert(`http://192.168.4.1/passkey?ssid=${ssid}&pwd=${password}`);
        const res = await fetch(
            `http://192.168.4.1/passkey?ssid=${ssid}&pwd=${password}`,
            // {
            //     method: "POST",
            // },
        );

        if (!res.ok) {
            throw new Error("Failed to pair jug to network");
        }

        return;
    },
}));

export default function ConnectPage() {
    const pairInfo = useAtomValue(wifiPairInfoAtom);

    const { mutate, isPending, isSuccess } = useAtomValue(
        pairJugToNetworkMAtom,
    );
    const [password, setPassword] = useState("");

    useEffect(() => {
        if (!isSuccess) return;
        WifiManager.connectToProtectedSSID(
            pairInfo.ssid,
            password,
            false,
            false,
        ).then(
            () => {
                router.replace("wifisetup/success");
            },
            () => {
                Alert.alert(
                    "Incorrect password",
                    "please try again, or reconnect to your WiFi network.",
                );
            },
        );
    }, [isSuccess]);

    if (!pairInfo) {
        router.replace("devices");
        return null;
    }

    return (
        <View className="mx-6 flex-1 justify-center mb-12 gap-10">
            <Typography className="text-xl text-center font-medium">
                Now, enter your the WiFi password for "{pairInfo.ssid}"
            </Typography>

            <StyledTextInput
                title="WiFi Password"
                secureTextEntry
                onChangeText={setPassword}
                autoCapitalize="none"
            />

            <StyledButton
                text="Connect Jug To WiFi Network"
                buttonClass="bg-green mt-5"
                textClass="text-center w-full text-lg font-medium text-white"
                onPress={() => {
                    mutate({
                        ssid: pairInfo.ssid,
                        password: password,
                    });
                }}
                isLoading={isPending}
            />
        </View>
    );
}
