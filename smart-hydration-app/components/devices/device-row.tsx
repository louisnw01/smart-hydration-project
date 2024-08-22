import { patientInfoQAtom, userJugUserIdAtom } from "@/atom/query";
import { unitConverter, unitsAtom } from "@/atom/user";
import colors from "@/colors";
import { DeviceInfo } from "@/interfaces/device";
import useColorPalette from "@/util/palette";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useAtomValue } from "jotai";
import { ReactNode, useState } from "react";
import { Pressable, Text, View } from "react-native";

export default function DeviceRow({
    device,
    onPress,
    activeColor,
}: {
    device: DeviceInfo;
    onPress: Function;
    activeColor?: string;
}) {
    const percentFull = (device.water_level / device.capacity) * 100;
    const isStale = false;
    // const isActive = useAtomValue(selectedDeviceAtom)?.id == device.id;
    const [isActive, setIsActive] = useState(false);
    const { data } = useAtomValue(patientInfoQAtom);
    const userJugUserId = useAtomValue(userJugUserIdAtom);
    const unit = useAtomValue(unitsAtom);

    let person;

    if (device.jugUserId == null) {
        person = "Unassigned";
    } else if (userJugUserId == device.jugUserId) {
        person = "You";
    } else if (data) {
        const member = data.find((member) => member.id == device.jugUserId);
        if (member) person = member?.name;
    }

    return (
        <Pressable
            className="bg-gray-200 px-7 py-4 flex flex-row justify-between rounded-xl dark:bg-neutral-800"
            onPress={() => {
                setIsActive(!isActive);
                onPress(device);
            }}
            style={
                isActive && activeColor
                    ? { backgroundColor: activeColor }
                    : undefined
            }
        >
            <View className="flex">
                <Text className="text-xl font-bold dark:text-white">
                    {device.name}
                </Text>
                <View className="flex-row gap-3">
                    <Text className="dark:text-white">{person}</Text>
                    <BatteryIndicator
                        charge={device.battery}
                        charging={device.charging}
                    />
                </View>
            </View>
            <View className="flex justify-evenly">
                <EndText>
                    {percentFull.toFixed(0)}% full (
                    {Math.floor(unitConverter(device.water_level, unit))}
                    {unit})
                </EndText>
                <EndText className="text-red-500">
                    {isStale && "water is stale"}
                </EndText>
            </View>
        </Pressable>
    );
}

function EndText({
    children,
    className,
}: {
    children: ReactNode;
    className?: string;
}) {
    const style =
        "font-semibold text-right dark:text-white " + (className ?? "");
    return <Text className={style}>{children}</Text>;
}

function BatteryIndicator({
    charge,
    charging,
}: {
    charge: number;
    charging: boolean;
}) {
    const scaledCharge = (charge / 5.714) * 100;
    const palette = useColorPalette();

    return (
        <View className="flex-row h-full gap-2">
            <View
                className="absolute h-3 my-1"
                style={{
                    borderRadius: 2,
                    marginLeft: 1,
                    width: scaledCharge,
                    backgroundColor: charge >= 0.3 ? colors.green : colors.red,
                }}
            />
            <View className="-mb-3">
                <Ionicons
                    name="battery-dead"
                    size={23}
                    bottom={3}
                    color={palette.fg}
                />
            </View>

            <Text className="dark:text-white">
                {(charge * 100).toFixed(0)}%
            </Text>

            {charging && (
                <MaterialIcons
                    name="electric-bolt"
                    size={15}
                    top={1}
                    right={4}
                    color={palette.fg}
                />
            )}
        </View>
    );
}
