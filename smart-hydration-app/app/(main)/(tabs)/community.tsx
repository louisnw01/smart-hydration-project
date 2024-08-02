import StyledButton from "@/components/common/button";
import PageWrapper from "@/components/common/page-wrapper";
import { useAtomValue } from "jotai";
import { ReactNode, useEffect, useState } from "react";
import {
    FlatList,
    Pressable,
    RefreshControl,
    ScrollView,
    Text,
    View,
} from "react-native";

import {
    communityInfoQAtom,
    patientInfoQAtom,
    userHasCommunityAtom,
} from "@/atom/query/community";
import Loading from "@/components/common/loading";
import StyledTextInput from "@/components/common/text-input";
import MemberRow from "@/components/community/member-row";
import { FilterObject } from "@/interfaces/community";

//for now (basic user flow), Community tab is shown as 4th tab
//TODO: for care home mode, replace home screen with Community tab

//TODO: add link handling logic to front end for invite link flow

//TODO: add settings cog at top right

export default function CommunityPage() {
    const { isLoading, refetch } = useAtomValue(communityInfoQAtom);
    const { data, isLoading: patientInfoIsLoading } =
        useAtomValue(patientInfoQAtom);
    const hasCommunity = useAtomValue(userHasCommunityAtom);
    const [refreshing, setRefreshing] = useState(false);

    const [filteredData, setFilteredData] = useState<ReactNode[]>([]);
    const [textInput, setTextInput] = useState("");
    const [filters, setFilters] = useState<FilterObject>({
        searchTerm: "",
        sort: "asc",
    });

    useEffect(() => {
        if (data === undefined) return;

        const filteredData = data.filter((member) => {
            return (
                member.name
                    .toLowerCase()
                    .indexOf(filters.searchTerm.toLowerCase()) > -1
            );
        });

        const sortedData = filteredData.sort((a, b) => {
            const comparison = a.name
                .toLowerCase()
                .localeCompare(b.name.toLowerCase());
            return filters.sort === "asc" ? comparison : -comparison;
        });

        const filteredComponents = sortedData.map((member) => (
            <MemberRow member={member} />
        ));

        filteredComponents.push(
            <View className="mt-8 flex gap-6">
                <View className="flex flex-row justify-center">
                    <StyledButton
                        text="+ Add a member"
                        href="add-jug-user"
                        textClass="text-lg"
                    />
                </View>
            </View>,
        );

        setFilteredData(filteredComponents);
    }, [textInput, filters, data]);

    const handleSortPress = () => {
        setFilters((prev) => ({
            ...prev,
            sort: prev.sort === "asc" ? "desc" : "asc",
        }));
    };

    const handleClearPress = () => {
        setFilters((prev) => ({ ...prev, searchTerm: "" }));
        setTextInput("");
    };

    const handleRefresh = () => {
        refetch();
        setRefreshing(true);
    };

    useEffect(() => {
        if (!isLoading) {
            setRefreshing(false);
        }
    }, [isLoading]);

    if (refreshing) {
        setRefreshing(false);
    }

    if (isLoading || patientInfoIsLoading) {
        return <Loading isLoading />;
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
                        <Text className="dark:text-white text-xl text-center">
                            You aren't in a community yet.
                        </Text>

                        <StyledButton
                            text="+ Create a community"
                            href="create-community-modal"
                            buttonClass="w-56 self-center"
                            textClass="text-lg text-center w-full"
                        />
                        <StyledButton
                            text="+ Join a community"
                            href="join-community-modal"
                            buttonClass="w-56 self-center"
                            textClass="text-lg text-center w-full"
                        />
                    </View>
                </ScrollView>
            </PageWrapper>
        );
    } else {
        return (
            <PageWrapper>
                <View className="flex-1">
                    <View className="flex-1">
                        {/* <ScrollView
                            refreshControl={
                                <RefreshControl
                                    refreshing={refreshing}
                                    onRefresh={handleRefresh}
                                />
                            }
                        > */}
                        <View className="flex flex-row mx-2 items-center my-2">
                            <Pressable
                                onPress={handleSortPress}
                                className="bg-blue px-4 py-2 rounded-xl ml-2"
                            >
                                <Text className="text-2l font-semibold text-white">
                                    {`Sort by name ${filters.sort === "asc" ? "A-Z" : "Z-A"}`}
                                </Text>
                            </Pressable>
                        </View>

                        <FlatList
                            data={filteredData || []}
                            contentContainerClassName="flex gap-6"
                            keyExtractor={(patient, idx) => idx}
                            renderItem={({ item }) => item}
                        />

                        {/* </ScrollView> */}
                    </View>
                    <View className="flex-row items-center p-2 gap-4">
                        <View className="flex-1">
                            <StyledTextInput
                                value={textInput}
                                placeholder="Search members..."
                                onChangeText={(val) => {
                                    setTextInput(val);
                                    setFilters((prev) => ({
                                        ...prev,
                                        searchTerm: val,
                                    }));
                                }}
                                textContentType="name"
                                returnKeyType="search"
                            />
                        </View>
                        <StyledButton
                            text="Clear search"
                            buttonClass="rounded-xl"
                            textClass="font-semibold"
                            onPress={handleClearPress}
                        />
                    </View>
                </View>
            </PageWrapper>
        );
    }
}
