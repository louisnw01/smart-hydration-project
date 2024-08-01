import { userModeAtom } from "@/atom/user";
import { useAtomValue } from "jotai";

export enum UserMode {
    STANDARD = "Standard",
    CARER = 'Carer',
    ACCESSIBLE = 'Accessible',
}

// const CARER_MODE_SETTINGS = {
//     carerAlias: “Carer”,
//     patientAlias: “Patient”,
// };

// export default function useSettings() {
//     const mode = useAtomValue(userModeAtom)
//     return {
//         // ...CARER_MODE_SETTINGS,
//         isStandard: mode == UserMode.STANDARD,
//         isCarer: mode == UserMode.CARER,
//         isAccessible: mode == UserMode.ACCESSIBLE,
//     };
// }

