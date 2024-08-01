import { useEffect, useState } from "react";
import { View, Text, Pressable, TextInput, ScrollView } from "react-native";
import { useNavigation } from "expo-router";
import StyledButton from "@/components/common/button";
import Tag from "@/components/community/tag";
import { FilterObject, TagInfo } from "@/interfaces/community";
import PageWrapper from "@/components/common/page-wrapper";
import { communityTagsQAtom } from "@/atom/query/community"; //all tags in community

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
    const navigation = useNavigation();
    const [inviteLink, setInviteLink] = useState('');
    const [textInput, setTextInput] = useState("");
    const [filteredUnappliedTags, setFilteredUnappliedTags] = useState<TagInfo[]>([]);
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
    const [appliedTags, setAppliedTags] = useState([
        { name: "independent" },
        { name: "tea" },
        { name: "aggressive" },
        { name: "friendly" },
        { name: "coffee" },
        { name: "one" },
        { name: "two" },
        { name: "three" },
        { name: "four" },
        { name: "five" }
    ]);
    const [unappliedTags, setUnappliedTags] = useState([
        { name: "squash" },
        { name: "soda" },
        { name: "needs help" },
        { name: "juice" },
        { name: "six" },
        { name: "seven" },
        { name: "eight" },
        { name: "nine" },
        { name: "ten" }
    ]);

    useEffect(() => {
        const result = filterAndSortData(unappliedTags, filters);
        setFilteredUnappliedTags(result);
    }, [textInput, filters, unappliedTags]);

    const moveFromApplied = (tagName: string) => {
        if (tagName !== '') {
            //remove tag from appliedTags array
            const filteredArray = appliedTags.filter(item => item.name !== tagName);
            setAppliedTags(filteredArray);
            //add tag to unappliedTags array
            const newTag = { name: tagName };
            setUnappliedTags([...unappliedTags, newTag]);
        }
    };

    const moveToApplied = (tagName: string) => {
        if (tagName !== '') {
            //remove tag from unappliedTags array
            const filteredArray = unappliedTags.filter(item => item.name !== tagName);
            setUnappliedTags(filteredArray);
            //add tag to appliedTags array
            const newTag = { name: tagName };
            setAppliedTags([...appliedTags, newTag]);
        }
    };

    const handleClearPress = () => {
        setFilters((prev) => ({ ...prev, searchTerm: "" }));
        setTextInput("");
    };

    //to do: add messages for when no tags applied / all tags applied

    return (
        <PageWrapper>
            <ScrollView>
                <View className="mt-8 flex gap-6">
                    <Text className="dark:text-white text-2xl mx-6">
                        Press a tag to move it to the other section
                    </Text>
                    <Text className="dark:text-white font-bold text-2xl mx-6">
                        Applied tags
                    </Text>
                    <View className="flex-row flex-wrap my-2 mx-3">
                        {appliedTags.map((tag, index) => (
                            <Pressable key={index} onPress={() => handleAppliedPress(tag)}>
                                <Tag name={tag.name} />
                            </Pressable>
                        ))}
                    </View>
                    <Text className="dark:text-white font-bold text-2xl mx-6">
                        Unapplied tags
                    </Text>
                    <View className="flex-row flex-wrap my-2 mx-3">
                        {filteredUnappliedTags.map((tag, index) => (
                            <Pressable key={index} onPress={() => handleUnappliedPress(tag)}>
                                <Tag name={tag.name} />
                            </Pressable>
                        ))}
                    </View>
                    <View className="flex flex-col justify-center items-center">
                        <StyledButton
                            text="Save member's tags"
                            href="member-info-modal"
                            textClass="text-lg"
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