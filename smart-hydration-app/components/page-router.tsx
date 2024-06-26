import DevicesPage from "@/app/devices";
import HomePage from "@/app/home";
import TrendsPage from "@/app/trends";
import { selectedPageAtom } from "@/atom/nav";
import { useAtomValue } from "jotai";

export default function PageRouter() {
    const page = useAtomValue(selectedPageAtom)

    switch (page) {
        case 'home':
            return <HomePage />
        case 'trends':
            return <TrendsPage />
        case 'devices':
            return <DevicesPage />
    }
}