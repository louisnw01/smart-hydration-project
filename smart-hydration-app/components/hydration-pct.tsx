import { Text } from "react-native";
import { hydrationAtom } from "@/atom/hydration";
import { useAtomValue } from "jotai";

export default function HydrationPercentage() {
const hydration = useAtomValue(hydrationAtom);
    return (
        <Text className= "w-full text-center text-8xl font-semibold dark:text-white">
            {hydration}%
        </Text>
    )
}