import { ReactNode } from "react";
import { View, Text, Pressable } from "react-native";
import { useAtomValue } from "jotai";
import { unlinkJugFromUserMAtom } from "@/atom/query";
import { useRouter } from "expo-router";
import { selectedDeviceAtom } from "@/atom/device";
import colors from "@/colors";


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
        "bg-gray-100 flex-1 justify-between h-24 rounded-xl my-2 overflow-hidden px-4 py-4";
    // removed px-4 py-4
    className += right ? " ml-2" : " mr-2";

    const scaleAmount = fillVertical ? 150 : 100;
    
    return (
        <View className={className}>
            {amount !== null && (
                // <Svg>
                //     <Defs>
                //         <ClipPath id="clip">
                //             <Rect x="0" y="0" width={`100%`} height="55%" />
                //         </ClipPath>
                //     </Defs>

                //     <Rect
                //         x="0"
                //         y="0"
                //         width={`100%`}
                //         height="55%"
                //         fill={colors.blue}
                //     />
                //     <SvgText fill="rgb(100, 100, 100)">
                //         <TSpan fontSize="25" x="0" y="50">
                //             355ml
                //         </TSpan>
                //     </SvgText>
                //     <SvgText fill="white" clipPath="url(#clip)">
                //         <TSpan fontSize="25" x="0" y="50">
                //             355ml
                //         </TSpan>
                //     </SvgText>
                // </Svg>
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
    const router = useRouter();
    const device = useAtomValue(selectedDeviceAtom);
    const { mutate: unlinkJugFromUser } = useAtomValue(unlinkJugFromUserMAtom);

    if (!device) return;
    return (
        <View className="mt-16 mx-5">
            <View className="flex-row justify-between">
                <View className="flex-row">
                    {/* <Text className="text-xs">jug icon</Text> */}
                    <Text className="text-3xl font-semibold">
                        {device.name}
                    </Text>
                </View>
                <Text>pen</Text>
            </View>

            <View className="flex flex-row mt-12">
                <Container fillVertical amount={0.3} color="orange">
                    <Text>Temperature</Text>
                    <Text className="text-4xl">
                        {device.temperature && device.temperature.toFixed(1)}C
                    </Text>
                </Container>
                <Container
                    right
                    fillVertical
                    amount={(device.water_level && device.capacity) && (device.water_level / device.capacity)}
                    color={colors.blue}
                >
                    <Text>Water Level</Text>
                    <Text className="text-4xl">{device.water_level}ml</Text>
                </Container>
            </View>
            <View className="flex flex-row">
                <Container fillHorizontal amount={0.5} color={colors.green}>
                    <Text>Battery</Text>
                    <Text className="text-4xl">
                        {device.battery && (device.battery * 100).toFixed(0)}%
                    </Text>
                </Container>
                <Container right>
                    <Text>Last Connected</Text>
                    <Text className="text-3xl">todo</Text>
                </Container>
            </View>

            <View className="flex mt-72 gap-3">
                <Pressable
                    className="bg-gray-100 px-4 py-3 rounded-xl items-center"
                    onPress={() => {
                        router.push("edit-device-name-modal");
                    }}
                >
                    <Text className="text-xl">Change Device Name</Text>
                </Pressable>
                <Pressable
                    className="bg-gray-100 px-4 py-3 rounded-xl items-center"
                    onPress={() => {
                        alert("todo: edit device user");
                    }}
                >
                    <Text className="text-xl">Change Device Jug User</Text>
                </Pressable>

                <Pressable
                    className="bg-gray-100 px-4 py-3 rounded-xl items-center mt-5"
                    onPress={() => {
                        device.id && unlinkJugFromUser(device.id);
                        router.back();
                    }}
                >
                    <Text className="text-xl text-red">Remove Device</Text>
                </Pressable>
            </View>
        </View>
    );
}
