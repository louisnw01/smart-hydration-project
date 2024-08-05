import {
    communityTagsQAtom,
    createTagMAtom,
    deleteTagMAtom,
    updateTagMAtom,
} from "@/atom/query";
import StyledButton from "@/components/common/button";
import PageWrapper from "@/components/common/page-wrapper";
import StyledTextInput from "@/components/common/text-input";
import EditTagRow from "@/components/community/edit-tag-row";
import { FilterObject, TagInfo } from "@/interfaces/community";
import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";

//to do: add loading spinner while tags load

export default function EditTags() {
    const [showNewTagBox, setShowNewTagBox] = useState(false);
    const [showEditTagBox, setShowEditTagBox] = useState(false);
    const [newTextInput, setNewTextInput] = useState("");
    const [editTextInput, setEditTextInput] = useState("");
    const [tagExists, setTagExists] = useState(false);
    const [currentTagName, setCurrentTagName] = useState("");
    const { data, refetch: refetchTags } = useAtomValue(communityTagsQAtom);
    const createTagMutate = useAtomValue(createTagMAtom).mutate;
    const updateTagMutate = useAtomValue(updateTagMAtom).mutate;
    const deleteTagMutate = useAtomValue(deleteTagMAtom).mutate;
    const [filters, setFilters] = useState<FilterObject>({
        searchTerm: "",
        sort: "asc",
    });

    const toggleNewTagSection = () => {
        setShowNewTagBox(!showNewTagBox);
    };

    const toggleEditTagSection = (tagName: string) => {
        if (tagName) {
            setCurrentTagName(tagName);
        }
        setShowEditTagBox(!showEditTagBox);
    };

    const handleStartup = async () => {};

    useEffect(() => {
        refetchTags();
    }, []);

    useEffect(() => {
        handleStartup();
    }, []);

    const [tags, setTags] = useState<TagInfo[]>([]);

    useEffect(() => {
        if (data) {
            const updatedTags: TagInfo[] = data.map((tag: any) => ({
                id: tag.id,
                name: tag.name,
            }));
            setTags(updatedTags);
        }
    }, [data]);

    const sortData = (filterObj: FilterObject) => {
        if (!tags) return;
        const sortedTags = [...tags].sort((a: TagInfo, b: TagInfo) => {
            const nameA = a.name.toLowerCase();
            const nameB = b.name.toLowerCase();
            if (filterObj.sort === "desc") {
                return nameB.localeCompare(nameA);
            } else if (filterObj.sort === "asc") {
                return nameA.localeCompare(nameB);
            }
            return 0;
        });
        setTags(sortedTags);
    };

    useEffect(() => {
        sortData(filters);
    }, [filters]);

    const handleEditTag = () => {
        if (currentTagName !== "" && editTextInput !== "") {
            const updatedTags = tags.map((tag) =>
                tag.name === currentTagName
                    ? { ...tag, name: editTextInput }
                    : tag,
            );
            setTags(updatedTags);
            setCurrentTagName("");
            setEditTextInput("");
            setShowEditTagBox(false);
            updateTagMutate({
                currentName: currentTagName,
                newName: editTextInput,
            });
        }
    };

    const handleDeleteTag = (deletedTagName: string) => {
        if (deletedTagName !== "") {
            const filteredArray = tags.filter(
                (item) => item.name !== deletedTagName,
            );
            setTags(filteredArray);
            deleteTagMutate({ tagName: deletedTagName });
        }
    };

    const handleAddTag = async (newTagName: string) => {
        if (newTagName === "") {
            return;
        }

        if (
            tags.some(
                (tag) => tag.name.toLowerCase() === newTagName.toLowerCase(),
            )
        ) {
            setTagExists(true);
            return;
        }
        if (!tagExists) {
            setTags([...tags, { name: newTagName } as TagInfo]);
            setNewTextInput("");
            toggleNewTagSection();
            createTagMutate({ tagName: newTagName });
        }
    };

    const isTagInArray = (textEntry: string) => {
        const exists = tags.some(
            (tag) => tag.name.toLowerCase() === textEntry.toLowerCase(),
        );
        setTagExists(exists);
        return exists;
    };

    const toggleSortDirection = () => {
        setFilters((prev) => ({
            ...prev,
            sort: prev.sort === "asc" ? "desc" : "asc",
        }));
    };

    return (
        <PageWrapper>
            <ScrollView>
                <View className="flex flex-1 gap-8 mx-16 items-center mt-10">
                    <StyledButton
                        text={`Sort tags by name ${filters.sort === "asc" ? "A-Z" : "Z-A"}`}
                        textClass="text-lg"
                        onPress={toggleSortDirection}
                    />
                    {tags.length === 0 && (
                        <Text className="dark:text-white text-xl">
                            There are no tags in this community. Please add some
                        </Text>
                    )}
                    <View className="flex-col justify-start mx-6">
                        {tags.map((tag) => (
                            <View key={tag.name} className="">
                                <EditTagRow
                                    tag={tag}
                                    onEdit={() =>
                                        toggleEditTagSection(tag.name)
                                    }
                                    onDelete={() => handleDeleteTag(tag.name)}
                                />
                            </View>
                        ))}
                    </View>
                    <StyledButton
                        text="+ New tag"
                        textClass="text-lg"
                        onPress={toggleNewTagSection}
                    />
                    {showNewTagBox && (
                        <View className="mx-10 bg-gray-400 mb-10 px-7 py-4 rounded-xl dark:bg-neutral-800">
                            <View className="mb-3">
                                <Text className="dark:text-white text-xl font-bold">
                                    Create new tag
                                </Text>
                            </View>
                            {tagExists && (
                                <Text className="dark:text-white text-xl mb-2">
                                    You can't create a tag with an existing name
                                </Text>
                            )}
                            <View className="flex-row items-center">
                                <View className="mr-4">
                                    <StyledTextInput
                                        value={newTextInput}
                                        placeholder="Enter tag name"
                                        onChangeText={(val) => {
                                            setNewTextInput(val);
                                            isTagInArray(val);
                                        }}
                                        textContentType="name"
                                        returnKeyType="done"
                                    />
                                </View>
                                <View className="mr-4">
                                    <StyledButton
                                        text="Cancel"
                                        textClass="text-lg"
                                        onPress={() => {
                                            setNewTextInput("");
                                            toggleNewTagSection();
                                        }}
                                    />
                                </View>
                                {!tagExists && (
                                    <View className="mr-2">
                                        <StyledButton
                                            text="Create"
                                            textClass="text-lg"
                                            onPress={() =>
                                                handleAddTag(newTextInput)
                                            }
                                        />
                                    </View>
                                )}
                            </View>
                        </View>
                    )}
                    {showEditTagBox && (
                        <View className="mx-10 bg-gray-400 mb-10 px-7 py-4 rounded-xl dark:bg-neutral-800">
                            <View className="mb-3">
                                <Text className="dark:text-white text-xl font-bold">
                                    Edit tag
                                </Text>
                                <Text className="dark:text-white text-xl">
                                    Current name: {currentTagName}
                                </Text>
                            </View>
                            <View className="flex-row items-center">
                                <View className="mr-4">
                                    <StyledTextInput
                                        value={editTextInput}
                                        placeholder="Enter new tag name"
                                        onChangeText={(val) =>
                                            setEditTextInput(val)
                                        }
                                        textContentType="name"
                                        returnKeyType="done"
                                    />
                                </View>
                                <View className="mr-4">
                                    <StyledButton
                                        text="Cancel"
                                        textClass="text-lg"
                                        onPress={() => {
                                            setEditTextInput("");
                                            setShowEditTagBox(false);
                                        }}
                                    />
                                </View>
                                <View className="mr-2">
                                    <StyledButton
                                        text="Save"
                                        textClass="text-lg"
                                        onPress={handleEditTag}
                                    />
                                </View>
                            </View>
                        </View>
                    )}
                </View>
            </ScrollView>
        </PageWrapper>
    );
}
