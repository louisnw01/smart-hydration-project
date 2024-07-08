import "../global.css";

import { Provider, useAtomValue, useSetAtom } from "jotai";
import { authTokenAtom } from "@/atom/user";

import { Slot, Stack, useRootNavigationState, useRouter } from "expo-router";
import { useHydrateAtoms } from "jotai/react/utils";
import { queryClientAtom } from "jotai-tanstack-query";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { colorSchemeEAtom } from "@/atom/effect/user";
import { deleteItemAsync, getItemAsync } from "expo-secure-store";
import { request } from "@/util/fetch";
import { useEffect } from "react";

const queryClient = new QueryClient();

const HydrateAtoms = ({ children }: { children: React.ReactNode }) => {
    useHydrateAtoms([[queryClientAtom, queryClient]]);
    return children;
};

// Add this function to the top of wrappedIndex for one run if needed
async function clearStorage() {
    await deleteItemAsync("color-scheme");
}

export default function Index() {
    return (
        <QueryClientProvider client={queryClient}>
            <Provider>
                <HydrateAtoms>
                    <Slot />
                </HydrateAtoms>
            </Provider>
        </QueryClientProvider>
    );
}
