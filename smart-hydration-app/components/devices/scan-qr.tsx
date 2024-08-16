import { BottomSheet } from "@/app/(main)/manage-community/remove-member";
import {
    checkQRCodeMAtom,
    linkJugMAtom,
    userJugUserIdAtom,
} from "@/atom/query";
import { wifiPairInfoAtom } from "@/atom/wifi";
import useColorPalette from "@/util/palette";
import { Entypo, Ionicons } from "@expo/vector-icons";
import {
    BarcodeScanningResult,
    CameraView,
    useCameraPermissions,
} from "expo-camera";
import { router } from "expo-router";
import { useAtomValue, useSetAtom } from "jotai";
import { useEffect, useState } from "react";
import { Pressable, View } from "react-native";
import WifiManager from "react-native-wifi-reborn";
import StyledButton from "../common/button";
import Loading from "../common/loading";
import Typography from "../common/typography";
import DeviceRow from "./device-row";

export default function ScanWithCamera({ visible, setVisible }) {
    const { mutate, data, isPending, isSuccess, reset } =
        useAtomValue(checkQRCodeMAtom);

    const palette = useColorPalette();
    const [permissions, requestPermissions] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);
    const [jugName, setJugName] = useState("");
    const [question, setQuestion] = useState("");
    const setWifiPairInfo = useSetAtom(wifiPairInfoAtom);
    const {
        mutate: linkJug,
        isPending: linkJugIsPending,
        isSuccess: linkJugIsSuccess,
        reset: resetLinkJug,
    } = useAtomValue(linkJugMAtom);
    const userJugUserId = useAtomValue(userJugUserIdAtom);

    const checkWifiAndSetMessage = async (device) => {
        const ssid = await WifiManager.getCurrentWifiSSID();
        const sameSSID = ssid === device.ssid;

        setWifiPairInfo({
            ssid,
            id: device.id,
        });

        setQuestion(
            `You ${!sameSSID ? "don't" : ""} appear to be connected to the same WiFi network as the jug. Would you like to ${sameSSID ? "skip" : "continue"} wifi setup?`,
        );
    };

    useEffect(() => {
        if (!visible) return;
        setScanned(false);
        reset();
        resetLinkJug();
        setJugName("");
    }, [visible]);

    useEffect(() => {
        if (!data || !isSuccess) return;

        setJugName(data);

        checkWifiAndSetMessage(data);
    }, [data, isSuccess]);

    if (!permissions) {
        return null;
    }

    if (!permissions.granted) {
        requestPermissions();
        return null;
    }

    const handleBarcodeScanned = (result: BarcodeScanningResult) => {
        if (scanned) return;
        setScanned(true);
        mutate({ qr: result.data });
    };

    return (
        <BottomSheet isVisible={visible}>
            <Pressable
                className="absolute right-2 top-2 p-4"
                onPress={() => setVisible(false)}
            >
                <Entypo
                    name="circle-with-cross"
                    size={24}
                    color="rgb(150, 150, 150)"
                />
            </Pressable>
            <View className="gap-6 mx-10">
                <View>
                    <Typography className="w-full text-3xl text-center font-semibold">
                        Add a Jug
                    </Typography>
                </View>

                <View className="flex">
                    {!!jugName && linkJugIsSuccess && (
                        <View className="px-2 h-64 pt-4">
                            <Typography className="text-center mt-4">
                                {question}
                            </Typography>
                            <View className="flex-row justify-evenly pt-16">
                                <StyledButton
                                    text="Skip"
                                    buttonClass="px-4 py-3 rounded-xl bg-gray-100 dark:bg-neutral-900"
                                    textClass="text-lg font-medium"
                                    onPress={() => setVisible(false)}
                                />
                                <StyledButton
                                    text="Setup Wifi"
                                    buttonClass="bg-blue px-4 py-3 rounded-xl"
                                    textClass="text-lg font-medium"
                                    onPress={() => {
                                        router.push("wifisetup");
                                        setVisible(false);
                                    }}
                                />
                            </View>
                        </View>
                    )}

                    {!!jugName && !linkJugIsSuccess && (
                        <View className="px-2 h-64 pt-4">
                            <DeviceRow device={jugName} />
                            <View className="flex-row justify-evenly pt-16">
                                <StyledButton
                                    text="Cancel"
                                    buttonClass="px-4 py-3 rounded-xl"
                                    textClass="text-lg font-medium"
                                    onPress={() => setVisible(false)}
                                />
                                <StyledButton
                                    text="Add to account"
                                    buttonClass="bg-green px-4 py-3 rounded-xl"
                                    textClass="text-lg font-medium"
                                    onPress={() => {
                                        linkJug({
                                            jugIds: [jugName.id],
                                            jugUserId: userJugUserId,
                                        });
                                    }}
                                />
                            </View>
                        </View>
                    )}

                    {(isPending || linkJugIsPending) && (
                        <View className="h-64">
                            <Loading isLoading />
                        </View>
                    )}

                    {!jugName && !isPending && (
                        <>
                            <View className="h-48 rounded-3xl overflow-hidden">
                                <CameraView
                                    facing="back"
                                    style={{ flex: 1 }}
                                    barcodeScannerSettings={{
                                        barcodeTypes: ["qr"],
                                    }}
                                    onBarcodeScanned={handleBarcodeScanned}
                                />
                            </View>
                            <View className="flex-row items-center gap-4 ml-3 h-16 pt-2">
                                <Ionicons
                                    name="qr-code-outline"
                                    size={24}
                                    top={4}
                                    color={palette.fg}
                                />
                                <View className="gap-1">
                                    <Typography className="mt-2 font-semibold text-lg">
                                        Scan the QR code
                                    </Typography>
                                    <Typography className="dark:text-gray-300 ">
                                        It should be located on the base of the
                                        jug.
                                    </Typography>
                                </View>
                            </View>
                        </>
                    )}
                </View>
            </View>
        </BottomSheet>
    );
}
