import { ENDPOINTS } from "@/util/fetch";
import { atomWithMutationCustom } from "./common";

export const addTagsPatientMAtom = atomWithMutationCustom<{
    memberID: number;
    memberTags: number[];
}>({
    mutationKey: "/jug-user/add-tags-patient",
    endpoint: ENDPOINTS.ADD_TAGS_PATIENT,
});
