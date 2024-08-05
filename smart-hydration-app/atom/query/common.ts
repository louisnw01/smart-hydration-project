import { request } from "@/util/fetch";
import { QueryClient } from "@tanstack/query-core";
import { Atom, atom, Getter } from "jotai";
import {
    atomWithMutation,
    atomWithQuery,
    AtomWithQueryResult,
    queryClientAtom,
} from "jotai-tanstack-query";
import { authTokenAtom } from "../user";

interface GenericTanstackParams {
    endpoint: string;
    enabled?: (get: Getter) => boolean;
}

// A generic atomWithQuery, which does all of the standard operations we do
// for all
// eg call request, if !response throw error with detail, return json.
//
// enabled will default to authTokenAtom, but can be given a custom lambda
// that returns a boolean
interface QueryInfoParams extends GenericTanstackParams {
    queryKey: string;
    staleTime?: number;
    initialData?: any;
}
export function atomWithQueryInfo<T>({
    queryKey,
    endpoint,
    enabled,
    staleTime,
    initialData,
}: QueryInfoParams) {
    return atomWithQuery<T>((get) => ({
        queryKey: [queryKey, get(authTokenAtom)],
        queryFn: async ({ queryKey: [, token] }) => {
            const response = await request(endpoint, {
                auth: token as string,
            });
            if (!response.ok) {
                throw new Error();
            }

            return await response.json();
        },
        enabled: enabled ? enabled(get) : !!get(authTokenAtom),
        staleTime,
        initialData,
    }));
}
//
//  This is used if you just want a single piece of data from a query atom
//
export function atomWithQueryDerivation<T, Result>(
    queryAtom: Atom<AtomWithQueryResult<Result, Error>>,
    deriverFunction: (obj: Result) => T,
) {
    return atom((get) => {
        const { data, isLoading } = get(queryAtom);
        if (isLoading || !data) return;
        return deriverFunction(data);
    });
}

//
// generic atomWithMutation, specific to our usecase
//
interface MutationCustomParams<T> extends GenericTanstackParams {
    mutationKey: string;
    onSuccess?: (get: Getter, queryClient: QueryClient, form: T) => void;
    body?: (get: Getter) => any;
}
export function atomWithMutationCustom<
    T extends { [key: string]: unknown } | void,
>({
    mutationKey,
    endpoint,
    enabled,
    onSuccess,
    body,
}: MutationCustomParams<T>) {
    return atomWithMutation<void, T, Error>((get) => ({
        mutationKey: [mutationKey, get(authTokenAtom)],
        mutationFn: async (form: T) => {
            const token = get(authTokenAtom);
            const response = await request(endpoint, {
                method: "post",
                body: body ? body(get) : form,
                auth: token as string,
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.detail);
            }
        },
        onSuccess: (data, form) => {
            if (!onSuccess) return;
            const queryClient = get(queryClientAtom);
            onSuccess(get, queryClient, form);
        },
        enabled: enabled ? enabled(get) : !!get(authTokenAtom),
    }));
}
