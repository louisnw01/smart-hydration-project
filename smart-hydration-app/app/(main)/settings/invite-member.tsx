import { Share, Text, View } from "react-native";
// import Clipboard from "@react-native-clipboard/clipboard";
import { communityInviteLinkQAtom as communityInviteCodeQAtom } from "@/atom/query";
import StyledButton from "@/components/common/button";
import Loading from "@/components/common/loading";
import PageWrapper from "@/components/common/page-wrapper";
import Typography from "@/components/common/typography";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import { BottomSheet } from "./remove-member";

export default function InviteMember() {
    const { data, isLoading } = useAtomValue(communityInviteCodeQAtom);
    const [link, setLink] = useState("");
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (!data) return;
        setLink(`hydrationapi.louisnw.com/community/redirect_invite/${data}`);
    }, [data]);

    const handleOnCopyToClipboard = async () => {
        if (!link) return;
        await Clipboard.setStringAsync(`https://${link}`);
        setTimeout(() => setVisible(false), 2000);
        setVisible(true);
    };

    {
        /*
    const handleOnCopyToClipboard = () => {
      Alert.alert('Copy triggered!')
      //Clipboard.setString(link)
      Clipboard.setString(link);

    }
  */
    }

    const handleOnShare = async () => {
        try {
            const result = await Share.share({
                url: `https://${link}`,
                message: "Hey, use this link to join our community!",
            });

            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // alert(result.activityType);
                    // shared with activity type of result.activityType
                } else {
                    // alert('Shared');
                    // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // sharing was dismissed
                // alert('Dismissed');
                //change this to something more user friendly
            }
        } catch (error: any) {
            alert(error.message);
        }
    };

    if (isLoading) {
        return <Loading isLoading message="" />;
    }

    return (
        <PageWrapper>
            <View className="mx-6 gap-10 mt-20">
                <Text className="text-xl font-medium text-center dark:text-white">
                    Here’s your invite link! This link can only be used once and
                    will expire in 3 hours.
                </Text>
                <View className="flex gap-4 bg-gray-200 rounded-xl px-4 py-4 dark:bg-neutral-700">
                    <Text className="font-medium text-center dark:text-white">
                        {link}
                    </Text>

                    <View className="gap-3 flex-row justify-between">
                        <StyledButton
                            text="Copy"
                            textClass="font-semibold dark:text-black"
                            buttonClass="bg-purple-300 rounded-md"
                            icon={
                                <MaterialCommunityIcons
                                    onPress={handleOnCopyToClipboard}
                                    name="content-copy"
                                    size={16}
                                />
                            }
                            onPress={handleOnCopyToClipboard}
                        />
                        <StyledButton
                            text="Share"
                            textClass="font-semibold text-white"
                            buttonClass="bg-blue rounded-md"
                            icon={
                                <MaterialCommunityIcons
                                    onPress={handleOnShare}
                                    name="share-variant"
                                    size={16}
                                    color="white"
                                />
                            }
                            onPress={handleOnShare}
                        />
                    </View>
                </View>
            </View>
            <BottomSheet isVisible={visible} bg="bg-green">
                <View className="self-center px-4 py-1 rounded-lg">
                    <Typography className="text-center text-2xl text-white">
                        Copied to clipboard!
                    </Typography>
                </View>
            </BottomSheet>
        </PageWrapper>
    );
}
