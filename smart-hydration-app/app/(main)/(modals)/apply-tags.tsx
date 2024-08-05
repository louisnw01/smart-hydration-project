import { useEffect, useState } from "react";
import { View, Text, Pressable, TextInput, ScrollView } from "react-native";
import StyledButton from "@/components/common/button";
import Tag from "@/components/community/tag";
import { FilterObject, TagInfo } from "@/interfaces/community";
import PageWrapper from "@/components/common/page-wrapper";
import { communityTagsQAtom } from "@/atom/query/community";
import { addTagsPatientMAtom } from "@/atom/query"
import { useAtomValue, useSetAtom } from "jotai";
import { selectedMemberAtom } from "@/atom/community";

const filterAndSortData = (unappliedTags: TagInfo[], filterObj: FilterObject): TagInfo[] => {
    const filteredData = unappliedTags.filter((tag) => {
        return (
            tag.name &&
            tag.name.toLowerCase().includes(filterObj.searchTerm.toLowerCase())
        );
    });
    return filteredData.sort((a, b) => {
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

export default function ApplyTags() {
    const member = useAtomValue(selectedMemberAtom);
    const setMember = useSetAtom(selectedMemberAtom);
    const { data } = useAtomValue(communityTagsQAtom);
    const addTagsMutate = useAtomValue(addTagsPatientMAtom).mutate;
    const [textInput, setTextInput] = useState("");
    const [filteredUnappliedTags, setFilteredUnappliedTags] = useState<TagInfo[]>([]);
    const [communityTags, setCommunityTags] = useState<TagInfo[]>([]);
    const [filters, setFilters] = useState<FilterObject>({
        searchTerm: "",
        sort: "asc",
    });
    const handleAppliedPress = (tag: TagInfo) => {
        moveFromApplied(tag.name);
    };
    const handleUnappliedPress = (tag: TagInfo) => {
        moveToApplied(tag.name);
    };
    const getMemberTags = () => {
        const initialAppliedTags: TagInfo[] = member.tags || [];
        return initialAppliedTags;
    };
    const initialApplied = getMemberTags();
    const [appliedTags, setAppliedTags] = useState<TagInfo[]>(initialApplied);
    const [unappliedTags, setUnappliedTags] = useState<TagInfo[]>([]);
    const filterUnappliedTags = () => {
        const filteredUnappliedTags = communityTags.filter(item => !appliedTags.some(appliedTag => appliedTag.id === item.id));
        setUnappliedTags(filteredUnappliedTags);
    };

    useEffect(() => {
        if (data) {
            const communityTagData: TagInfo[] = data.map((tag: any) => ({ id: tag.id, name: tag.name }));
            setCommunityTags(communityTagData);
            const filteredUnappliedTags = communityTagData.filter(item => !appliedTags.some(appliedTag => appliedTag.name === item.name));
            setUnappliedTags(filteredUnappliedTags);
        }
    }, [data, appliedTags]);

    useEffect(() => {
        const result = filterAndSortData(unappliedTags, filters);
        setFilteredUnappliedTags(result);
    }, [textInput, filters, unappliedTags]);

    useEffect(() => {
        const result = filterAndSortData(unappliedTags, filters);
        setFilteredUnappliedTags(result);
    }, [textInput, filters, unappliedTags]);

    const moveFromApplied = (tagName: string) => {
        if (tagName !== '') {
            const filteredArray = appliedTags.filter(item => item.name !== tagName);
            setAppliedTags(filteredArray);
        }
    };

    const getTagFromName = (tagName: string) => {
        return communityTags.find(tag => tag.name === tagName);
    }

    const moveToApplied = (tagName: string) => {
        if (tagName !== '') {
            const tagToMove = getTagFromName(tagName);
            if (tagToMove) {
                setAppliedTags([...appliedTags, tagToMove]);
                filterUnappliedTags();
            }
        }
    };

    const handleClearPress = () => {
        setFilters((prev) => ({ ...prev, searchTerm: "" }));
        setTextInput("");
    };

    const handleSaveTags = () => {
        //add tags in applied array to member
        setMember({ ...member, tags: appliedTags });
        addTagsMutate();
        console.log("Applied tags on save in Apply Tags page: ", appliedTags);
    };

    return (
        <PageWrapper>
            <ScrollView>
                <View className="mt-8 flex gap-6">
                    <Text className="dark:text-white text-2xl mx-6">
                        Apply tags to {member.name}. Press a tag to move it to the other section
                    </Text>
                    <Text className="dark:text-white font-bold text-2xl mx-6">
                        Applied tags
                    </Text>
                    {appliedTags.length === 0 && (
                        <Text className="dark:text-white text-xl">
                            No tags applied to user
                        </Text>
                    )}
                    <View className="flex-row flex-wrap my-2 mx-3">
                        {appliedTags.map((tag) => (
                            <Pressable key={tag.id} onPress={() => handleAppliedPress(tag)}>
                                <Tag name={tag.name} />
                            </Pressable>
                        ))}
                    </View>
                    <Text className="dark:text-white font-bold text-2xl mx-6">
                        Unapplied tags
                    </Text>
                    {communityTags.length === 0 && (
                        <Text className="dark:text-white text-xl">
                            No tags in this community. Ask community owner to add some
                        </Text>
                    )}
                    <View className="flex-row flex-wrap my-2 mx-3">
                        {filteredUnappliedTags.map((tag) => (
                            <Pressable key={tag.id} onPress={() => handleUnappliedPress(tag)}>
                                <Tag name={tag.name} />
                            </Pressable>
                        ))}
                    </View>
                    <View className="flex flex-col justify-center items-center">
                        <StyledButton
                            text="Save member's tags"
                            href="member-info-modal"
                            textClass="text-lg"
                            onPress={handleSaveTags}
                        />
                    </View>
                </View>
            </ScrollView>
            <View className="flex flex-row items-center p-2">
                <View className="flex-1">
                    <TextInput
                        value={textInput}
                        placeholder="Search unapplied tags..."
                        className="bg-gray-200 h-14 placeholder-black text-xl rounded-xl px-3 mb-7 m-1 border"
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
                <View className="justify-center ml-2">
                    <Pressable
                        onPress={handleClearPress}
                        className="bg-blue px-4 py-2 rounded-xl mb-6"
                    >
                        <Text className="text-xl font-semibold text-white">
                            Clear search
                        </Text>
                    </Pressable>
                </View>
            </View>
        </PageWrapper>
    );
}