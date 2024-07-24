import { View, Pressable, Text, TextInput, Alert, Share} from "react-native";
// import Clipboard from "@react-native-clipboard/clipboard";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import * as React from 'react';
import * as Clipboard from 'expo-clipboard';



export default function InviteMember() {
    const [link, setLink] = useState<string>('https://google.com');

    React.useEffect(() => {
      // TODO: fetch link
    },);

    const handleOnCopyToClipboard = async () => {
      await Clipboard.setStringAsync(link);
      const clipboardContent = await Clipboard.getStringAsync();
      Alert.alert('Copied to Clipboard')

    }

{/*
    const handleOnCopyToClipboard = () => {
      Alert.alert('Copy triggered!')
      //Clipboard.setString(link)
      Clipboard.setString(link);

    }
  */}

    const handleOnShare = async () => {
      try {
        const result = await Share.share({
          url: link,
          message: 'Hey, use this link to join our community!',
        })

        if (result.action === Share.sharedAction) {
          if (result.activityType) {
            Alert.alert(result.activityType);
            // shared with activity type of result.activityType
          } else {
            Alert.alert('Shared');
            // shared
          }
        } else if (result.action === Share.dismissedAction) {
          // sharing was dismissed
            Alert.alert('Dismissed');
            //change this to something more user friendly
        }
      } catch (error: any) {
        Alert.alert(error.message);
      }
    };
    const router = useRouter();
    return (
        <View className="flex flex-1 gap-8 mx-16 items-center mt-10">
            <View className="items-center gap-4 mt-20">

                    <Text className="text-black text-2xl font-semibold text-center">
                      Here’s your invite link! This link can only be used once and will expire in 3 hours.
                    </Text>
                  {/*
                  //for testing whether copy link works
                    <TextInput
                        placeholder="Enter Community name"
                        textContentType="emailAddress"
                        autoCapitalize="none"
                        defaultValue={''}
                        className="bg-gray-200 w-full h-14 placeholder-black text-xl rounded-xl px-3"
                    />
    */}
                    <View className="bg-gray-300 border border-gray-100 rounded-xl h-auto w-auto p-7">

                         {/*backgroundColor: '#d9d9d9',
                          borderColor: '#f9f9f9',
                          borderRadius: '10px',
                          borderWidth: '1px',
                          height: '50px',
                          width: 'auto',
                          paddingLeft: '15px',
                          */}
                        <Text className="text-black text-2xl font-semibold text-center">
                          {link}
                        </Text>
                  </View>
                  <View className="flex flex-row w-full justify-between">
                    <MaterialCommunityIcons
                        onPress={handleOnCopyToClipboard}
                        name="content-copy"
                        size={30}
                    />
                    <MaterialCommunityIcons
                        onPress={handleOnShare}
                        name="share-variant"
                        size={30}
                    />
                  </View>

                  <></>
            </View>
        </View>
    );
  <></>
}
