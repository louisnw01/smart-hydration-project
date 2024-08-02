import Jug from "@/assets/svgs/jug.svg";
import { selectedMemberAtom } from "@/atom/community";
import StyledButton from "@/components/common/button";
import { ScrollPageWrapper } from "@/components/common/page-wrapper";
import useColorPalette from "@/util/palette";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { useAtomValue, useSetAtom } from "jotai";
import { Text, View } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import DeviceSection from "@/components/devices/device-section";
import { getPatientJugDataQAtom } from "@/atom/query";
import { selectedJugIdAtom } from "@/atom/device";
import Tag from "@/components/community/tag";

function MemberInfoBlock({ children, title }) {
    return (
        <View className="bg-gray-100 px-5 py-4 rounded-xl dark:bg-neutral-900">
            <Text className="text-xl font-bold dark:text-white">{title}</Text>
            {children}
        </View>
    );
}

export default function MemberInfoModal() {
    const palette = useColorPalette();
    const insets = useSafeAreaInsets();
    const member = useAtomValue(selectedMemberAtom);
    const setJugId = useSetAtom(selectedJugIdAtom);
    return (
        <ScrollPageWrapper
            className="mt-8 flex gap-6 mx-6 pb-20"
            style={{
                paddingBottom: insets.bottom,
            }}
        >
            <Text className="dark:text-white text-3xl font-semibold">
                {member.name}
            </Text>

            <MemberInfoBlock title="Profile Details">
                <Text className="text-xl dark:text-white">
                    Name: {member.name}
                </Text>
                <Text className="text-xl dark:text-white">Jugs</Text>
                <Text className="text-xl dark:text-white">Last drank</Text>
                {member.tags && member.tags.length > 0 && (
                    <View className="flex-row flex-wrap my-2">
                        {member.tags.map((tag) => (
                            <Tag key={tag.id} name={tag.name} />
                        ))}
                    </View>
                )}
            </MemberInfoBlock>
            <MemberInfoBlock title="Progress to Target">
                <View className="flex-row justify-between">
                    <Text className="text-xl dark:text-white">
                        {member.drank_today | 0} / {member.target}ml
                    </Text>
                    <Text className="text-xl font-semibold dark:text-white">
                        {((member.drank_today / member.target) * 100).toFixed(
                            0,
                        )}
                        %
                    </Text>
                </View>
            </MemberInfoBlock>

            <MemberInfoBlock title="Trends Page">
                <Text className="text-xl dark:text-white">
                    Embed graph here
                </Text>
            </MemberInfoBlock>

            <Text className="text-xl font-bold dark:text-white">Devices</Text>
            <DeviceSection
                addJugButton={false}
                queryAtom={getPatientJugDataQAtom}
                onPress={(device) => {
                    setJugId(device.id);
                    router.push("device-info-modal");
                }}
            />

            <MemberInfoBlock title="Favourite Drink">
                <Text className="text-xl dark:text-white">Tea</Text>
            </MemberInfoBlock>

            <MemberInfoBlock title="Location">
                <Text className="text-xl dark:text-white">Room 101</Text>
            </MemberInfoBlock>

            <StyledButton
                text="Add a Device"
                buttonClass="mt-16 flex flex-row items-center gap-3 rounded-xl px-4 py-3 bg-gray-100 dark:bg-neutral-900"
                textClass="text-xl dark:text-gray-200"
                icon={
                    <View className="flex flex-row w-6">
                        <Jug width={18} fill={palette.fg} />
                        <View className="aboslute top-[13px] right-[9px] w-[8px] h-[8px] rounded-xl bg-gray-200 dark:bg-black" />
                        <FontAwesome
                            name="plus-circle"
                            size={14}
                            left={-16}
                            top={6}
                            color={palette.fg}
                        />
                    </View>
                }
                onPress={() => router.push("add-device-member-modal")}
            />

            <StyledButton
                text="Add a Drink"
                buttonClass="flex flex-row items-center gap-3 rounded-xl px-4 py-3 bg-gray-100 dark:bg-neutral-900"
                textClass="text-xl dark:text-gray-200 -ml-[2px]"
                icon=<MaterialCommunityIcons
                    name="water-plus-outline"
                    size={23}
                    color={palette.fg}
                />
                onPress={() => router.push("edit-device-name-modal")}
            />

            <StyledButton
                text="Modify Tags"
                buttonClass="flex flex-row items-center gap-3 rounded-xl px-4 py-3 bg-gray-100 dark:bg-neutral-900"
                textClass="text-xl dark:text-gray-200 -ml-[2px]"
                icon=<MaterialCommunityIcons
                    name="water-plus-outline"
                    size={23}
                    color={palette.fg}
                />
                onPress={() =>
                    router.push({
                        pathname: "apply-tags",
                        params: { member: JSON.stringify(member) },
                    })
                }
            />
        </ScrollPageWrapper>
    );
}
