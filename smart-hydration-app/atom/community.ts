import { MemberInfo } from "@/interfaces/community";
import { atom } from "jotai";

import { ENDPOINTS, request } from "@/util/fetch";
import {
    atomWithMutation,
    atomWithQuery,
    queryClientAtom,
} from "jotai-tanstack-query";
import { authTokenAtom } from "./user";
import { DeviceInfo } from "@/interfaces/device";
import { userInfoQAtom } from "./query";

export const membersAtom = atom(new Map());
export const selectedJugsForMemberAtom = atom<Set<string>>(new Set<string>());
export const selectedMemberAtom = atom<Partial<MemberInfo>>({});
export const selectedCommunityMemberAtom = atom(0);
export const selectedSortMethodAtom = atom<string>("1");

