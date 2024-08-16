import JugBaseArrow from "@/assets/svgs/jugbase-arrow.svg";
import useColorPalette from "@/util/palette";
import { View } from "react-native";
import Typography from "../common/typography";

export default function JugBaseDiagram() {
    const palette = useColorPalette();
    return (
        <View className="items-center mb-16 mt-16">
            <JugBaseArrow
                fill={palette.fg}
                stroke={palette.fg}
                strokeWidth={1}
            />
            <Typography className="absolute top-20 left-5">
                USER Button
            </Typography>
            <Typography className="absolute top-20 right-2">
                RESET Button
            </Typography>
        </View>
    );
}
