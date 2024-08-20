import useSettings from "@/app/hooks/user";
import useColorPalette from "@/util/palette";
import { Stack } from "expo-router";
import React from "react";

export default function ManageCommunityLayout() {
    const palette = useColorPalette();
    const { isCarer } = useSettings()
    return (
        <Stack
            screenOptions={{
                contentStyle: {
                    backgroundColor: palette.bg,
                },
                headerTitleStyle: {
                    fontWeight: "bold",
                    color: palette.fg,
                },
                headerStyle: {
                    backgroundColor: palette.bg,
                },
            }}
        >

        </Stack>
    );
}
