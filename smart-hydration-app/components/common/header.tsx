import { communityNameAtom } from "@/atom/query";
import useColorPalette from "@/util/palette";
import { useAtomValue } from "jotai";
import { Dimensions } from "react-native";
import { Text } from "react-native";

export default function PageHeader({ children }: { children: string }) {
    const palette = useColorPalette();
    const communityName = useAtomValue(communityNameAtom);
    const screenSizeCutoff = Dimensions.get("screen").height > 667 ? 15 : 13;

    return (
        <Text
            className="font-semibold text-3xl ml-1"
            style={{
                color: palette.fg,
            }}
        >
            {children === "Home"
                ? "smart hydration"
                : children == "Community" && communityName
                  ? communityName.length > screenSizeCutoff
                      ? communityName.substring(0, screenSizeCutoff - 1) + "..."
                      : communityName
                  : children}
        </Text>
    );
}
