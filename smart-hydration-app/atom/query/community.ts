import {
    CommunityInfo,
    CommunityUser,
    MemberInfo,
    TagInfo,
} from "@/interfaces/community";
import { UserInfo } from "@/interfaces/user";
import { ENDPOINTS } from "@/util/fetch";
import { jugUserInfoAtom } from "../jug-user";
import { authTokenAtom, inviteCodeAtom } from "../user";
import {
    atomWithMutationCustom,
    atomWithQueryDerivation,
    atomWithQueryInfo,
} from "./common";

export const communityInfoQAtom = atomWithQueryInfo<CommunityInfo>({
    queryKey: "get-community-info",
    endpoint: ENDPOINTS.COMMUNITY_INFO,
    enabled: (get) => !!get(authTokenAtom),
});

export const userHasCommunityAtom = atomWithQueryDerivation(
    communityInfoQAtom,
    (data) => !!data.name,
);

export const communityNameAtom = atomWithQueryDerivation(
    communityInfoQAtom,
    (data) => data.name,
);

export const userIsCommunityOwnerAtom = atomWithQueryDerivation(
    communityInfoQAtom,
    (data) => data.isOwner,
);

export const patientInfoQAtom = atomWithQueryInfo<MemberInfo[]>({
    queryKey: "get-patient-info",
    endpoint: ENDPOINTS.PATIENT_INFO,
    enabled: (get) => !!get(authTokenAtom) && !!get(userHasCommunityAtom),
});

export const createCommunityMAtom = atomWithMutationCustom<{ name: string }>({
    mutationKey: "create-community",
    endpoint: ENDPOINTS.CREATE_COMMUNITY,
    onSuccess: (get, qc, form) => {
        qc.setQueryData(["get-community-info", get(authTokenAtom)], {
            name: form.name,
            isOwner: true,
        });
    },
});

export const updateCommunityMAtom = atomWithMutationCustom<{ name: string }>({
    mutationKey: "update-community",
    endpoint: ENDPOINTS.UPDATE_COMMUNITY,
});

export const deleteCommunityMAtom = atomWithMutationCustom({
    mutationKey: "delete-community",
    endpoint: ENDPOINTS.DELETE_COMMUNITY,
    onSuccess: (get, qc) => {
        const authToken = get(authTokenAtom);
        qc.setQueryData(["get-community-users", authToken], () => []);
        qc.setQueryData(["get-community-info", authToken], () => null);
        qc.setQueryData<UserInfo>(
            ["user-info", authToken],
            (prev) =>
                ({
                    ...prev,
                    has_community: false,
                }) as UserInfo,
        );
        qc.setQueryData(["get-patient-info", authToken], []);
    },
});

export const communityInviteLinkQAtom = atomWithQueryInfo({
    queryKey: "community-invite-link",
    endpoint: ENDPOINTS.COMMUNITY_GENERATE_INVITE,
    enabled: (get) => !!get(authTokenAtom), // && !!get(userIsCommunityOwnerAtom),
    staleTime: 0,
    initialData: undefined,
});

export const joinCommunityMAtom = atomWithMutationCustom({
    mutationKey: "join-community",
    endpoint: ENDPOINTS.JOIN_COMMUNITY,
    body: (get) => ({ code: get(inviteCodeAtom) }),
    onSuccess: (get, qc, form) => {
        qc.invalidateQueries({ queryKey: ["get-community-info"] });
        qc.invalidateQueries({ queryKey: ["get-patient-info"] });
    },
});

export const communityUsersQAtom = atomWithQueryInfo<CommunityUser[]>({
    queryKey: "get-community-users",
    endpoint: ENDPOINTS.COMMUNITY_USERS,
    enabled: (get) => !!get(authTokenAtom) && !!get(userHasCommunityAtom),
});

export const deleteCommunityMemberMAtom = atomWithMutationCustom<{
    id: number;
}>({
    mutationKey: "delete-community-member",
    endpoint: ENDPOINTS.DELETE_COMMUNITY_MEMBER,
    onSuccess: (get, qc, form) => {
        qc.setQueryData<{ id: number }[]>(
            ["get-community-users", get(authTokenAtom)],
            (prev) => prev?.filter((member) => member.id != form.id),
        );
    },
});

export const leaveCommunityMAtom = atomWithMutationCustom({
    mutationKey: "leave-community",
    endpoint: ENDPOINTS.LEAVE_COMMUNITY,
    onSuccess: (get, qc, form) => {
        qc.invalidateQueries({ queryKey: ["get-community-info"] });
        qc.invalidateQueries({ queryKey: ["get-patient-info"] });
    },
});

export const communityNameQAtom = atomWithQueryInfo<string>({
    queryKey: "name-from-link",
    endpoint: ENDPOINTS.NAME_FROM_LINK,
    query: (get) => ({ code: get(inviteCodeAtom) }),
    enabled: (get) => !!get(authTokenAtom) && !!get(inviteCodeAtom),
});

// export const linkJugsToCommunityMemberMAtom = atomWithMutationCustom<{
//     jugIds: string[];
//     communityMember: number;
// }>({
//     mutationKey: "/community/link-jug-to-member",
//     endpoint: ENDPOINTS.LINK_JUG_TO_COMMUNITY_MEMBER,
// });

export const createTagMAtom = atomWithMutationCustom<{
    tagName: string;
}>({
    mutationKey: "create-tag",
    endpoint: ENDPOINTS.CREATE_TAG,
});

export const updateTagMAtom = atomWithMutationCustom<{
    currentName: string;
    newName: string;
}>({
    mutationKey: "update-tag",
    endpoint: ENDPOINTS.UPDATE_TAG,
});

export const deleteTagMAtom = atomWithMutationCustom<{
    tagName: string;
}>({
    mutationKey: "delete-tag",
    endpoint: ENDPOINTS.DELETE_TAG,
});

export const communityTagsQAtom = atomWithQueryInfo<TagInfo[]>({
    queryKey: "get-community-tags",
    endpoint: ENDPOINTS.COMMUNITY_TAGS,
    enabled: (get) => !!get(authTokenAtom) && !!get(userHasCommunityAtom),
});

export const createJugUserMAtom = atomWithMutationCustom({
    mutationKey: "/jug-user/create",
    endpoint: ENDPOINTS.CREATE_JUG_USER,
    body: (get) => get(jugUserInfoAtom),
    onSuccess: (get, qc, form) => {
        qc.invalidateQueries({ queryKey: ["get-patient-info"] });
    },
});
