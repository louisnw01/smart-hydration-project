import JugIcon from "@/assets/svgs/jug.svg";
import { selectedDeviceAtom, selectedJugsAtom } from "@/atom/device";
import { unlinkJugMAtom, userHasCommunityAtom } from "@/atom/query";
import colors from "@/colors";
import StyledButton from "@/components/common/button";
import useColorPalette from "@/util/palette";
import {
    Entypo,
    FontAwesome,
    MaterialCommunityIcons,
} from "@expo/vector-icons";
import { router } from "expo-router";
import { useAtomValue, useSetAtom } from "jotai";
import { ReactNode, useEffect } from "react";
import { Text, View } from "react-native";

function Container({
    children,
    right,
    fillVertical,
    fillHorizontal,
    color,
    amount,
}: {
    children: ReactNode;
    right?: boolean;
    fillVertical?: boolean;
    fillHorizontal?: boolean;
    color?: string;
    amount?: number;
}) {
    let className =
        "bg-gray-100 flex-1 justify-between h-24 rounded-xl my-2 overflow-hidden px-4 py-4 dark:bg-neutral-800";
    // removed px-4 py-4
    className += right ? " ml-2" : " mr-2";

    const scaleAmount = fillVertical ? 150 : 100;

    return (
        <View className={className}>
            {amount !== null && (
                <View
                    className="absolute bottom-0 left-0"
                    style={{
                        backgroundColor: color,
                        height:
                            amount && fillVertical
                                ? amount * scaleAmount + "%"
                                : amount && fillHorizontal
                                  ? "150%"
                                  : undefined,
                        width:
                            amount && fillHorizontal
                                ? amount * scaleAmount + "%"
                                : amount && fillVertical
                                  ? "120%"
                                  : undefined,
                    }}
                />
            )}
            {children}
        </View>
    );
}

export default function DeviceInfoModal() {
    const device = useAtomValue(selectedDeviceAtom);
    const setSelectedJugs = useSetAtom(selectedJugsAtom);
    const palette = useColorPalette();
    const {
        mutate: unlinkJug,
        isPending,
        isSuccess,
    } = useAtomValue(unlinkJugMAtom);
    const userHasCommunity = useAtomValue(userHasCommunityAtom);

    useEffect(() => {
        if (isPending || !isSuccess) return;
        router.back();
    });
    if (!device) return;
    return (
        <View className="mt-8 mx-5">
            <View className="flex-row justify-between items-center">
                <View className="flex-row gap-3">
                    <JugIcon
                        width={17}
                        height={17}
                        top={7}
                        fill={palette.border}
                    />
                    <Text className="text-3xl font-semibold dark:text-white">
                        {device.name}
                    </Text>
                </View>
                <Text className="dark:text-gray-400">{device.id}</Text>
            </View>

            <View className="flex flex-row mt-12">
                <Container fillVertical amount={0.3} color="orange">
                    <Text className="dark:text-white">Temperature</Text>
                    <Text className="text-4xl dark:text-white">
                        {device.temperature && device.temperature.toFixed(1)}C
                    </Text>
                </Container>
                <Container
                    right
                    fillVertical
                    amount={
                        device.water_level &&
                        device.capacity &&
                        device.water_level / device.capacity
                    }
                    color={colors.blue}
                >
                    <Text className="dark:text-white">Water Level</Text>
                    <Text className="text-4xl dark:text-white">
                        {device.water_level}ml
                    </Text>
                </Container>
            </View>
            <View className="flex flex-row">
                <Container
                    fillHorizontal
                    amount={device.battery}
                    color={colors.green}
                >
                    <Text className="dark:text-white">Battery</Text>
                    <Text className="text-4xl dark:text-white">
                        {device.battery && (device.battery * 100).toFixed(0)}%
                    </Text>
                </Container>
                <Container right>
                    <Text className="dark:text-white">Last Connected</Text>
                    <Text className="text-1xl dark:text-white">
                        {new Date(device.last_seen * 1000).toLocaleString(
                            "en-gb",
                            {
                                // year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                                // timeStyle: "medium",
                            },
                        )}
                    </Text>
                </Container>
            </View>

            <View className="flex mt-56 gap-3">
                <StyledButton
                    text="Change Device Name"
                    buttonClass="flex flex-row items-center gap-3 rounded-xl px-4 py-3 bg-gray-100 dark:bg-neutral-900"
                    textClass="text-xl dark:text-gray-200"
                    icon=<Entypo
                        name="pencil"
                        size={17}
                        color={palette.border}
                    />
                    onPress={() => router.push("edit-device-name-modal")}
                />
                {userHasCommunity && (
                    <StyledButton
                        text="Change Device Jug User"
                        buttonClass="flex flex-row items-center gap-3 rounded-xl px-4 py-3 bg-gray-100 dark:bg-neutral-900"
                        textClass="text-xl dark:text-gray-200"
                        icon=<MaterialCommunityIcons
                            name="monitor-edit"
                            size={17}
                            color={palette.border}
                        />
                        onPress={() => {
                            setSelectedJugs([device.id]);
                            router.push("add-device-to-juguser-modal");
                        }}
                    />
                )}
                <StyledButton
                    text="Remove Device"
                    buttonClass="mt-5 flex flex-row items-center gap-4 rounded-xl px-4 py-3 bg-gray-100 dark:bg-neutral-900"
                    textClass="text-xl text-red"
                    icon=<FontAwesome
                        name="trash-o"
                        size={18}
                        color="red"
                        left={2}
                    />
                    onPress={() => {
                        device.id &&
                            unlinkJug({
                                jugId: device.id,
                                jugUserId: device.jugUserId,
                            });
                    }}
                    isLoading={isPending}
                    keepTextWhileLoading
                />
            </View>
        </View>
    );
}
