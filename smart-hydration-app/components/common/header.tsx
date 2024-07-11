import { Text } from "react-native";
import { useWaterLevel } from "../home/water-screen";
import useColorPalette from "@/util/palette";

export default function PageHeader({ children }: { children: string }) {
    const palette = useColorPalette();
    const waterLevel = useWaterLevel();
    const underwater = waterLevel && waterLevel > 0.89;

    return (
        <Text
            className="font-semibold text-3xl ml-1"
            style={{
                color: underwater ? "white" : palette.fg,
            }}
        >
            {children === "Home" ? "smart hydration" : children}
        </Text>
    );
}
