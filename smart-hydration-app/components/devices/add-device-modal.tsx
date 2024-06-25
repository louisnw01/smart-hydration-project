import { useState } from "react";
import PageHeading from "../common/page-heading";
import PopupPage from "../popup-page";
import SmartConfig from "react-native-smartconfig-tem";
import { Button, View, Text, TextInput } from "react-native";

export default function AddDeviceModal() {
    const [log, setLog] = useState('log here');
    let foundDevice = false;

    const [wifiName, setWifiName] = useState('Louis’ iPhone');
    const [wifiPass, setWifiPass] = useState('louislouis');

    function config() {
        setLog(`connecting to "${wifiName}"" with password "${wifiPass}"...`);
        foundDevice = false;
            SmartConfig.start('Louis’ iPhone', '8b:29:9c:69:af:9b', 'louislouis', 90*1000, ({eventName, data}) => {
                if (eventName == 'onFoundDevice') {
                    setLog(`results: ${data}`)
                } else {
                    // setLog("no devices found")
                }
            }
            )

            // .then((results) => {
            //     // Array of devices, successfully handshaked by smartconfig

            // })
            // .catch((error) => setLog(`error: ${error['message']}`));
    }
    return (
     <PopupPage>
        <PageHeading text="Add a device" />

         <Text className="mt-10">Wifi Name:</Text>
         <TextInput className='border mx-16 rounded-md py-1'
            value={wifiName}
            onChangeText={setWifiName}
        />

        <Text>Wifi Password:</Text>
        <TextInput className='border mx-16 rounded-md py-1'
            value={wifiPass}
            onChangeText={setWifiPass}
        />

        <View className="flex-row justify-center mt-10">
            <Button title={'Connect'} onPress={() => config()}/>
        </View>


        <View className="flex-row justify-center mt-10">
            <Text className="text-xs font-bold">{log}</Text>
        </View>

    </PopupPage>
    )
}