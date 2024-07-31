import { View } from "react-native";
import Tag from "./tag";
import { TagInfo } from "@/interfaces/community";
import StyledButton from "../common/button";

interface EditTagRowProps {
    tag: TagInfo;
    onEdit: () => void;
    onDelete: () => void;
}

export default function EditTagRow({ tag, onEdit, onDelete }: EditTagRowProps) {
    return (
        <View className="flex-row my-2 items-center justify-between">
            <View className="mr-2">
                <Tag name={tag.name}></Tag>
            </View>
            <View className="mr-2">
                <StyledButton
                    text="Edit"
                    textClass="text-lg"
                    onPress={onEdit}
                />
            </View>
            <View className="mr-2">
                <StyledButton
                    text="Delete"
                    textClass="text-lg"
                    onPress={onDelete}
                />
            </View>
        </View>
    );
}

