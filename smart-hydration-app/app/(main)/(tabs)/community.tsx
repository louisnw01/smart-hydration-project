import StyledButton from "@/components/common/button";
import PageWrapper from "@/components/common/page-wrapper";
import { useAtomValue, useAtom } from "jotai";
import React, { ReactNode, useEffect, useState } from "react";
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
import { FilterObject, MemberInfo } from "@/interfaces/community";
import { SelectList } from "react-native-dropdown-select-list";
import { selectedSortMethodAtom } from "@/atom/community";
import { useFocusEffect } from "expo-router";

//for now (basic user flow), Community tab is shown as 4th tab
//TODO: for care home mode, replace home screen with Community tab

//TODO: add link handling logic to front end for invite link flow

//TODO: add settings cog at top right

export default function CommunityPage() {
    const { isLoading, refetch: refetchCommunityInfo } = useAtomValue(communityInfoQAtom);
    const { data, isLoading: patientInfoIsLoading, refetch: refetchPatientInfo} =
        useAtomValue(patientInfoQAtom);
    const hasCommunity = useAtomValue(userHasCommunityAtom);
    const [refreshing, setRefreshing] = useState(false);

    const [filteredData, setFilteredData] = useState<ReactNode[]>([]);
    const [textInput, setTextInput] = useState("");
    const [filters, setFilters] = useState<FilterObject>({
        searchTerm: "",
        sort: "asc",
    });
    const [selected, setSelected] = useAtom(selectedSortMethodAtom);

    //refetch CommunityInfo and PatientInfo when the user navigates to this page
    useFocusEffect(
        React.useCallback(() => {
            refetchCommunityInfo();
            refetchPatientInfo();
        }, [refetchCommunityInfo, refetchPatientInfo])
    );

    useEffect(() => {
        if (data === undefined) return;

        const filteredData = data.filter((member) =>
            member.name
                .toLowerCase()
                .includes(filters.searchTerm.toLowerCase()),
        );

        const sortedData = filteredData.sort((a, b) => {
            let comparison = 0;
            if (selected === "name") {
                comparison = a.name
                    .toLowerCase()
                    .localeCompare(b.name.toLowerCase());
            } else {
                comparison = a[selected] - b[selected];
            }
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
    }, [data, filters, selected, textInput]);

    const handleSortPress = () => {
        setFilters((prev) => ({
            ...prev,
            sort: prev.sort === "asc" ? "desc" : "asc",
        }));
    };

    const handleSortChange = (val: string) => {
        setSelected(val);
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
        refetchCommunityInfo();
        refetchPatientInfo();
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

    const sortMethod = [
        { key: "name", value: "Name" },
        { key: "target_percentage", value: "Progress To Target" },
        { key: "drank_today", value: "Amount Drank Today" },
        { key: "last_drank", value: "Last Drank" },
    ];

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
                <View className="flex-row px-4 pt-4 pr mb-4 ">
                    <Text className="py-3 text-xl font-semibold">
                        Sort by:{" "}
                    </Text>
                    <SelectList
                        setSelected={(val) => {
                            handleSortChange(val);
                        }}
                        data={sortMethod}
                        save="key"
                        search={false}
                        boxStyles={{
                            borderColor: "#f0f0f0",
                            width: "80%",
                        }}
                        dropdownStyles={{
                            width: "125%",
                            transform: [{ translateX: -68 }],
                            borderColor: "#f0f0f0",
                        }}
                    />

                    <View className="absolute w-20 h-[3.3rem] right-4 top-4 bg-blue px-4 py-2 rounded-xl ml-2">
                        <Pressable onPress={handleSortPress}>
                            <Text className="pt-2 text-center text-2l font-semibold text-white">
                                {`${filters.sort === "asc" ? "Asc" : "Desc"}`}
                            </Text>
                        </Pressable>
                    </View>
                </View>
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
