import { selectedMemberAtom } from "@/atom/community";
import { addTagsPatientMAtom, communityTagsQAtom } from "@/atom/query";
import StyledButton from "@/components/common/button";
import PageWrapper from "@/components/common/page-wrapper";
import StyledTextInput from "@/components/common/text-input";
import Tag from "@/components/community/tag";
import { FilterObject, TagInfo } from "@/interfaces/community";
import { router } from "expo-router";
import { useAtom, useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

const filterAndSortData = (
    unappliedTags: TagInfo[],
    filterObj: FilterObject,
): TagInfo[] => {
    //search each word in string from beginning, don't match substrings after beginning, case insensitive
    const searchPattern = new RegExp(`\\b${filterObj.searchTerm}`, "i");
    const filteredData = unappliedTags.filter((tag) => {
        return tag.name && searchPattern.test(tag.name);
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
    const [member, setMember] = useAtom(selectedMemberAtom);
    const { data } = useAtomValue(communityTagsQAtom);
    const addTagsMutate = useAtomValue(addTagsPatientMAtom).mutate;
    const [textInput, setTextInput] = useState("");
    const [filteredUnappliedTags, setFilteredUnappliedTags] = useState<
        TagInfo[]
    >([]);
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

    const [appliedTags, setAppliedTags] = useState<TagInfo[] | null>(
        member?.tags || null,
    );

    const [unappliedTags, setUnappliedTags] = useState<TagInfo[]>([]);
    const filterUnappliedTags = () => {
        if (appliedTags == null) return;
        const filteredUnappliedTags = communityTags.filter(
            (item) =>
                !appliedTags.some((appliedTag) => appliedTag.id === item.id),
        );
        setUnappliedTags(filteredUnappliedTags);
    };

    useEffect(() => {
        if (appliedTags == null) return;
        if (data) {
            const communityTagData: TagInfo[] = data.map((tag: any) => ({
                id: tag.id,
                name: tag.name,
            }));
            setCommunityTags(communityTagData);
            const filteredUnappliedTags = communityTagData.filter(
                (item) =>
                    !appliedTags.some(
                        (appliedTag) => appliedTag.name === item.name,
                    ),
            );
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
        if (appliedTags == null) return;
        if (tagName !== "") {
            const filteredArray = appliedTags.filter(
                (item) => item.name !== tagName,
            );
            setAppliedTags(filteredArray);
        }
    };

    const getTagFromName = (tagName: string) => {
        return communityTags.find((tag) => tag.name === tagName);
    };

    const moveToApplied = (tagName: string) => {
        if (appliedTags == null) return;
        if (tagName !== "") {
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
        if (appliedTags == null || member == null) return;
        //add tags in applied array to member
        setMember({ ...member, tags: appliedTags });
        addTagsMutate({
            memberID: member.id,
            memberTags: appliedTags.map((tag) => tag.id),
        });
        router.back();
    };

    //to do: add messages for when no tags applied / all tags applied
    //to do: show message "There are no tags in your community. Ask your owner to add some" when no data

    if (appliedTags == null) return null;

    return (
        <PageWrapper>
            <ScrollView>
                <View className="mt-8 flex gap-6">
                    <Text className="dark:text-white text-2xl mx-6">
                        Apply tags to {member?.name}. Press a tag to move it to
                        the other section
                    </Text>
                    <Text className="dark:text-white font-bold text-2xl mx-6">
                        Applied tags
                    </Text>
                    {appliedTags.length === 0 && (
                        <Text className="dark:text-white text-xl mx-6">
                            No tags applied to user
                        </Text>
                    )}
                    <View className="flex-row flex-wrap my-2 mx-3">
                        {appliedTags.map((tag) => (
                            <Pressable
                                key={tag.id}
                                onPress={() => handleAppliedPress(tag)}
                            >
                                <Tag name={tag.name} />
                            </Pressable>
                        ))}
                    </View>
                    <Text className="dark:text-white font-bold text-2xl mx-6">
                        Unapplied tags
                    </Text>
                    {communityTags.length === 0 && (
                        <Text className="dark:text-white text-xl mx-6">
                            No tags in this community. Ask community owner to
                            add some
                        </Text>
                    )}
                    <View className="flex-row flex-wrap my-2 mx-3">
                        {filteredUnappliedTags.map((tag) => (
                            <Pressable
                                key={tag.id}
                                onPress={() => handleUnappliedPress(tag)}
                            >
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
            <View className="flex flex-row items-center p-2 mb-6">
                <View className="flex-1">
                    <StyledTextInput
                        placeholder="Search unapplied tags..."
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
                        className="bg-blue px-4 py-2 rounded-xl"
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
