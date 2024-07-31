import { selectedJugIdAtom } from "@/atom/device";
import PageWrapper from "@/components/common/page-wrapper";
import DeviceSection from "@/components/devices/device-section";
import { router } from "expo-router";
import { useSetAtom } from "jotai";
import { getJugDataQAtom } from "@/atom/query";

export default function DevicesPage() {
    const setJugId = useSetAtom(selectedJugIdAtom);

    return (
        <PageWrapper className="mx-6 mt-6">
            <DeviceSection
                addJugButton
                queryAtom={getJugDataQAtom}
                onPress={(device) => {
                    setJugId(device.id);
                    router.push("device-info-modal");
                }}
            />
        </PageWrapper>
    );
}
