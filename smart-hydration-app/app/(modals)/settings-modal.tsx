import { authTokenAtom, colorSchemeAtom } from "@/atom/user";
import OptionBlock from "@/components/common/option-block";
import { useRouter } from "expo-router";
import { atom, useAtomValue, useSetAtom } from "jotai";
import { Appearance, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getItemAsync, setItemAsync, deleteItemAsync } from "expo-secure-store";
import { atomWithStorage, createJSONStorage } from "jotai/vanilla/utils";
import { deleteUser } from "@/atom/query";

export default function SettingsModal() {
    const insets = useSafeAreaInsets();
    const setAuthAtom = useSetAtom(authTokenAtom);

    const { mutate: submitDeleteUser } = useAtomValue(deleteUser);
    const router = useRouter();

    return (
        <View
            className="flex flex-1 justify-between mx-6 mt-6"
            style={{
                paddingBottom: insets.bottom + 20,
            }}
        >
            <View className="gap-5">
                <OptionBlock text="Dark Mode" atom={colorSchemeAtom} />
            </View>
            <View className="gap-5">
                <View className="w-full h-[1px] bg-gray-300 dark:bg-neutral-700" />
                <Pressable
                    className="items-center bg-red rounded-xl px-7 py-3"
                    onPress={() => {
                        setAuthAtom("");
                        router.replace("onboarding/login-register");
                    }}
                >
                    <Text className="text-xl mt-1 text-white">Log Out</Text>
                </Pressable>
                <Pressable
                    className="items-center bg-red rounded-xl px-7 py-3"
                    onPress={() => {
                        submitDeleteUser();
                    }}
                >
                    <Text className="text-xl mt-1 text-white">Delete Account</Text>
                </Pressable>
            </View>
        </View>
    );
}
