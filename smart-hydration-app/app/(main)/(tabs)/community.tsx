
import PageWrapper from "@/components/common/page-wrapper";
import { RefreshControl, ScrollView, View, Text } from "react-native";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { getJugDataQAtom } from "@/atom/query";
import DeviceRow from "@/components/devices/device-row";
import { useState } from "react";
import StyledButton from "@/components/common/button";
import Loading from "@/components/common/loading";

import { userHasCommunityAtom } from "@/atom/community";


//for now (basic user flow), Community tab is shown as 4th tab
//to do: for care home mode, replace home screen with Community tab

//to do: add link handling logic to front end for invite link flow

export default function CommunityPage() {

    const [hasCommunity, setHasCommunity] = useAtom(userHasCommunityAtom);
    const toggleCommunity = useSetAtom(userHasCommunityAtom); //toggle this when community created
    if (!hasCommunity) {
        return (
            <View className="mt-8 flex gap-6">
                <View className="flex flex-row justify-center items-center">
                    <Text className="dark:text-white text-2xl">
                        You aren't in a community yet.
                    </Text>
                </View>
                <View className="flex flex-row justify-center">
                    <StyledButton
                        text="+ Create a community"
                        href="create-community-modal"
                        textSize="lg"
                    />
                </View>
                <View className="flex flex-row justify-center">
                    <StyledButton
                        text="+ Join a community"
                        href="join-community-modal"
                        textSize="lg"
                    />
                </View>
            </View>
        );
    }
    else {
        return (
            <View className="flex flex-1 justify-center items-center">
                <Text className="dark:text-white text-2xl">
                    Welcome to your community.
                </Text>
            </View>
        );
    }

}