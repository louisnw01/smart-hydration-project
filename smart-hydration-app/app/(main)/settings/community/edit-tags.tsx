import { View, Text, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import StyledButton from "@/components/common/button";
import EditTagRow from "@/components/community/edit-tag-row";
import StyledTextInput from "@/components/common/text-input";
import PageWrapper from "@/components/common/page-wrapper";
import { FilterObject, TagInfo } from "@/interfaces/community";
import { createTagMAtom, updateTagMAtom, deleteTagMAtom, communityInfoQAtom } from "@/atom/query/community";
import { useAtomValue } from "jotai";

export interface EditTagsProps { }

export default function EditTags({ }: EditTagsProps) {
  const [communityOwner, setCommunityOwner] = useState<string>('');
  const [showNewTagBox, setShowNewTagBox] = useState(false);
  const [showEditTagBox, setShowEditTagBox] = useState(false);
  const [newTextInput, setNewTextInput] = useState("");
  const [editTextInput, setEditTextInput] = useState("");
  const [currentTagName, setCurrentTagName] = useState("");
  const createTagMutate = useAtomValue(createTagMAtom).mutate;
  const updateTagMutate = useAtomValue(createTagMAtom).mutate;
  const deleteTagMutate = useAtomValue(createTagMAtom).mutate;
  const communityInfo = useAtomValue(communityInfoQAtom); //needed to get name of community
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

  const handleStartup = async () => { };

  useEffect(() => {
    handleStartup();
  }, []);

  const router = useRouter();
  //static data placeholder until we get real data from endpoint
  const [tags, setTags] = useState([
    { name: "independent" },
    { name: "tea" },
    { name: "aggressive" },
    { name: "friendly" },
    { name: "coffee" }
  ]);

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
      const updatedTags = tags.map(tag =>
        tag.name === currentTagName ? { ...tag, name: editTextInput } : tag
      );
      setTags(updatedTags);
      setCurrentTagName("");
      setEditTextInput("");
      setShowEditTagBox(false);
    }
  };

  const handleDeleteTag = (tagName: string) => {
    if (tagName !== '') {
      const filteredArray = tags.filter(item => item.name !== tagName);
      setTags(filteredArray);
    }
  };

  //to do: add logic to stop users adding tags with same name as existing tag in community

  const handleAddTag = (newTagName: string) => {
    if (newTagName !== '') {
      const newTag = { name: newTagName };
      setTags([...tags, newTag]);
      setNewTextInput("");
      toggleNewTagSection();
      createTagMutate({tagName: newTagName, communityName: communityInfo.data.name});
    }
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
          <View className="flex-col justify-start mx-6">
            {tags.map((tag) => (
              <View key={tag.name} className="">
                <EditTagRow tag={tag} onEdit={() => toggleEditTagSection(tag.name)}
                  onDelete={() => handleDeleteTag(tag.name)} />
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
                <Text className="dark:text-white text-xl font-bold">Create new tag</Text>
              </View>
              <View className="flex-row items-center">
                <View className="mr-4">
                  <StyledTextInput
                    value={newTextInput}
                    placeholder="Enter tag name"
                    onChangeText={(val) => setNewTextInput(val)}
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
                <View className="mr-2">
                  <StyledButton
                    text="Create"
                    textClass="text-lg"
                    onPress={() => handleAddTag(newTextInput)}
                  />
                </View>
              </View>
            </View>
          )}
          {showEditTagBox && (
            <View className="mx-10 bg-gray-400 mb-10 px-7 py-4 rounded-xl dark:bg-neutral-800">
              <View className="mb-3">
                <Text className="dark:text-white text-xl font-bold">Edit tag</Text>
                <Text className="dark:text-white text-xl">Current name: {currentTagName}</Text>
              </View>
              <View className="flex-row items-center">
                <View className="mr-4">
                  <StyledTextInput
                    value={editTextInput}
                    placeholder="Enter new tag name"
                    onChangeText={(val) => setEditTextInput(val)}
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
