import { atomEffect } from "jotai-effect";
import { Appearance } from "react-native";
import { colorSchemeAtom } from "../user";

export const colorSchemeEAtom = atomEffect((get, set) => {
    const scheme = get(colorSchemeAtom);
    Appearance.setColorScheme(scheme == "Auto" ? null : scheme.toLowerCase());
});
