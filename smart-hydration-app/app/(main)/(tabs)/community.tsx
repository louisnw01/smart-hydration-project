import StyledButton from "@/components/common/button";
import PageWrapper from "@/components/common/page-wrapper";
import { useAtom, useAtomValue } from "jotai";
import React, { ReactElement, useEffect, useState } from "react";
import { FlatList, RefreshControl, ScrollView, Text, View } from "react-native";

import { selectedSortMethodAtom } from "@/atom/community";
import {
    communityInfoQAtom,
    patientInfoQAtom,
    userHasCommunityAtom,
} from "@/atom/query";
import { userModeAtom } from "@/atom/user";
import Loading from "@/components/common/loading";
import StyledTextInput from "@/components/common/text-input";
import CommunityLeaderboard from "@/components/community/community-leaderboard";
import MemberRow from "@/components/community/member-row";
import { FilterObject, MemberInfo } from "@/interfaces/community";
import useColorPalette from "@/util/palette";
import { Entypo } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { SelectList } from "react-native-dropdown-select-list";

export default function CommunityPage() {
    const { isLoading, refetch: refetchCommunityInfo } =
        useAtomValue(communityInfoQAtom);
    const {
        data,
        isLoading: patientInfoIsLoading,
        refetch: refetchPatientInfo,
    } = useAtomValue(patientInfoQAtom);
    const hasCommunity = useAtomValue(userHasCommunityAtom);
    const [refreshing, setRefreshing] = useState(false);
    const palette = useColorPalette();
    const [filteredData, setFilteredData] = useState<ReactElement[]>([]);
    const [textInput, setTextInput] = useState("");
    const isCarer = useAtomValue(userModeAtom) == "Carer";
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
        }, [refetchCommunityInfo, refetchPatientInfo]),
    );

    useEffect(() => {
        if (data === undefined) return;
        //search each word in string from beginning, don't match substrings after beginning, case insensitive
        const searchPattern = new RegExp(`\\b${filters.searchTerm}`, "i");
        const filteredData = data.filter((member) =>
            searchPattern.test(member.name),
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
                        text="+ Add a patient"
                        onPress={() => router.push("add-jug-user")}
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

    const sortMethod: { key: keyof MemberInfo; value: string }[] = [
        { key: "name", value: "Name" },
        { key: "drankToday", value: "Amount Drank Today" },
        { key: "lastDrank", value: "Last Drank" },
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
                            onPress={() =>
                                router.push("create-community-modal")
                            }
                            buttonClass="w-56 self-center"
                            textClass="text-lg text-center w-full"
                        />
                        <StyledButton
                            text="+ Join a community"
                            onPress={() => router.push("join-community-modal")}
                            buttonClass="w-56 self-center"
                            textClass="text-lg text-center w-full"
                        />
                    </View>
                </ScrollView>
            </PageWrapper>
        );
    } else if (!isCarer) {
        return <CommunityLeaderboard />;
    } else {
        return (
            <PageWrapper>
                <View className="flex-row px-4 pt-4 pr mb-4 gap-4 justify-evenly">
                    <Text className="py-3 text-xl font-semibold dark:text-white">
                        Sort by:
                    </Text>
                    <View className="w-68">
                        <SelectList
                            arrowicon=<Entypo
                                name="chevron-down"
                                size={24}
                                color={palette.fglight}
                            />
                            setSelected={(val) => {
                                handleSortChange(val);
                            }}
                            data={sortMethod}
                            save="key"
                            search={false}
                            boxStyles={{
                                borderColor: "rgb(80, 80, 80)",
                            }}
                            dropdownStyles={{
                                // transform: [{ translateX: -68 }],
                                borderColor: "rgb(80, 80, 80)",
                            }}
                            dropdownTextStyles={{
                                color: palette.fg,
                            }}
                            inputStyles={{
                                color: palette.fg,
                                alignSelf: "center",
                            }}
                        />
                    </View>

                    <StyledButton
                        text={`${filters.sort === "asc" ? "Asc" : "Desc"}`}
                        onPress={handleSortPress}
                        buttonClass="bg-blue items-center rounded-xl w-20 h-12"
                        textClass="font-semibold text-white text-center w-full"
                    />
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
                        <View className="py-2"></View>
                        <FlatList
                            data={filteredData || []}
                            keyExtractor={(patient, idx) => idx.toString()}
                            renderItem={({ item }) => item}
                        />

                        {/* </ScrollView> */}
                    </View>
                    <View className="flex-row items-center p-2 gap-4">
                        <View className="flex-1">
                            <StyledTextInput
                                value={textInput}
                                placeholder="Search patients..."
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
