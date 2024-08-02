import { communityNameAtom } from "@/atom/query/community";
import useColorPalette from "@/util/palette";
import { useAtomValue } from "jotai";
import { Text } from "react-native";

export default function PageHeader({ children }: { children: string }) {
    const palette = useColorPalette();
    const communityName = useAtomValue(communityNameAtom);
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
                  ? communityName
                  : children}
        </Text>
    );
}
