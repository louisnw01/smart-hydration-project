import { Link } from "expo-router";

export default function SettingsButton() {
    return (
        <Link href="/settings-modal" className="dark:text-white">
            Settings
        </Link>
    );
}
