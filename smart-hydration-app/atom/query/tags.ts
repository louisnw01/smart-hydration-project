import { ENDPOINTS } from "@/util/fetch";
import { selectedMemberAtom } from "../community";
import { atomWithMutationCustom } from "./common";

export const addTagsPatientMAtom = atomWithMutationCustom({
    mutationKey: "/jug-user/add-tags-patient",
    endpoint: ENDPOINTS.ADD_TAGS_PATIENT,
    body: (get) => ({
        memberId: get(selectedMemberAtom)?.id,
        memberTags: get(selectedMemberAtom)?.tags.map((tag) => tag.id),
    }),
});
