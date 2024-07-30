import { start } from "react-native-esp-smartconfig";
import { Button, Text, View } from "react-native";
import React, { useState } from "react";

export default function Index() {
    const [log, setLog] = useState("log here");

    const [wifiName, setWifiName] = useState("Louis");
    const [wifiPass, setWifiPass] = useState("louislouis");

    let foundDevice = false;

    // you can random bssid of wifi, but it need correct format
    const wifiBssid = "8a:29:9c:69:af:9b";

    function config() {
        setLog("configuring...");
        setLog(wifiName);
        // alert(JSON.stringify(espSmartconfig))
        foundDevice = false;
        start({
            bssid: "8a:29:9c:69:af:9b",
            ssid: wifiName,
            password: wifiPass,
        })
            .then(function (results) {
                // Array of devices, successfully handshaked by smartconfig
                setLog(`results: ${JSON.stringify(results)}`);
            })
            .catch(function (error) {
                setLog(`error: ${JSON.stringify(error)}`);
            });
    }

    return (
        <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
            <Text>{log}hello</Text>

            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    marginTop: 100,
                }}
            >
                <Button title={"Start Config"} onPress={() => config()} />

                <View width={20} />

                <Button title={"Stop Config"} />
            </View>
        </View>
    );
}
