import { TagInfo } from "@/interfaces/community";
import { View } from "react-native";
import Tag from "./tag";

//To do: pass props to checkbox to manage state of checkbox, and associate this state in this component with appropriate tag

export default function ApplyTagSection({ tag }: { tag: TagInfo }) {
    return (
        <View className="flex-row my-2 items-center">
            <Tag name={tag.name}></Tag>
        </View>
    );
}
