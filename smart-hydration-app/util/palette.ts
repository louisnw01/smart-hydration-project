import { useColorScheme } from "react-native";

const darkColorScheme = {
    bg: "black",
    fg: "white",
    border: "rgb(110, 110, 110)",
};

const lightColorScheme = {
    bg: "white",
    fg: "black",
    border: "rgb(200, 200, 200)",
};

export default function useColorPalette() {
    const scheme = useColorScheme();
    return scheme === "dark" ? darkColorScheme : lightColorScheme;
}
