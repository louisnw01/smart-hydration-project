import Jug from "@/assets/svgs/jug.svg";
import { getJugDataQAtom } from "@/atom/query";
import useColorPalette from "@/util/palette";
import { useQueryRefetch } from "@/util/query-refetch";
import { FontAwesome } from "@expo/vector-icons";
import { useAtomValue } from "jotai";
import { FlatList, RefreshControl, View } from "react-native";
import StyledButton from "../common/button";
import Loading from "../common/loading";
import DeviceRow from "./device-row";

export default function DeviceSection({
    addJugButton,
    onPress,
}: {
    addJugButton?: boolean;
    onPress: Function;
}) {
    const palette = useColorPalette();
    const { data, isLoading } = useAtomValue(getJugDataQAtom);
    const { isRefreshing, handleRefresh } = useQueryRefetch(getJugDataQAtom);

    if (isLoading) {
        return <Loading message="Getting your jugs..." isLoading />;
    }

    const listItems =
        data?.map((device) => (
            <DeviceRow
                device={device}
                onPress={(device) => {
                    onPress(device);
                }}
            />
        )) || [];

    if (addJugButton) {
        listItems.push(
            <StyledButton
                text="add a new jug"
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
            keyExtractor={(item, idx) => idx}
            refreshControl={
                <RefreshControl
                    refreshing={isRefreshing}
                    onRefresh={handleRefresh}
                />
            }
        />
    );
}
