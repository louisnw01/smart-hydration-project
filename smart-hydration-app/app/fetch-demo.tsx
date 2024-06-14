import { helloWorldQAtom } from "@/atom/query";
import { useAtom } from "jotai";
import { Button, Text } from "react-native";

export default function FetchDemo() {
    const [{ data, isLoading, isError, refetch }] = useAtom(helloWorldQAtom);

    let text;
    if (isLoading) {
        text = 'Loading...'
    } else if (isError) {
        text = 'Error loading data'
    } else {
        text = data.message;
    }
    return (
        <>
            <Text className="text-xl font-bold">{text}</Text>
            <Button onPress={() => refetch()} title="refetch data" />
        </>
    )
}