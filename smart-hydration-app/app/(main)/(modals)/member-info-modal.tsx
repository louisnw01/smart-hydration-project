import useSettings from "@/app/hooks/user";
import Jug from "@/assets/svgs/jug.svg";
import { selectedMemberAtom } from "@/atom/community";
import { selectedDeviceAtom } from "@/atom/device";
import { patientJugDataAtom, removePatientMAtom } from "@/atom/query";
import { unitConverter, unitsAtom } from "@/atom/user";
import StyledButton from "@/components/common/button";
import { ScrollPageWrapper } from "@/components/common/page-wrapper";
import Tag from "@/components/community/tag";
import DeviceSection from "@/components/devices/device-section";
import { useFormattedMemberData } from "@/util/community";
import useColorPalette from "@/util/palette";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { ReactNode, useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { ConfirmModal } from "../settings/remove-member";

function MemberInfoBlock({
    children,
    title,
}: {
    children: ReactNode;
    title: string;
}) {
    return (
        <View className="bg-gray-100 px-5 py-4 rounded-xl dark:bg-neutral-900">
            <Text className="text-xl font-bold dark:text-white">{title}</Text>
            {children}
        </View>
    );
}

export default function MemberInfoModal() {
    const palette = useColorPalette();
    const [member, setSelectedMember] = useAtom(selectedMemberAtom);
    const setJug = useSetAtom(selectedDeviceAtom);
    const memberData = useFormattedMemberData(member);
    const { isCarer } = useSettings();
    const unit = useAtomValue(unitsAtom);

    const { mutate, isPending, isSuccess } = useAtomValue(removePatientMAtom);

    const [modalVisible, setModalVisible] = useState<boolean>(false);

    useEffect(() => {
        if (isPending || !isSuccess) return;
        setModalVisible(false);
        router.back();
    }, [isSuccess]);

    const confirmRemoveMember = () => {
        setModalVisible(true);
    };

    const handleOnReject = () => {
        setModalVisible(false);
    };

    const handleRemoveMember = () => {
        mutate({ id: member.id });
    };

    if (!member) return null;
    return (
        <ScrollPageWrapper className="mt-8 flex gap-6 mx-6 pb-20">
            <View className="flex flex-row justify-between items-center">
                <Text className="dark:text-white text-3xl font-semibold">
                    {memberData.name}
                </Text>
                <Text className="text-neutral-700 font-medium dark:text-gray-300">
                    ID #: {member.id}
                </Text>
            </View>
            <MemberInfoBlock title="Profile Details">
                <Text className="text-xl dark:text-white">
                    Name: {memberData.name}
                </Text>
                <Text className="text-xl dark:text-white">
                    Last drank: {memberData.lastDrank}
                </Text>
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
                        {unitConverter(member.drankToday, unit) | 0} /{" "}
                        {Math.floor(unitConverter(member.dailyTarget, unit))}
                        {unit}
                    </Text>
                    <Text className="text-xl font-semibold dark:text-white">
                        {(
                            (member.drankToday / member.dailyTarget) *
                            100
                        ).toFixed(0)}
                        %
                    </Text>
                </View>
            </MemberInfoBlock>
            <MemberInfoBlock title="Trends Page">
                <Pressable
                    onPress={() => {
                        setSelectedMember(member);
                        router.replace("(tabs)/trends");
                    }}
                >
                    <Text className="text-xl dark:text-white">
                        View Trends for {member.name}
                    </Text>
                </Pressable>
            </MemberInfoBlock>
            <Text className="text-xl font-bold dark:text-white">Devices</Text>
            <DeviceSection
                addJugButton={false}
                queryAtom={patientJugDataAtom}
                onPress={(device) => {
                    setJug(device);
                    router.push("device-info-modal");
                }}
            />
            <MemberInfoBlock title="Room">
                <Text className="text-xl dark:text-white">{member.room}</Text>
            </MemberInfoBlock>
            <StyledButton
                text="Add a Device"
                buttonClass="mt-16 flex flex-row items-center gap-3 rounded-xl px-4 py-3"
                textClass="text-xl dark:text-gray-200"
                icon={
                    <View className="flex flex-row w-6">
                        <Jug width={18} fill={palette.border} />
                        <View className="aboslute top-[13px] right-[9px] w-[8px] h-[8px] rounded-xl bg-gray-200 dark:bg-neutral-800" />
                        <FontAwesome
                            name="plus-circle"
                            size={14}
                            left={-16}
                            top={6}
                            color={palette.border}
                        />
                    </View>
                }
                onPress={() => router.push("add-device-member-modal")}
                chevron
            />
            <StyledButton
                text="Add a Drink"
                buttonClass="flex flex-row items-center gap-3 rounded-xl px-4 py-3"
                textClass="text-xl dark:text-gray-200 -ml-[2px]"
                icon=<MaterialCommunityIcons
                    name="water-plus-outline"
                    size={23}
                    color={palette.border}
                />
                onPress={() => {
                    router.push(`custom/add-drink-modal?id=${member.id}`);
                }}
                chevron
            />
            <StyledButton
                text="Modify Tags"
                buttonClass="flex flex-row items-center gap-3 rounded-xl px-4 py-3"
                textClass="text-xl dark:text-gray-200 -ml-[2px]"
                icon=<MaterialCommunityIcons
                    name="label-multiple-outline"
                    size={23}
                    color={palette.border}
                />
                onPress={() =>
                    router.push({
                        pathname: "apply-tags",
                        params: { member: JSON.stringify(member) },
                    })
                }
                chevron
            />
            <>
                {isCarer && (
                    <StyledButton
                        text="Remove Patient"
                        buttonClass="flex flex-row items-center gap-3 rounded-xl px-4 py-3"
                        textClass="text-xl -ml-[2px] text-red dark:text-red"
                        icon=<FontAwesome
                            name="trash-o"
                            size={18}
                            color="red"
                            left={2}
                        />
                        onPress={confirmRemoveMember}
                    />
                )}
            </>
            <ConfirmModal
                message={`Are you sure you want to remove the patient ${member?.name}?`}
                confirmMessage="Remove"
                onReject={handleOnReject}
                onConfirm={handleRemoveMember}
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
            />
        </ScrollPageWrapper>
    );
}
