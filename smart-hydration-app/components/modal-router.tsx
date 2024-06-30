import { popupPageAtom } from "@/atom/nav";
import { useAtomValue } from "jotai";
import MVPAddDeviceModal from "./devices/mvp-add-device-modal";
import SettingsModal from "./home/settings-modal";

export default function ModalRouter() {
    const modal = useAtomValue(popupPageAtom);

    switch (modal) {
        case "settings":
            return <SettingsModal />;
        case "devices":
            return <MVPAddDeviceModal />;
    }
}
