import { userModeAtom } from "@/atom/user";
import { UserMode } from "@/constants/user";
import { useAtomValue } from "jotai";


export default function useSettings() {
    const mode = useAtomValue(userModeAtom)
    return {
        // ...CARER_MODE_SETTINGS,
        isStandard: mode == UserMode.STANDARD,
        isCarer: mode == UserMode.CARER,
        isAccessible: mode == UserMode.ACCESSIBLE,
    };
}