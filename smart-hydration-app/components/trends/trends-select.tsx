import useColorPalette from "@/util/palette";
import { Entypo } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { SelectList } from "react-native-dropdown-select-list";

export default function TrendsSelectList({
    setSelectedJugUser,
    communityMembers,
    selectedUser,
}: {
    setSelectedJugUser: (val: any) => void;
    communityMembers: any;
    selectedUser: any;
}) {
    const palette = useColorPalette();
    return (
        <View className="flex-row justify-evenly bg-white dark:bg-black py-4">
            <Text className="pt-4 flex-wrap text-xl font-semibold dark:text-white">
                Patient:
            </Text>
            <SelectList
                arrowicon=<Entypo
                    name="chevron-down"
                    size={24}
                    color={palette.fglight}
                />
                setSelected={(val) => {
                    // gets the memberinfo of the user to be used in historical data atom
                    setSelectedJugUser(
                        communityMembers?.find(
                            (member) =>
                                member.key === parseInt(val?.match(/\d+/)[0]),
                        )?.value || null,
                    );
                }}
                defaultOption={{
                    key: selectedUser?.id?.toString(),
                    value: selectedUser
                        ? selectedUser.name + ": #" + selectedUser.id
                        : "Select a member",
                }}
                data={communityMembers?.map(
                    (items) => items.value.name + ": #" + items.value.id,
                )}
                save="key"
                search={false}
                boxStyles={{
                    borderColor: "rgb(80, 80, 80)",
                }}
                dropdownStyles={{
                    // transform: [{ translateX: -68 }],
                    borderColor: "rgb(80, 80, 80)",
                }}
                dropdownTextStyles={{
                    color: palette.fg,
                }}
                inputStyles={{
                    color: palette.fg,
                    alignSelf: "center",
                }}
            />
        </View>
    );
}
