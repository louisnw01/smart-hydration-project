import PageWrapper from "@/components/common/page-wrapper";
import { RefreshControl, ScrollView, View } from "react-native";
import { useAtomValue } from "jotai";
import { getJugDataQAtom } from "@/atom/query";
import DeviceRow from "@/components/devices/device-row";
import { useState } from "react";
import StyledButton from "@/components/common/button";
import Loading from "@/components/common/loading";
import Jug from "@/assets/svgs/jug.svg";
import useColorPalette from "@/util/palette";
import { FontAwesome } from "@expo/vector-icons";
import { authTokenAtom } from "@/atom/user";

export default function DevicesPage() {
    const palette = useColorPalette();
    const { data, isLoading, refetch } = useAtomValue(getJugDataQAtom);
    const [refreshing, setRefreshing] = useState(false);

    const handleRefresh = () => {
        setRefreshing(true);
        refetch();
    };

    if (!isLoading && refreshing) {
        setRefreshing(false);
    }

    return (
        <PageWrapper>
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                    />
                }
            >
                <View className="mt-8 flex gap-6">
                    <Loading
                        isLoading={isLoading}
                        message="Getting your jugs.."
                    />

                    {data &&
                        data.map((device, idx) => (
                            <DeviceRow key={idx} device={device} />
                        ))}

                    <StyledButton
                        text="add a new jug"
                        href="add-device-modal"
                        buttonClass="self-center mt-8"
                        textClass="text-lg mt-[1px]"
                        icon={<View className="flex flex-row w-6">
                            <Jug width={16} fill={palette.fg} />
                            <View className="aboslute top-[13px] right-[9px] w-[8px] h-[8px] rounded-xl bg-gray-200 dark:bg-black" />
                            <FontAwesome
                                name="plus-circle"
                                size={12}
                                left={-16}
                                top={12}
                                color={palette.fg} />
                        </View>} children={undefined}                    />

                    {/* <View className="flex flex-row justify-center">
                        <StyledButton
                            text="+ add a new jug user"
                            href="add-jug-user"
                            textSize="lg"
                        />
                    </View> */}
                </View>
            </ScrollView>
        </PageWrapper>
    );
}
