import useColorPalette from "@/util/palette";
import { Text } from "react-native";

export default function PageHeader({ children }: { children: string }) {
    const palette = useColorPalette();

    return (
        <Text
            className="font-semibold text-3xl ml-1"
            style={{
                color: palette.fg,
            }}
        >
            {children === "Home" ? "smart hydration" : children}
        </Text>
    );
}
