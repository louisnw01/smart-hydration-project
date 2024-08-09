import { selectedJugsAtom } from "@/atom/device";
import { linkJugMAtom, userJugUserIdAtom } from "@/atom/query";
import StyledButton from "@/components/common/button";
import { router } from "expo-router";
import { useAtomValue } from "jotai";
import { Text, View } from "react-native";

export default function UserOrCommunity() {
    const { mutate: linkJugsToUser } = useAtomValue(linkJugMAtom);
    const usersJugUser = useAtomValue(userJugUserIdAtom);
    const selectedJugs = useAtomValue(selectedJugsAtom);
    function handleYourself() {
        if (selectedJugs === null || !usersJugUser) {
            return;
        }
        linkJugsToUser({
            jugIds: selectedJugs,
            jugUserId: usersJugUser,
        });
        router.back();
        router.back();
    }

    function handleAPatient() {
        router.push("add-device-to-juguser-modal");
    }

    return (
        <View className="flex-col gap-4 px-12 pt-12">
            <Text className="text-center text-4xl font-semibold">
                Who would you like to link this device to?
            </Text>
            <View className="pt-6 gap-4">
                <StyledButton
                    text="Yourself"
                    textClass="w-full text-center text-2xl"
                    onPress={handleYourself}
                />
                <StyledButton
                    text="Someone in your Community"
                    textClass="w-full text-center text-2xl"
                    onPress={handleAPatient}
                />
            </View>
        </View>
    );
}
