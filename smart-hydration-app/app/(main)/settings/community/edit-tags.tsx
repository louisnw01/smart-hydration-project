import { View, Text } from "react-native";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import StyledButton from "@/components/common/button";
import EditTagRow from "@/components/community/edit-tag-row";
import StyledTextInput from "@/components/common/text-input";

export interface EditTagsProps {}

export default function EditTags({}: EditTagsProps) {
  const [communityOwner, setCommunityOwner] = useState<string>('');
  const [showNewTagBox, setShowNewTagBox] = useState(false);
  const [showEditTagBox, setShowEditTagBox] = useState(false);
  const [newTextInput, setNewTextInput] = useState("");
  const [editTextInput, setEditTextInput] = useState("");
  const [currentTagName, setCurrentTagName] = useState("");

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
    handleStartup();
  }, []);

  const router = useRouter();
  const [tags, setTags] = useState([
    { name: "independent" },
    { name: "tea" },
    { name: "aggressive" },
    { name: "friendly" },
    { name: "coffee" }
  ]);

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

  const handleAddTag = (tagName: string) => {
    if (tagName !== '') {
      const newTag = { name: tagName };
      setTags([...tags, newTag]);
      setNewTextInput(""); 
      toggleNewTagSection();
    }
  };

  return (
    <View className="flex flex-1 gap-8 mx-16 items-center mt-10">
      <StyledButton
        text="Sort by tag name"
        textClass="text-lg"
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
        <View className="mx-10 bg-gray-400 px-7 py-4 rounded-xl dark:bg-neutral-800">
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
        <View className="mx-10 bg-gray-400 px-7 py-4 rounded-xl dark:bg-neutral-800">
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
  );
}

// Add ScrollView if needed
