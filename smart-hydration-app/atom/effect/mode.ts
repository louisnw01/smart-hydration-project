import { UserMode } from "@/constants/user";
import { atomEffect } from "jotai-effect";
import { selectedMemberAtom } from "../community";
import { userInfoQAtom } from "../query";
import { userModeAtom } from "../user";

//
// sets the selected member to the users own info if they don't have a community
//
export const setSelectedMemberInModeEAtom = atomEffect((get, set) => {
    const userMode = get(userModeAtom);
    const { data, isLoading } = get(userInfoQAtom);
    if (
        userMode == UserMode.STANDARD &&
        !isLoading &&
        !data?.has_community &&
        data
    ) {
        set(selectedMemberAtom, {
            id: data?.juguser,
            name: data?.name,
            dailyTarget: data?.target,
        });
    }
});
