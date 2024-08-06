// import { useState } from "react";
// import PageHeading from "../common/page-heading";
// import { start } from "react-native-esp-smartconfig";
// import { Button, View, Text, TextInput } from "react-native";
// import PageWrapper from "../common/page-wrapper";

// export default function AddDeviceModal() {
//     const [log, setLog] = useState('log here');
//     let foundDevice = false;

//     const [wifiName, setWifiName] = useState('Louis’ iPhone');
//     const [wifiPass, setWifiPass] = useState('louislouis');

//     function config() {
//         setLog(`connecting to ${wifiName} with password ${wifiPass}`);
//         foundDevice = false;
//             start({
//                 bssid: '8a:29:9c:69:af:9b',
//                 ssid: 'Louis’ iPhone',
//                 password: 'louislouis',
//             })
//             .then((results) => {
//                 setLog(JSON.stringify(results))
//                 // Array of devices, successfully handshaked by smartconfig

//             })
//             .catch((error) => setLog(`error: ${error['message']}`));
//     }
//     return (
//      <PageWrapper>
//         <PageHeading text="Add a device" marginTop={0} />

//          <Text className="mt-10">Wifi Name:</Text>
//          <TextInput className='border mx-16 rounded-md py-1'
//             value={wifiName}
//             onChangeText={setWifiName}
//         />

//         <Text>Wifi Password:</Text>
//         <TextInput className='border mx-16 rounded-md py-1'
//             value={wifiPass}
//             onChangeText={setWifiPass}
//         />

//         <View className="flex-row justify-center mt-10">
//             <Button title={'Connect'} onPress={() => config()}/>
//         </View>

//         <View className="flex-row justify-center mt-10">
//             <Text className="text-xs font-bold">{log}</Text>
//         </View>

//     </PageWrapper>
//     )
// }
