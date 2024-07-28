import colors from "@/colors";

import { ReactNode } from "react";
import { View, Text, Pressable } from "react-native";
import { useAtomValue, useSetAtom } from "jotai";
import { useRouter } from "expo-router";
import Tag from "./tag";
import { TagInfo } from "@/interfaces/community";
import Checkbox from "../onboarding/checkbox";

//To do: pass props to checkbox to manage state of checkbox, and associate this state in this component with appropriate tag

export default function ApplyTagRow({ tag }: { tag: TagInfo }) {
    return (
        <View className="flex-row my-2 items-center">
            <Checkbox></Checkbox>
            <Tag name={tag.name}></Tag>
        </View>
    );
}



