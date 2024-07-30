import Jug from "@/assets/svgs/jug.svg";
import { selectedMemberAtom } from "@/atom/community";
import StyledButton from "@/components/common/button";
import { ScrollPageWrapper } from "@/components/common/page-wrapper";
import useColorPalette from "@/util/palette";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { useAtomValue } from "jotai";
import { Text, View } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
                <Text className="text-xl dark:text-white">Name</Text>
                <Text className="text-xl dark:text-white">Jugs</Text>
                <Text className="text-xl dark:text-white">Last drank</Text>
                <Text className="text-xl dark:text-white">Tags</Text>
            </MemberInfoBlock>
            <MemberInfoBlock title="Progress to Target">
                <Text className="text-xl dark:text-white">
                    Data here (tap to read more)
                </Text>
            </MemberInfoBlock>

            <MemberInfoBlock title="Trends Page">
                <Text className="text-xl dark:text-white">
                    Embed graph here
                </Text>
            </MemberInfoBlock>

            <MemberInfoBlock title="Devices Page">
                <Text className="text-xl dark:text-white">
                    Embed graph here
                </Text>
            </MemberInfoBlock>

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
        </ScrollPageWrapper>
    );
}
