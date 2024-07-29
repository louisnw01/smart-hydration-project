import StyledButton from "@/components/common/button";
import PageWrapper from "@/components/common/page-wrapper";
import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import {
    FlatList,
    RefreshControl,
    ScrollView,
    Text,
    View,
} from "react-native";

import {
    communityInfoQAtom,
    communityNameAtom,
    patientInfoQAtom,
    userHasCommunityAtom,
} from "@/atom/query/community";
import Loading from "@/components/common/loading";
import MemberRow from "@/components/community/member-row";

import StyledTextInput from "@/components/common/text-input";
import { FilterObject, PatientInfo } from "@/interfaces/community";

//for now (basic user flow), Community tab is shown as 4th tab
//to do: for care home mode, replace home screen with Community tab

//to do: add link handling logic to front end for invite link flow

//to do: add settings cog at top right



export default function CommunityPage() {
    const { isLoading, refetch } = useAtomValue(communityInfoQAtom);
    const { data, isLoading: patientInfoIsLoading } =
        useAtomValue(patientInfoQAtom);
    const hasCommunity = useAtomValue(userHasCommunityAtom);
    const [refreshing, setRefreshing] = useState(false);
    const communityName = useAtomValue(communityNameAtom);
    const [filteredData, setFilteredData] = useState<PatientInfo[]>([]);
    const [textInput, setTextInput] = useState("");
    const [filters, setFilters] = useState<FilterObject>({
        searchTerm: "",
        sort: "asc",
    });
    const filterAndSortData = (filterObj: FilterObject) => {
        if (!data) return;
        const filteredData = data.filter((patient: PatientInfo) => {
            return (
                (patient.name &&
                    patient.name
                        .toLowerCase()
                        .indexOf(filterObj.searchTerm.toLowerCase()) > -1)
            );
        });
        return filteredData.sort((a: any, b: any) => {
            const nameA = a.name.toLowerCase();
            const nameB = b.name.toLowerCase();
            if (filterObj.sort === "desc") {
                return nameB.localeCompare(nameA);
            } else if (filterObj.sort === "asc") {
                return nameA.localeCompare(nameB);
            }
            return 0;
        });
    };

    //filtering only works on strings (not numbers) for now

    useEffect(() => {
        if (!data) return;
        const result = filterAndSortData(filters);
        setFilteredData(result);
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
                        <View className="flex flex-row justify-center items-center">
                            <Text className="dark:text-white text-2xl">
                                You aren't in a community yet.
                            </Text>
                        </View>
                        <View className="flex flex-row justify-center">
                            <StyledButton
                                text="+ Create a community"
                                href="create-community-modal"
                                textClass="text-lg"
                            />
                        </View>
                        <View className="flex flex-row justify-center">
                            <StyledButton
                                text="+ Join a community"
                                href="join-community-modal"
                                textClass="text-lg"
                            />
                        </View>
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
                        <View className="mt-8 flex gap-6">
                            <View className="flex flex-row justify-center">
                                <Text className="dark:text-white text-2xl font-bold">
                                    {communityName}
                                </Text>
                            </View>
                        </View>
                        {/* change this to members.size > 0 when entered members are stored in members array*/}
                        {/*members.size === 0 && (
                            <Text className="text-center dark:text-white text-lg">
                                This community only contains example members
                            </Text>
                        )*/}
                        <View className="flex flex-row mx-2 items-center my-2">
                            <StyledButton
                                text={`Sort by name ${filters.sort === "asc" ? "A-Z" : "Z-A"}`}
                                onPress={handleSortPress}
                                textClass="text-lg"
                            />
                        </View>
                        {/* filtering breaks if users have the same name: get ID from endpoint and use that as ID instead? */}
                        {!!filteredData && filteredData.length > 0 && (
                            <FlatList
                                data={filteredData}
                                contentContainerClassName="flex gap-6"
                                keyExtractor={(patient) => patient.name}
                                renderItem={({ item }) => (
                                    <MemberRow patient={item} />
                                )}
                            />
                        )}

                        {/* {Array.from(filteredData.values()).map((member) => (
                            <View key={member.name} className="my-3">
                                <MemberRow member={member} />
                            </View>
                        ))} */}
                        <View className="mt-8 flex gap-6">
                            <View className="flex flex-row justify-center">
                                <StyledButton
                                    text="+ Add a member"
                                    href="add-jug-user"
                                    textClass="text-lg"
                                />
                            </View>
                        </View>
                        {/* </ScrollView> */}
                    </View>
                    <View className="flex flex-row items-center p-2">
                        <View className="flex-1">
                            <StyledTextInput
                                value={textInput}
                                placeholder={`Search members...`}
                                onChangeText={(val) => {
                                    setTextInput(val);
                                    setFilters((prev) => ({
                                        ...prev,
                                        searchTerm: val,
                                    }));
                                }}
                                textContentType="name"
                                returnKeyType="done"
                            />
                        </View>
                        <View className="ml-2">
                            <StyledButton
                                text="Clear search"
                                onPress={handleClearPress}
                                textClass="text-lg"
                            />
                        </View>
                    </View>
                </View>
            </PageWrapper>
        );
    }
}
