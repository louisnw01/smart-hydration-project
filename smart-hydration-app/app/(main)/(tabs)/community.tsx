
import PageWrapper from "@/components/common/page-wrapper";
import { ScrollView, RefreshControl, View, Text, TextInput, Pressable } from "react-native";
import { useAtom, useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import StyledButton from "@/components/common/button";
import { userHasCommunityAtom, communityNameAtom, membersAtom } from "@/atom/community";
import MemberRow from "@/components/community/member-row";
import { MemberInfo } from "@/interfaces/community";
import { FilterObject } from "@/interfaces/community";
import { data as startData } from "@/constants/member-data"

//for now (basic user flow), Community tab is shown as 4th tab
//to do: for care home mode, replace home screen with Community tab

//to do: add link handling logic to front end for invite link flow
//to do: add settings cog at top right 

export default function CommunityPage() {
    const [hasCommunity] = useAtom(userHasCommunityAtom);
    const [refreshing, setRefreshing] = useState(false);
    const { } = useAtomValue(membersAtom);
    const communityName = useAtomValue(communityNameAtom);
    //const [members] = useAtom(membersAtom); <- commented out while data is hardcoded
    const [data] = useState<MemberInfo[]>(startData);
    const [filteredData, setFilteredData] = useState<MemberInfo[]>([])
    const [textInput, setTextInput] = useState('');
    const [filters, setFilters] = useState<FilterObject>({
        searchTerm: '',
        sort: "asc"
    })
    const filterData = (filterObj: FilterObject) => {
        return data.filter(member => {
            return (
                member.name && member.name.toLowerCase().indexOf(filterObj.searchTerm.toLowerCase()) > -1 ||
                member.description && member.description.indexOf(filterObj.searchTerm.toLowerCase()) > -1
            );
        });
    };
    //filtering only works on strings (not numbers) for now

    //to do: add sorting by name

    useEffect(() => {
        setFilteredData(filterData(filters));
    }, [textInput, filters, data]);

    const handlePress = () => {

    };

    const handleRefresh = () => {
        setRefreshing(true);
    };

    if (refreshing) {
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
                        <TextInput
                            placeholder={`Search members...`}
                            className="bg-gray-200 h-14 placeholder-black text-xl rounded-xl px-3 flex-1"
                            onChangeText={(val) => {
                                setTextInput(val);
                                setFilters(prev => ({ ...prev, searchTerm: val }));
                            }}
                            textContentType="name"
                            returnKeyType="done"
                        />
                        <Pressable
                            onPress={handlePress}
                            className="bg-blue px-4 py-2 rounded-xl ml-2"
                        ><Text className="text-2l font-semibold text-white">
                                Sort by name {filters.sort === "asc" ? "A-Z" : "Z-A"}
                            </Text></Pressable>
                    </View>
                    {Array.from(filteredData.values()).map((member) => (
                        <View key={member.name} className="my-3">
                            <MemberRow member={member} />
                        </View>
                    ))}
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