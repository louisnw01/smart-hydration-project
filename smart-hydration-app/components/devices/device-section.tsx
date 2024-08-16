import Jug from "@/assets/svgs/jug.svg";

import useColorPalette from "@/util/palette";
import { useQueryRefetch } from "@/util/query-refetch";
import { FontAwesome } from "@expo/vector-icons";
import { Atom, useAtomValue } from "jotai";
import { AtomWithQueryResult } from "jotai-tanstack-query";

import { DeviceInfo } from "@/interfaces/device";
import { FlatList, RefreshControl, View } from "react-native";
import StyledButton from "../common/button";
import Loading from "../common/loading";
import DeviceRow from "./device-row";

export default function DeviceSection({
    addJugButton,
    onPress,
    queryAtom,
    activeColor,
}: {
    addJugButton?: boolean;
    onPress: (device: DeviceInfo) => void;
    queryAtom: Atom<AtomWithQueryResult<DeviceInfo[]>>;
    activeColor?: string;
}) {
    const palette = useColorPalette();
    const { data, isLoading } = useAtomValue(queryAtom);
    const { isRefreshing, handleRefresh } = useQueryRefetch(queryAtom);

    console.log(data);

    if (isLoading) {
        return <Loading message="Getting your jugs..." isLoading />;
    }

    const listItems =
        data?.map((device) => (
            <DeviceRow
                device={device}
                onPress={onPress}
                activeColor={activeColor}
            />
        )) || [];

    if (addJugButton) {
        listItems.push(
            <StyledButton
                text="Add a New Jug"
                href="add-device-modal"
                buttonClass="self-center mt-2"
                textClass="text-lg mt-[1px]"
                icon={
                    <View className="flex flex-row w-6">
                        <Jug width={16} fill={palette.fg} />
                        <View className="aboslute top-[13px] right-[9px] w-[8px] h-[8px] rounded-xl bg-gray-200 dark:bg-black" />
                        <FontAwesome
                            name="plus-circle"
                            size={12}
                            left={-16}
                            top={12}
                            color={palette.fg}
                        />
                    </View>
                }
            />,
        );
    }

    return (
        <FlatList
            contentContainerClassName="gap-6"
            data={listItems}
            renderItem={({ item }) => item}
            keyExtractor={(item, idx) => idx.toString()}
            refreshControl={
                <RefreshControl
                    refreshing={isRefreshing}
                    onRefresh={handleRefresh}
                />
            }
        />
    );
}
