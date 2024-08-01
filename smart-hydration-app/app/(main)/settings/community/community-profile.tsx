import {
  OptionBlock,
} from "@/components/common/option-block";
import { useRouter } from "expo-router";
import { atom } from "jotai";
import { SectionList, View } from "react-native";
import { Ionicons,MaterialCommunityIcons,FontAwesome5 } from "@expo/vector-icons";
import { ISettingsSection } from "@/interfaces/settings";

const tempAtom = atom("");

const settingsList: ISettingsSection[] = [
  {
      title: "Community Profile",
      data: [
          {
              name: "Change community Name",
              component: (name, isFirst, isLast) => {
                  const router = useRouter();
                  return (
                      <OptionBlock
                          text={name}
                          isFirst={isFirst}
                          isLast={isLast}
                          onPress={() => router.navigate("settings/community/change-name")}
                          icon={
                              <MaterialCommunityIcons
                                  name="google-circles-communities"
                                  size={19}
                                  color="gray"
                              />
                          }
                      />
                  );
              },
          },
          {
              name: "Transfer Ownership",
              component: (name, isFirst, isLast) => {
                  const router = useRouter();
                  return (
                      <OptionBlock
                          isLast={isLast}
                          isFirst={isFirst}
                          text={name}
                          onPress={() => router.navigate("settings/community/change-owner")}
                          icon={
                              <FontAwesome5
                                  name="user-cog"
                                  size={19}
                                  color="gray"
                              />
                          }
                      />
                  );
              },
          },
      ],
  },
];

export default function CommunityProfile() {
  return (
      <View className="flex flex-1 justify-between mx-4 mt-4">
          <SectionList
              sections={settingsList}
              renderItem={({ item, index, section }) =>
                  item.component(
                      item.name,
                      index == 0,
                      index == section.data.length - 1,
                  )
              }
              keyExtractor={(item) => `settings-community-${item.name}`}
              stickySectionHeadersEnabled={false}
          />
      </View>
  );
}
