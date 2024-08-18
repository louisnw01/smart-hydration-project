import { ENDPOINTS } from "@/util/fetch";
import { authTokenAtom } from "../user";
import { atomWithMutationCustom, atomWithQueryInfo } from "./common";

export const addCustomCupMAtom = atomWithMutationCustom<{
    size: number;
    name: string;
}>({
    mutationKey: "add-custom-cup",
    endpoint: ENDPOINTS.ADD_CUSTOM_CUP,
});

export const customCupsQAtom = atomWithQueryInfo<
    {
        name: string;
        size: number;
    }[]
>({
    queryKey: "get-custom-cups",
    endpoint: ENDPOINTS.GET_CUSTOM_CUPS,
    enabled: (get) => !!get(authTokenAtom),
});
