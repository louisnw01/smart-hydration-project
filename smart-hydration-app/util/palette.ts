import { useColorScheme } from "react-native";

const darkColorScheme = {
    bg: "rgb(10, 10, 10)",
    fg: "white",
    fglight: "rgb(150, 150, 150)",
    bglight: "rgb(40, 40, 40)",
    border: "rgb(110, 110, 110)",
};

const lightColorScheme = {
    bg: "white",
    fg: "black",
    fglight: "rgb(100, 100, 100)",
    bglight: "rgb(220, 220, 220)",
    border: "rgb(200, 200, 200)",
};

export default function useColorPalette() {
    const scheme = useColorScheme();
    return scheme === "dark" ? darkColorScheme : lightColorScheme;
}
