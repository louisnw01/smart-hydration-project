
import PageWrapper from "@/components/common/page-wrapper";
import { ScrollView, RefreshControl, View, Text } from "react-native";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { getJugDataQAtom } from "@/atom/query";
import { useState } from "react";
import StyledButton from "@/components/common/button";
import { userHasCommunityAtom, communityNameAtom } from "@/atom/community";

//for now (basic user flow), Community tab is shown as 4th tab
//to do: for care home mode, replace home screen with Community tab

//to do: add link handling logic to front end for invite link flow
//to do: add settings cog at top right 

export default function CommunityPage() {
    const [hasCommunity] = useAtom(userHasCommunityAtom);
    const [refreshing, setRefreshing] = useState(false);
    const { data, isLoading, refetch } = useAtomValue(getJugDataQAtom); //create equivalent for getting members
    const communityName = useAtomValue(communityNameAtom);
    const handleRefresh = () => {
        setRefreshing(true);
        refetch();
    };

    if (!isLoading && refreshing) {
        setRefreshing(false);
    }
    if (!hasCommunity) {
        return (
            <PageWrapper>
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={handleRefresh}
                        />
                    }
                >
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
                </ScrollView>
            </PageWrapper>
        );
    }
    else {
        return (
            <PageWrapper>
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={handleRefresh}
                        />
                    }
                >
                    <View className="flex flex-row justify-center items-center">
                            <Text className="dark:text-white text-2xl font-bold">
                                {communityName}
                            </Text>
                        </View>
                    <View className="mt-8 flex gap-6">
                        <View className="flex flex-row justify-center">
                            <StyledButton
                                text="+ Add a member"
                                href="add-member-modal"
                                textSize="lg"
                            />
                        </View>
                    </View>
                </ScrollView>
            </PageWrapper>
        );
    }

}