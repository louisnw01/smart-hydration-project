import { atomEffect } from "jotai-effect";
import { Appearance } from "react-native";
import { colorSchemeAtom } from "../user";

export const colorSchemeEAtom = atomEffect((get, set) => {
    Appearance.setColorScheme(get(colorSchemeAtom) ? "dark" : "light");
});
