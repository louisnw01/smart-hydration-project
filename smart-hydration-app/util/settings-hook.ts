enum AppMode {
    STANDARD,
    CARER,
    ACCESSIBLE,
}

const CARER_MODE_SETTINGS = {
    carerAlias: "Carer",
    patientAlias: "Patient",
};

export default function useSettings() {
    const mode = AppMode.STANDARD;
    return {
        ...CARER_MODE_SETTINGS,
        isStandard: mode == AppMode.STANDARD,
        isCarer: mode == AppMode.CARER,
        isAccessible: mode == AppMode.ACCESSIBLE,
    };
}
